'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { VerseModal } from './VerseModal';

interface VerseLinkProps {
  reference: string;
  osis: string;
  className?: string;
}

export function VerseLink({ reference, osis, className }: VerseLinkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={cn(
          'inline cursor-pointer text-amber-600 underline decoration-amber-600/50 underline-offset-2',
          'hover:text-amber-700 hover:decoration-amber-700',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1',
          'transition-colors duration-150',
          className
        )}
        aria-label={`View ${reference} in multiple translations`}
      >
        {reference}
      </button>
      <VerseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reference={reference}
        osis={osis}
      />
    </>
  );
}
