
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const files = [
  'src/context/translations.ts',
  'src/context/marketing/LanguageContext.tsx',
];

console.log('Checking encoding...');

for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        continue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for suspicious chars common in Mojibake like Ã (C3), etc.
    // Or specifically the sequence found earlier (D0/D1 pairs).
    let suspensions = 0;
    
    for(let i=0; i<content.length; i++) {
        if (content[i] === '\u00D0' || content[i] === '\u00D1') {
             // This is suspicious if followed by 80-9F range chars which are NOT valid UTF-8 continuations 
             // BUT D0/D1 ARE valid lead bytes for Cyrillic. 
             // We need to differentiate "Double encoded UTF-8" vs "Valid UTF-8".
             // Valid UTF-8 Cyrillic: D0 [90-BF], D1 [80-8F]
             // Double encoded (Win1252): D0 = Ð, followed by something that looks like Win1252 char.
             
             // Wait, the previous fix was:
             // Found D0/D1. Next char was NOT a valid UTF-8 continuation byte (80-BF) AT ALL?
             // No, the previous fix was looking for specific chars that map to 80-BF in Win1252.
             // If I see 'Ð' (U+00D0) explicitly, it means it's ALREADY decoded as Latin1/Win1252.
            suspensions++;
        }
    }
    
    console.log(`${file}: ${suspensions} potential issues found.`);
    if (suspensions > 0) {
        const match = content.match(/.{0,10}[ÐÑ].{0,10}/);
        if (match) console.log(`Sample: ${match[0]}`);
    }
}
