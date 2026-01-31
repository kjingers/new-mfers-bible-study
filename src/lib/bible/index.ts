// Re-export from books
export { BIBLE_BOOKS, BOOK_PATTERN, getBookOsis } from './books';

// Re-export from parser
export { parseVerseReferences, toOsis, getCanonicalBookName } from './parser';
export type { ParsedReference } from './parser';
