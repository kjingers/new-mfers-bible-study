'use client';

import { useMemo } from 'react';
import { parseVerseReferences } from '@/lib/bible';
import { VerseLink } from './VerseLink';

interface VerseTextProps {
  text: string;
  className?: string;
}

interface TextSegment {
  type: 'text' | 'verse';
  content: string;
  osis?: string;
}

export function VerseText({ text, className }: VerseTextProps) {
  const segments = useMemo(() => {
    const references = parseVerseReferences(text);

    if (references.length === 0) {
      return [{ type: 'text' as const, content: text }];
    }

    const result: TextSegment[] = [];
    let lastIndex = 0;

    for (const ref of references) {
      // Add text before this reference
      if (ref.startIndex > lastIndex) {
        result.push({
          type: 'text',
          content: text.slice(lastIndex, ref.startIndex),
        });
      }

      // Add the verse reference
      result.push({
        type: 'verse',
        content: ref.rawText,
        osis: ref.osis,
      });

      lastIndex = ref.endIndex;
    }

    // Add remaining text after last reference
    if (lastIndex < text.length) {
      result.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    return result;
  }, [text]);

  // If no verse references found, just return plain text
  if (segments.length === 1 && segments[0].type === 'text') {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.type === 'verse' ? (
          <VerseLink
            key={`${segment.osis}-${index}`}
            reference={segment.content}
            osis={segment.osis!}
          />
        ) : (
          <span key={index}>{segment.content}</span>
        )
      )}
    </span>
  );
}
