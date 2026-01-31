import { BOOK_PATTERN, getBookOsis, BIBLE_BOOKS } from './books';

export interface ParsedReference {
  rawText: string; // Original matched text (e.g., "Romans 8:28-30")
  book: string; // Canonical book name (e.g., "Romans")
  osis: string; // OSIS reference (e.g., "Rom.8.28-Rom.8.30")
  chapter: number; // Starting chapter
  verse: number; // Starting verse
  endChapter?: number; // Ending chapter (for ranges)
  endVerse?: number; // Ending verse (for ranges)
  startIndex: number; // Position in original text
  endIndex: number; // End position in original text
}

// Pattern should match:
// 1. Book name (using BOOK_PATTERN)
// 2. Optional period after abbreviation
// 3. Whitespace
// 4. Chapter number
// 5. Colon
// 6. Verse number
// 7. Optional range with dash and optional end chapter:verse
const VERSE_REGEX = new RegExp(
  `(?<![A-Za-z0-9])` + // Negative lookbehind
    `(${BOOK_PATTERN})\\.?\\s*` + // Book name with optional period
    `(\\d{1,3}):(\\d{1,3})` + // Chapter:verse
    `(?:\\s*[-–]\\s*(?:(\\d{1,3})\\s*:\\s*)?(\\d{1,3}))?` + // Optional range
    `(?![A-Za-z0-9])`, // Negative loolahead
  'gi'
);

/**
 * Get canonical book name from any book reference
 */
export function getCanonicalBookName(bookRef: string): string | null {
  const normalized = bookRef.trim().toLowerCase();
  for (const [canonical, data] of Object.entries(BIBLE_BOOKS)) {
    if (canonical.toLowerCase() === normalized) return canonical;
    if (data.aliases.some((a) => a.toLowerCase() === normalized)) return canonical;
  }
  return null;
}

/**
 * Convert a parsed reference to OSIS format
 * Examples:
 * - Romans 8:28 → "Rom.8.28"
 * - Romans 8:28-30 → "Rom.8.28-Rom.8.30"
 * - Genesis 1:1-2:3 → "Gen.1.1-Gen.2.3"
 */
export function toOsis(ref: ParsedReference): string {
  const bookOsis = getBookOsis(ref.book);
  if (!bookOsis) {
    throw new Error(`Unknown book: ${ref.book}`);
  }

  const startRef = `${bookOsis}.${ref.chapter}.${ref.verse}`;

  if (ref.endVerse !== undefined) {
    const endChapter = ref.endChapter ?? ref.chapter;
    const endRef = `${bookOsis}.${endChapter}.${ref.endVerse}`;
    return `${startRef}-${endRef}`;
  }

  return startRef;
}

/**
 * Parse all Bible verse references from text
 * Examples:
 * - "Romans 8:28" → single verse
 * - "Romans 8:28-30" → verse range in same chapter
 * - "Genesis 1:1-2:3" → cross-chapter range
 * - "1 Cor 13:4-7" → with abbreviation
 */
export function parseVerseReferences(text: string): ParsedReference[] {
  const results: ParsedReference[] = [];
  let match: RegExpExecArray | null;

  // Reset regex lastIndex to ensure we start from the beginning
  VERSE_REGEX.lastIndex = 0;

  while ((match = VERSE_REGEX.exec(text)) !== null) {
    const [fullMatch, bookRef, chapterStr, verseStr, endChapterStr, endVerseStr] = match;

    // Get canonical book name
    const canonicalBook = getCanonicalBookName(bookRef);
    if (!canonicalBook) {
      continue; // Skip if book is not recognized
    }

    const chapter = parseInt(chapterStr, 10);
    const verse = parseInt(verseStr, 10);
    const endChapter = endChapterStr ? parseInt(endChapterStr, 10) : undefined;
    const endVerse = endVerseStr ? parseInt(endVerseStr, 10) : undefined;

    const parsedRef: ParsedReference = {
      rawText: fullMatch,
      book: canonicalBook,
      osis: '', // Will be set below
      chapter,
      verse,
      endChapter,
      endVerse,
      startIndex: match.index,
      endIndex: match.index + fullMatch.length,
    };

    // Set OSIS using the toOsis function
    parsedRef.osis = toOsis(parsedRef);

    results.push(parsedRef);
  }

  return results;
}
