import { describe, it, expect } from 'vitest';
import { parseVerseReferences, toOsis, getCanonicalBookName, type ParsedReference } from './parser';
import { getBookOsis, BIBLE_BOOKS } from './books';

describe('getBookOsis', () => {
  it('returns OSIS code for full book names', () => {
    expect(getBookOsis('Genesis')).toBe('Gen');
    expect(getBookOsis('Romans')).toBe('Rom');
    expect(getBookOsis('Revelation')).toBe('Rev');
  });

  it('returns OSIS code for abbreviated book names', () => {
    expect(getBookOsis('Gen')).toBe('Gen');
    expect(getBookOsis('Rom')).toBe('Rom');
    expect(getBookOsis('Rev')).toBe('Rev');
  });

  it('handles case-insensitive lookup', () => {
    expect(getBookOsis('genesis')).toBe('Gen');
    expect(getBookOsis('ROMANS')).toBe('Rom');
    expect(getBookOsis('rOmAnS')).toBe('Rom');
  });

  it('handles numbered books', () => {
    expect(getBookOsis('1 Samuel')).toBe('1Sam');
    expect(getBookOsis('2 Kings')).toBe('2Kgs');
    expect(getBookOsis('1 Corinthians')).toBe('1Cor');
    expect(getBookOsis('2 Corinthians')).toBe('2Cor');
    expect(getBookOsis('1 John')).toBe('1John');
  });

  it('handles common abbreviations', () => {
    expect(getBookOsis('Matt')).toBe('Matt');
    expect(getBookOsis('Mt')).toBe('Matt');
    expect(getBookOsis('1 Cor')).toBe('1Cor');
    expect(getBookOsis('Ps')).toBe('Ps');
    expect(getBookOsis('Jn')).toBe('John');
  });

  it('returns null for invalid books', () => {
    expect(getBookOsis('NotABook')).toBeNull();
    expect(getBookOsis('')).toBeNull();
  });
});

describe('getCanonicalBookName', () => {
  it('returns canonical name for full book names', () => {
    expect(getCanonicalBookName('Genesis')).toBe('Genesis');
    expect(getCanonicalBookName('Romans')).toBe('Romans');
  });

  it('returns canonical name for abbreviations', () => {
    expect(getCanonicalBookName('Gen')).toBe('Genesis');
    expect(getCanonicalBookName('Rom')).toBe('Romans');
    expect(getCanonicalBookName('Mt')).toBe('Matthew');
  });

  it('handles case insensitivity', () => {
    expect(getCanonicalBookName('genesis')).toBe('Genesis');
    expect(getCanonicalBookName('GENESIS')).toBe('Genesis');
  });

  it('returns null for invalid books', () => {
    expect(getCanonicalBookName('NotABook')).toBeNull();
  });
});

describe('toOsis', () => {
  it('converts single verse to OSIS', () => {
    const ref: ParsedReference = {
      rawText: 'Romans 8:28',
      book: 'Romans',
      osis: '',
      chapter: 8,
      verse: 28,
      startIndex: 0,
      endIndex: 11,
    };
    expect(toOsis(ref)).toBe('Rom.8.28');
  });

  it('converts verse range in same chapter to OSIS', () => {
    const ref: ParsedReference = {
      rawText: 'Romans 8:28-30',
      book: 'Romans',
      osis: '',
      chapter: 8,
      verse: 28,
      endVerse: 30,
      startIndex: 0,
      endIndex: 14,
    };
    expect(toOsis(ref)).toBe('Rom.8.28-Rom.8.30');
  });

  it('converts cross-chapter range to OSIS', () => {
    const ref: ParsedReference = {
      rawText: 'Genesis 1:1-2:3',
      book: 'Genesis',
      osis: '',
      chapter: 1,
      verse: 1,
      endChapter: 2,
      endVerse: 3,
      startIndex: 0,
      endIndex: 15,
    };
    expect(toOsis(ref)).toBe('Gen.1.1-Gen.2.3');
  });

  it('throws for unknown book', () => {
    const ref: ParsedReference = {
      rawText: 'NotABook 1:1',
      book: 'NotABook',
      osis: '',
      chapter: 1,
      verse: 1,
      startIndex: 0,
      endIndex: 12,
    };
    expect(() => toOsis(ref)).toThrow('Unknown book: NotABook');
  });
});

