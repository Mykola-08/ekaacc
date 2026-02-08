import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

console.log('STARTING SCRIPT V3');

try {
  const filePath = path.join(process.cwd(), 'src/context/marketing/LanguageContext.tsx');
  console.log('Target:', filePath);

  if (!fs.existsSync(filePath)) {
    console.error('File not found!');
    process.exit(1);
  }

  let content = fs.readFileSync(filePath, 'utf8');
  console.log('Length:', content.length);

  let fixed = content;

  // Replacements array
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
    ["'", "'"],
    ["d'", "d'"],
    // Euro
    ['€', '€'],
  ];

  for (const [from, to] of replacements) {
    const parts = fixed.split(from);
    if (parts.length > 1) {
      console.log(`Replacing ${from} -> ${to} (${parts.length - 1} times)`);
      fixed = parts.join(to);
    }
  }

  if (fixed !== content) {
    console.log('Writing changes...');
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log('Done.');
  } else {
    console.log('No changes made (or patterns not found).');
  }
} catch (e) {
  console.error('Error:', e);
}
