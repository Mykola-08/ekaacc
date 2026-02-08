import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

console.log('STARTING SCRIPT');

try {
  const filePath = path.join(process.cwd(), 'src/context/marketing/LanguageContext.tsx');
  console.log('Target:', filePath);

  if (!fs.existsSync(filePath)) {
    console.error('File not found!');
    process.exit(1);
  }

  let content = fs.readFileSync(filePath, 'utf8');
  console.log('Length:', content.length);
  console.log('Sample:', content.substring(800, 900));

  // Fixes
  // Explicit hex replacement for safety
  // Ã (C3 83) + nbsp (C2 A0)? No.
  // If double encoded from UTF8 to Latin1:
  // à (C3 A0) -> Ã (C3 83) + nbsp (C2 A0)?
  // No, Latin1(C3) is Ã. Latin1(A0) is nbsp.

  let fixed = content;

  const replacements = [
    ['TerÃ\u00A0pies', 'Teràpies'],
    ['Teràpies', 'Teràpies'],
    ['Ã\u00A0', 'à'],
    ['Ã ', 'à'],
    ['á', 'á'],
    ['è', 'è'],
    ['é', 'é'],
    ['Ã\u00AD', 'í'],
    ['ì', 'ì'],
    ['ó', 'ó'],
    ['ò', 'ò'],
    ['ú', 'ú'],
    ['ù', 'ù'],
    ['ç', 'ç'],
    ['·', '·'],
    ['SomÃ\u00A0tica', 'Somàtica'],
    ['somÃ\u00A0tica', 'somàtica'],
    ['ñ', 'ñ'],
    // apostrophe
    ["'", "'"],
    ["d'", "d'"],
    // Euro
    ['€', '€'],
  ];

  for (const [from, to] of replacements) {
    // Use global regex
    // Escape special chars in 'from' if making regex, but replaceAll handles string
    // replaceAll is Node 15+
    if (fixed.replaceAll) {
      fixed = fixed.replaceAll(from, to);
    } else {
      fixed = fixed.split(from).join(to);
    }
  }

  if (fixed !== content) {
    console.log('Writing changes...');
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log('Done.');
  } else {
    console.log('No changes made.');
  }
} catch (e) {
  console.error('Error:', e);
}
