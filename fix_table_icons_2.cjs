const fs = require('fs');
const path = 'src/components/ui/table-icons.tsx';

let content = fs.readFileSync(path, 'utf-8');
content = content.replace(/import\s+type\s+\{\s*LucideProps\s*\}\s+from\s+['"]lucide-react['"];?/g, `import type { SVGProps } from 'react';\ntype LucideProps = SVGProps<SVGSVGElement>;`);
fs.writeFileSync(path, content);
console.log('Fixed table-icons.tsx again');
