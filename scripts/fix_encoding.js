import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const filePath = path.join(process.cwd(), 'src/context/marketing/LanguageContext.tsx');

console.log('Reading file:', filePath);
let content = fs.readFileSync(filePath, 'utf8');

// Common double-encoding patterns usually resulting from UTF-8 interpreted as Latin-1 (ISO-8859-1) or Windows-1252
// and then saved as UTF-8 again.

const replacements = [
  { from: 'Ã ', to: 'à' },
  { from: 'á', to: 'á' },
  { from: 'è', to: 'è' },
  { from: 'é', to: 'é' },
  { from: 'ì', to: 'ì' },
  { from: 'Ã\xad', to: 'í' }, // 0xAD is soft hyphen, often invisible or weird
  { from: 'Ã\u00AD', to: 'í' },
  { from: 'Ã\u008D', to: 'í' }, // sometimes C3 8D
  { from: 'Ãò', to: 'ò' },
  { from: 'ó', to: 'ó' },
  { from: 'ù', to: 'ù' },
  { from: 'ú', to: 'ú' },
  { from: 'ç', to: 'ç' },
  { from: '·', to: '·' },
  { from: 'ñ', to: 'ñ' },
  { from: "'", to: '’' },
  { from: 'â€œ', to: '“' },
  { from: 'â€\u009d', to: '”' }, // closing quote
  { from: 'â€“', to: '–' }, // en dash
];

// We need to be careful with replaceAll and regex.
// The issue is likely that the file content literally contains valid UTF-8 characters that represent the "garbage".
// E.g. 0xC3 0x83 0xC2 0xA9 for 'é' if it was double-double encoded?
// No, the user sees "Teràpies". "Ã" is U+00C3. " " (nbsp) is U+00A0.
// So the string in JS memory is \u00C3\u00A0.
// We want to replace \u00C3\u00A0 with \u00E0 ('à').

// Let's iterate and replace.
let newContent = content;

// Map of manual fixes observed in grep
const manualFixes = [
  { from: 'Teràpies', to: 'Teràpies' },
  { from: 'somÃ tica', to: 'somàtica' },
  { from: 'ú', to: 'ú' },
  { from: 'ó', to: 'ó' },
  { from: 'més', to: 'més' },
  { from: 'enllÃ ', to: 'enllà' },
  { from: 'prÃ ctica', to: 'pràctica' },
  { from: 'què', to: 'què' },
  { from: 'estÃ ', to: 'està' },
  { from: 'biològic', to: 'biològic' },
  { from: 'fÃsic', to: 'físic' },
  { from: '€', to: '€' }, // Euro symbol! 0xE2 0x82 0xAC -> € (0xE2, 0x82, 0xAC in latin1)
];

// Generic "buffer" approach is best for generalized double dictionary
// Convert string to Buffer (utf8), then interpret that buffer as Latin1?
// if I have "é" (C3 A9 in UTF8 bytes), and I interpret it as C3 A9 bytes? No.
// The file on disk has C3 83 C2 A9 (UTF8 for é) ? No.
// The file is UTF8. It contains the character "Ã" (C3 83) and "©" (C2 A9).
// So in memory I have \u00C3 \u00A9.
// I want to turn \u00C3 \u00A9 into \u00E9.

// Let's try the buffer trick.
// 1. Get the bytes of the string as if it was Latin1.
//    If I have \u00C3, Latin1 code is 0xC3.
//    If I have \u00A9, Latin1 code is 0xA9.
//    So I construct a buffer [0xC3, 0xA9].
//    Then decode that buffer as UTF-8. 0xC3 0xA9 is UTF-8 for 'é'.

function fixEncoding(str) {
  try {
    // Only fix if it looks like mojibake.
    // Heuristic: lots of Ã (C3) and Â (C2).
    // But we are running on the whole file, so we must safely detect sections?
    // Or just run it on string literals?
    // Running on the whole file is risky if there are actual Ã characters intended.
    // But in a source code file, Ã is rare unless in strings.

    // Let's try to map specific chars.
    const chars = str.split('');
    const bytes = [];
    let changed = false;

    // This is getting complicated to do safely.
    // Let's use the replacement map which is safer.

    let fixed = str;

    // Euro
    fixed = fixed.replaceAll('€', '€');

    // Standard Vowels
    fixed = fixed.replaceAll('Ã ', 'à'); // nbsp
    fixed = fixed.replaceAll('Ã\u00A0', 'à');
    fixed = fixed.replaceAll('á', 'á');
    fixed = fixed.replaceAll('Ã¢', 'â');
    fixed = fixed.replaceAll('Ã£', 'ã');
    fixed = fixed.replaceAll('Ã¤', 'ä');

    fixed = fixed.replaceAll('è', 'è');
    fixed = fixed.replaceAll('é', 'é');
    fixed = fixed.replaceAll('Ãª', 'ê');
    fixed = fixed.replaceAll('Ã«', 'ë');

    fixed = fixed.replaceAll('ì', 'ì');
    fixed = fixed.replaceAll('Ã\u00AD', 'í'); // soft hyphen
    fixed = fixed.replaceAll('Ã®', 'î');
    fixed = fixed.replaceAll('ï', 'ï');

    fixed = fixed.replaceAll('ò', 'ò');
    fixed = fixed.replaceAll('ó', 'ó');
    fixed = fixed.replaceAll('Ã´', 'ô');
    fixed = fixed.replaceAll('Ãµ', 'õ');
    fixed = fixed.replaceAll('Ã¶', 'ö');

    fixed = fixed.replaceAll('ù', 'ù');
    fixed = fixed.replaceAll('ú', 'ú');
    fixed = fixed.replaceAll('Ã»', 'û');
    fixed = fixed.replaceAll('ü', 'ü');

    fixed = fixed.replaceAll('ñ', 'ñ');
    fixed = fixed.replaceAll('ç', 'ç');

    fixed = fixed.replaceAll('·', '·');

    return fixed;
  } catch (e) {
    console.error(e);
    return str;
  }
}

const fixed = fixEncoding(content);

if (fixed !== content) {
  console.log('Encoding issues found and fixed.');
  fs.writeFileSync(filePath, fixed, 'utf8');
} else {
  console.log('No encoding changes needed.');
}