describe('parseVerseReferences', () => {
  describe('single verses', () => {
    it('parses single verse reference', () => {
      const refs = parseVerseReferences('Read Romans 8:28 today');
      expect(refs).toHaveLength(1);
      expect(refs[0].book).toBe('Romans');
      expect(refs[0].chapter).toBe(8);
      expect(refs[0].verse).toBe(28);
      expect(refs[0].osis).toBe('Rom.8.28');
      expect(refs[0].rawText).toBe('Romans 8:28');
    });

    it('parses abbreviated book names', () => {
      const refs = parseVerseReferences('See Rom 8:28');
      expect(refs).toHaveLength(1);
      expect(refs[0].book).toBe('Romans');
      expect(refs[0].osis).toBe('Rom.8.28');
    });

    it('parses numbered books', () => {
      const refs = parseVerseReferences('1 Corinthians 13:4');
      expect(refs).toHaveLength(1);
      expect(refs[0].book).toBe('1 Corinthians');
      expect(refs[0].osis).toBe('1Cor.13.4');
    });

    it('parses abbreviated numbered books', () => {
      const refs = parseVerseReferences('1 Cor 13:4 is about love');
      expect(refs).toHaveLength(1);
      expect(refs[0].book).toBe('1 Corinthians');
      expect(refs[0].osis).toBe('1Cor.13.4');
    });
  });

  describe('verse ranges', () => {
    it('parses verse range in same chapter', () => {
      const refs = parseVerseReferences('Romans 8:28-30');
      expect(refs).toHaveLength(1);
      expect(refs[0].chapter).toBe(8);
      expect(refs[0].verse).toBe(28);
      expect(refs[0].endChapter).toBeUndefined();
      expect(refs[0].endVerse).toBe(30);
      expect(refs[0].osis).toBe('Rom.8.28-Rom.8.30');
    });

    it('parses cross-chapter range', () => {
      const refs = parseVerseReferences('Genesis 1:1-2:3');
      expect(refs).toHaveLength(1);
      expect(refs[0].chapter).toBe(1);
      expect(refs[0].verse).toBe(1);
      expect(refs[0].endChapter).toBe(2);
      expect(refs[0].endVerse).toBe(3);
      expect(refs[0].osis).toBe('Gen.1.1-Gen.2.3');
    });

    it('handles en-dash in ranges', () => {
      const refs = parseVerseReferences('Romans 8:28–30');
      expect(refs).toHaveLength(1);
      expect(refs[0].endVerse).toBe(30);
    });
  });

  describe('multiple references', () => {
    it('parses multiple references in text', () => {
      const refs = parseVerseReferences('Compare Romans 8:28 with John 3:16');
      expect(refs).toHaveLength(2);
      expect(refs[0].book).toBe('Romans');
      expect(refs[0].osis).toBe('Rom.8.28');
      expect(refs[1].book).toBe('John');
      expect(refs[1].osis).toBe('John.3.16');
    });

    it('parses multiple references on same line', () => {
      const refs = parseVerseReferences('Psalm 23:1, Proverbs 3:5-6, and Matthew 6:33');
      expect(refs).toHaveLength(3);
      expect(refs[0].book).toBe('Psalms');
      expect(refs[1].book).toBe('Proverbs');
      expect(refs[2].book).toBe('Matthew');
    });
  });

  describe('position tracking', () => {
    it('tracks start and end indices', () => {
      const text = 'Read Romans 8:28 today';
      const refs = parseVerseReferences(text);
      expect(refs[0].startIndex).toBe(5);
      expect(refs[0].endIndex).toBe(16);
      expect(text.slice(refs[0].startIndex, refs[0].endIndex)).toBe('Romans 8:28');
    });

    it('tracks multiple reference positions', () => {
      const text = 'See Romans 8:28 and John 3:16';
      const refs = parseVerseReferences(text);
      expect(refs).toHaveLength(2);
      expect(text.slice(refs[0].startIndex, refs[0].endIndex)).toBe('Romans 8:28');
      expect(text.slice(refs[1].startIndex, refs[1].endIndex)).toBe('John 3:16');
    });
  });

  describe('edge cases', () => {
    it('returns empty array for text with no references', () => {
      const refs = parseVerseReferences('No Bible references here');
      expect(refs).toHaveLength(0);
    });

    it('returns empty array for empty string', () => {
      const refs = parseVerseReferences('');
      expect(refs).toHaveLength(0);
    });

    it('handles reference at start of text', () => {
      const refs = parseVerseReferences('John 3:16 is famous');
      expect(refs).toHaveLength(1);
      expect(refs[0].startIndex).toBe(0);
    });

    it('handles reference at end of text', () => {
      const refs = parseVerseReferences('The verse is John 3:16');
      expect(refs).toHaveLength(1);
    });

    it('ignores invalid chapter:verse patterns', () => {
      // Should not match things that look like times or other numbers
      const refs = parseVerseReferences('The meeting is at 3:30pm');
      expect(refs).toHaveLength(0);
    });

    it('handles books with periods after abbreviation', () => {
      const refs = parseVerseReferences('See Rom. 8:28');
      expect(refs).toHaveLength(1);
      expect(refs[0].book).toBe('Romans');
    });

    it('handles case variations', () => {
      const refs = parseVerseReferences('JOHN 3:16 and john 3:17');
      expect(refs).toHaveLength(2);
      expect(refs[0].book).toBe('John');
      expect(refs[1].book).toBe('John');
    });

    it('handles three-digit chapters and verses (Psalms)', () => {
      const refs = parseVerseReferences('Psalm 119:105');
      expect(refs).toHaveLength(1);
      expect(refs[0].chapter).toBe(119);
      expect(refs[0].verse).toBe(105);
    });
  });

  describe('Bible book coverage', () => {
    it('recognizes all 66 Bible books', () => {
      const bookCount = Object.keys(BIBLE_BOOKS).length;
      expect(bookCount).toBe(66);
    });

    it('parses references from various books', () => {
      const testCases = [
        { input: 'Genesis 1:1', book: 'Genesis', osis: 'Gen.1.1' },
        { input: 'Exodus 20:1', book: 'Exodus', osis: 'Exod.20.1' },
        { input: 'Psalm 23:1', book: 'Psalms', osis: 'Ps.23.1' },
        { input: 'Isaiah 53:5', book: 'Isaiah', osis: 'Isa.53.5' },
        { input: 'Matthew 5:3', book: 'Matthew', osis: 'Matt.5.3' },
        { input: 'John 1:1', book: 'John', osis: 'John.1.1' },
        { input: 'Acts 2:38', book: 'Acts', osis: 'Acts.2.38' },
        { input: 'Romans 12:1', book: 'Romans', osis: 'Rom.12.1' },
        { input: 'Revelation 22:21', book: 'Revelation', osis: 'Rev.22.21' },
      ];

      for (const { input, book, osis } of testCases) {
        const refs = parseVerseReferences(input);
        expect(refs).toHaveLength(1);
        expect(refs[0].book).toBe(book);
        expect(refs[0].osis).toBe(osis);
      }
    });
  });
});
