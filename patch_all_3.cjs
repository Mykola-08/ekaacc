const fs = require('fs');

let cmdPalette = fs.readFileSync('src/components/dashboard/GlobalCommandPalette.tsx', 'utf8');

if (!cmdPalette.includes('import { DefaultChatTransport }')) {
  cmdPalette = cmdPalette.replace(/import { useChat } from '@ai-sdk\/react';/, "import { useChat } from '@ai-sdk/react';\nimport { DefaultChatTransport } from 'ai';");
}

fs.writeFileSync('src/components/dashboard/GlobalCommandPalette.tsx', cmdPalette);
