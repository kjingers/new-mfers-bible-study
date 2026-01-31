import { NextRequest, NextResponse } from 'next/server';
import 'openai/shims/node';
import { AzureOpenAI } from 'openai';
import '@azure/openai/types';
import { parseVerseReferences } from '@/lib/bible';
import { getContainer, CONTAINERS } from '@/lib/db/client';
import type { CachedVerse, TranslationCode, VerseResponse } from '@/types';

const DEFAULT_TRANSLATIONS: TranslationCode[] = ['NIV', 'KJV', 'NLT', 'MSG'];
const ALLOWED_TRANSLATIONS = new Set<TranslationCode>(DEFAULT_TRANSLATIONS);

function parseRequestedTranslations(param: string | null): TranslationCode[] {
  if (!param) return DEFAULT_TRANSLATIONS;

  const requested = param
    .split(',')
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean)
    .filter((value): value is TranslationCode =>
      ALLOWED_TRANSLATIONS.has(value as TranslationCode)
    );

  return requested.length > 0 ? requested : DEFAULT_TRANSLATIONS;
}

function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const maybeError = error as { code?: number; statusCode?: number };
  return maybeError.code === 404 || maybeError.statusCode === 404;
}

function isAzureOpenAIConfigured(): boolean {
  return Boolean(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY);
}

function createAzureOpenAIClient(): AzureOpenAI {
  return new AzureOpenAI({
    endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
    apiKey: process.env.AZURE_OPENAI_API_KEY!,
    apiVersion: '2024-02-15-preview',
  });
}

async function fetchMissingTranslations(reference: string, translations: TranslationCode[]) {
  const client = createAzureOpenAIClient();
  const response = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a Bible verse retrieval assistant. Return the exact text of requested Bible passages. Do not paraphrase, summarize, or add commentary. If the passage does not exist, return an error message.',
      },
      {
        role: 'user',
        content: `Return the text of ${reference} in these translations: ${translations.join(', ')}. 
      
Return as JSON in this exact format:
{
  "NIV": "verse text here...",
  "KJV": "verse text here...",
  // etc for each requested translation
}

Only return the JSON, nothing else.`,
      },
    ],
    temperature: 0,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Azure OpenAI');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content) as Record<string, unknown>;
  } catch {
    throw new Error('Failed to parse Azure OpenAI response');
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const refParam = searchParams.get('ref');

  if (!refParam || refParam.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid verse reference' }, { status: 400 });
  }

  const parsedRefs = parseVerseReferences(refParam);
  if (parsedRefs.length === 0) {
    return NextResponse.json({ error: 'Invalid verse reference' }, { status: 400 });
  }

  const parsedRef = parsedRefs[0];
  const rawRef = refParam.trim();
  const osis = parsedRef.osis;
  const requestedTranslations = parseRequestedTranslations(searchParams.get('translations'));

  const translations: Record<TranslationCode, { ok: boolean; text?: string; error?: string }> =
    {} as Record<TranslationCode, { ok: boolean; text?: string; error?: string }>;

  let versesContainer: ReturnType<typeof getContainer> | null = null;
  try {
    versesContainer = getContainer(CONTAINERS.VERSES);
  } catch (error) {
    console.error('Cosmos DB not configured:', error);
  }

  const missingTranslations: TranslationCode[] = [];

  for (const translation of requestedTranslations) {
    const cacheKey = `${osis}|${translation}`;

    if (!versesContainer) {
      missingTranslations.push(translation);
      continue;
    }

    try {
      const { resource } = await versesContainer.item(cacheKey, osis).read<CachedVerse>();

      if (resource?.text) {
        translations[translation] = { ok: true, text: resource.text };
        continue;
      }
    } catch (error) {
      if (!isNotFoundError(error)) {
        console.error('Error reading verse cache:', error);
      }
    }

    missingTranslations.push(translation);
  }

  if (missingTranslations.length > 0) {
    if (!isAzureOpenAIConfigured()) {
      if (Object.keys(translations).length === 0) {
        return NextResponse.json({ error: 'Failed to fetch verse' }, { status: 500 });
      }

      for (const translation of missingTranslations) {
        translations[translation] = {
          ok: false,
          error: 'Azure OpenAI not configured',
        };
      }
    } else {
      try {
        const openAiResponse = await fetchMissingTranslations(rawRef, missingTranslations);

        for (const translation of missingTranslations) {
          const value = openAiResponse[translation];
          if (typeof value === 'string' && value.trim().length > 0) {
            const verseText = value.trim();
            translations[translation] = { ok: true, text: verseText };

            if (versesContainer) {
              try {
                await versesContainer.items.create<CachedVerse>({
                  id: `${osis}|${translation}`,
                  osis,
                  translation,
                  text: verseText,
                  fetchedAt: new Date().toISOString(),
                });
              } catch (error) {
                console.error('Error writing verse cache:', error);
              }
            }
          } else {
            translations[translation] = {
              ok: false,
              error: 'Azure OpenAI response missing translation',
            };
          }
        }
      } catch (error) {
        console.error('Error fetching verse from Azure OpenAI:', error);

        if (Object.keys(translations).length === 0) {
          return NextResponse.json({ error: 'Failed to fetch verse' }, { status: 500 });
        }

        for (const translation of missingTranslations) {
          translations[translation] = {
            ok: false,
            error: 'Failed to fetch translation',
          };
        }
      }
    }
  }

  const response: VerseResponse = {
    rawRef,
    osis,
    translations,
  };

  return NextResponse.json({ data: response });
}
