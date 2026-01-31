export const BIBLE_BOOKS: Record<string, { osis: string; aliases: string[] }> = {
  // Old Testament
  Genesis: { osis: 'Gen', aliases: ['Gen', 'Ge', 'Gn'] },
  Exodus: { osis: 'Exod', aliases: ['Exod', 'Ex', 'Exo'] },
  Leviticus: { osis: 'Lev', aliases: ['Lev', 'Le', 'Lv'] },
  Numbers: { osis: 'Num', aliases: ['Num', 'Nu', 'Nm', 'Nb'] },
  Deuteronomy: { osis: 'Deut', aliases: ['Deut', 'De', 'Dt'] },
  Joshua: { osis: 'Josh', aliases: ['Josh', 'Jos', 'Jsh'] },
  Judges: { osis: 'Judg', aliases: ['Judg', 'Jdg', 'Jg', 'Jdgs'] },
  Ruth: { osis: 'Ruth', aliases: ['Ruth', 'Ru', 'Rth'] },
  '1 Samuel': {
    osis: '1Sam',
    aliases: ['1 Sam', '1Sam', '1Sa', '1 Samuel', 'I Samuel', 'I Sam', '1S'],
  },
  '2 Samuel': {
    osis: '2Sam',
    aliases: ['2 Sam', '2Sam', '2Sa', '2 Samuel', 'II Samuel', 'II Sam', '2S'],
  },
  '1 Kings': {
    osis: '1Kgs',
    aliases: ['1 Kings', '1Kgs', '1 Kgs', '1Ki', '1K', 'I Kings', 'I Kgs', '1Kings'],
  },
  '2 Kings': {
    osis: '2Kgs',
    aliases: ['2 Kings', '2Kgs', '2 Kgs', '2Ki', '2K', 'II Kings', 'II Kgs', '2Kings'],
  },
  '1 Chronicles': {
    osis: '1Chr',
    aliases: ['1 Chr', '1Chr', '1Ch', '1 Chronicles', 'I Chronicles', 'I Chr', '1Chron'],
  },
  '2 Chronicles': {
    osis: '2Chr',
    aliases: ['2 Chr', '2Chr', '2Ch', '2 Chronicles', 'II Chronicles', 'II Chr', '2Chron'],
  },
  Ezra: { osis: 'Ezra', aliases: ['Ezra', 'Ezr', 'Ez'] },
  Nehemiah: { osis: 'Neh', aliases: ['Neh', 'Ne'] },
  Esther: { osis: 'Esth', aliases: ['Esth', 'Est', 'Es'] },
  Job: { osis: 'Job', aliases: ['Job', 'Jb'] },
  Psalms: { osis: 'Ps', aliases: ['Ps', 'Psalm', 'Psalms', 'Psa', 'Psm', 'Pss'] },
  Proverbs: { osis: 'Prov', aliases: ['Prov', 'Pro', 'Prv', 'Pr'] },
  Ecclesiastes: { osis: 'Eccl', aliases: ['Eccl', 'Ecc', 'Ec', 'Qoh'] },
  'Song of Solomon': {
    osis: 'Song',
    aliases: ['Song', 'SOS', 'SS', 'Song of Songs', 'Canticles', 'Canticle of Canticles'],
  },
  Isaiah: { osis: 'Isa', aliases: ['Isa', 'Is'] },
  Jeremiah: { osis: 'Jer', aliases: ['Jer', 'Je', 'Jr'] },
  Lamentations: { osis: 'Lam', aliases: ['Lam', 'La'] },
  Ezekiel: { osis: 'Ezek', aliases: ['Ezek', 'Eze', 'Ezk'] },
  Daniel: { osis: 'Dan', aliases: ['Dan', 'Da', 'Dn'] },
  Hosea: { osis: 'Hos', aliases: ['Hos', 'Ho'] },
  Joel: { osis: 'Joel', aliases: ['Joel', 'Joe', 'Jl'] },
  Amos: { osis: 'Amos', aliases: ['Amos', 'Am'] },
  Obadiah: { osis: 'Obad', aliases: ['Obad', 'Ob'] },
  Jonah: { osis: 'Jonah', aliases: ['Jonah', 'Jon', 'Jnh'] },
  Micah: { osis: 'Mic', aliases: ['Mic', 'Mc'] },
  Nahum: { osis: 'Nah', aliases: ['Nah', 'Na'] },
  Habakkuk: { osis: 'Hab', aliases: ['Hab', 'Hb'] },
  Zephaniah: { osis: 'Zeph', aliases: ['Zeph', 'Zep', 'Zp'] },
  Haggai: { osis: 'Hag', aliases: ['Hag', 'Hg'] },
  Zechariah: { osis: 'Zech', aliases: ['Zech', 'Zec', 'Zc'] },
  Malachi: { osis: 'Mal', aliases: ['Mal', 'Ml'] },

  // New Testament
  Matthew: { osis: 'Matt', aliases: ['Matt', 'Mt', 'Mat'] },
  Mark: { osis: 'Mark', aliases: ['Mark', 'Mk', 'Mr'] },
  Luke: { osis: 'Luke', aliases: ['Luke', 'Lk', 'Lu'] },
  John: { osis: 'John', aliases: ['John', 'Jn', 'Jhn'] },
  Acts: { osis: 'Acts', aliases: ['Acts', 'Ac', 'Act'] },
  Romans: { osis: 'Rom', aliases: ['Rom', 'Ro', 'Rm'] },
  '1 Corinthians': {
    osis: '1Cor',
    aliases: ['1 Cor', '1Cor', '1Co', '1 Corinthians', 'I Corinthians', 'I Cor', '1C'],
  },
  '2 Corinthians': {
    osis: '2Cor',
    aliases: ['2 Cor', '2Cor', '2Co', '2 Corinthians', 'II Corinthians', 'II Cor', '2C'],
  },
  Galatians: { osis: 'Gal', aliases: ['Gal', 'Ga'] },
  Ephesians: { osis: 'Eph', aliases: ['Eph', 'Ephes'] },
  Philippians: { osis: 'Phil', aliases: ['Phil', 'Php', 'Pp'] },
  Colossians: { osis: 'Col', aliases: ['Col', 'Co'] },
  '1 Thessalonians': {
    osis: '1Thess',
    aliases: ['1 Thess', '1Thess', '1Th', '1 Thessalonians', 'I Thessalonians', 'I Thess', '1Ts'],
  },
  '2 Thessalonians': {
    osis: '2Thess',
    aliases: ['2 Thess', '2Thess', '2Th', '2 Thessalonians', 'II Thessalonians', 'II Thess', '2Ts'],
  },
  '1 Timothy': {
    osis: '1Tim',
    aliases: ['1 Tim', '1Tim', '1Ti', '1 Timothy', 'I Timothy', 'I Tim', '1T'],
  },
  '2 Timothy': {
    osis: '2Tim',
    aliases: ['2 Tim', '2Tim', '2Ti', '2 Timothy', 'II Timothy', 'II Tim', '2T'],
  },
  Titus: { osis: 'Titus', aliases: ['Titus', 'Tit', 'Ti'] },
  Philemon: { osis: 'Phlm', aliases: ['Phlm', 'Phm', 'Pm', 'Philemon'] },
  Hebrews: { osis: 'Heb', aliases: ['Heb', 'He'] },
  James: { osis: 'Jas', aliases: ['Jas', 'Ja', 'Jm'] },
  '1 Peter': {
    osis: '1Pet',
    aliases: ['1 Pet', '1Pet', '1Pe', '1P', '1 Peter', 'I Peter', 'I Pet'],
  },
  '2 Peter': {
    osis: '2Pet',
    aliases: ['2 Pet', '2Pet', '2Pe', '2P', '2 Peter', 'II Peter', 'II Pet'],
  },
  '1 John': { osis: '1John', aliases: ['1 John', '1John', '1Jn', '1Jo', '1J', 'I John', 'I Jn'] },
  '2 John': { osis: '2John', aliases: ['2 John', '2John', '2Jn', '2Jo', '2J', 'II John', 'II Jn'] },
  '3 John': {
    osis: '3John',
    aliases: ['3 John', '3John', '3Jn', '3Jo', '3J', 'III John', 'III Jn'],
  },
  Jude: { osis: 'Jude', aliases: ['Jude', 'Jd'] },
  Revelation: { osis: 'Rev', aliases: ['Rev', 'Re', 'Revelation', 'Apocalypse'] },
};

// Build a lookup map for quick access
const bookLookup = new Map<string, string>();

// Populate lookup map with canonical names and aliases
Object.entries(BIBLE_BOOKS).forEach(([canonicalName, book]) => {
  // Add canonical name
  bookLookup.set(canonicalName.toLowerCase(), book.osis);

  // Add all aliases
  book.aliases.forEach((alias) => {
    bookLookup.set(alias.toLowerCase(), book.osis);
  });
});

export function getBookOsis(bookName: string): string | null {
  const normalized = bookName.trim();
  return bookLookup.get(normalized.toLowerCase()) ?? null;
}

// Export regex pattern for matching book names
export const BOOK_PATTERN = Object.keys(BIBLE_BOOKS)
  .flatMap((name) => [name, ...BIBLE_BOOKS[name].aliases])
  .sort((a, b) => b.length - a.length) // Longest first to match "1 Corinthians" before "1 Cor"
  .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape regex special characters
  .join('|');
