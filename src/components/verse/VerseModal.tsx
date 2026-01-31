'use client';

import { useEffect, useState, useCallback } from 'react';
import { Modal } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { TranslationCode, VerseResponse } from '@/types';

interface VerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  osis: string;
}

const TRANSLATIONS: TranslationCode[] = ['NIV', 'KJV', 'NLT', 'MSG'];
const STORAGE_KEY = 'bible-study-preferred-translation';

function getStoredTranslation(): TranslationCode {
  if (typeof window === 'undefined') return 'NIV';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && TRANSLATIONS.includes(stored as TranslationCode)) {
    return stored as TranslationCode;
  }
  return 'NIV';
}

function setStoredTranslation(translation: TranslationCode) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, translation);
}

export function VerseModal({ isOpen, onClose, reference, osis }: VerseModalProps) {
  const [activeTab, setActiveTab] = useState<TranslationCode>(() => getStoredTranslation());
  const [data, setData] = useState<VerseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerses = useCallback(async () => {
    if (!osis) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/verses?ref=${encodeURIComponent(osis)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch verses');
      }
      const json = await response.json();
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verses');
    } finally {
      setIsLoading(false);
    }
  }, [osis]);

  useEffect(() => {
    if (isOpen && osis) {
      fetchVerses();
    }
  }, [isOpen, osis, fetchVerses]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(getStoredTranslation());
    }
  }, [isOpen]);

  const handleTabChange = (translation: TranslationCode) => {
    setActiveTab(translation);
    setStoredTranslation(translation);
  };

  const currentTranslation = data?.translations[activeTab];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reference}
      className="max-h-[80vh] overflow-hidden flex flex-col"
    >
      {/* Translation Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-stone-200 pb-2 mb-4 dark:border-stone-700">
        {TRANSLATIONS.map((translation) => (
          <button
            key={translation}
            type="button"
            onClick={() => handleTabChange(translation)}
            className={cn(
              'min-h-[44px] px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
              activeTab === translation
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700'
            )}
            aria-pressed={activeTab === translation}
          >
            {translation}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto min-h-[200px]">
        {isLoading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-full" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-11/12" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-10/12" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-full" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-9/12" />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              type="button"
              onClick={fetchVerses}
              className="min-h-[44px] px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && currentTranslation && (
          <div className="prose prose-stone dark:prose-invert max-w-none">
            {currentTranslation.ok && currentTranslation.text ? (
              <p className="font-serif text-lg leading-relaxed text-stone-800 dark:text-stone-200">
                {currentTranslation.text}
              </p>
            ) : (
              <p className="text-stone-500 dark:text-stone-400 italic">
                {currentTranslation.error || 'Translation not available'}
              </p>
            )}
          </div>
        )}

        {!isLoading && !error && !currentTranslation && data && (
          <p className="text-stone-500 dark:text-stone-400 italic text-center py-8">
            No verse data available
          </p>
        )}
      </div>
    </Modal>
  );
}
