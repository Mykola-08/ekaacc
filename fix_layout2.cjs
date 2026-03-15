const fs = require('fs');
let content = fs.readFileSync('src/marketing/components/MainLayout.tsx', 'utf-8');
content = content.replace(/const \[dropdownPosition, setDropdownPosition\] = useState(<[\s\S]*?>)?.*?null\);\n/g, '');
content = content.replace(/const computeDropdownPosition = useCallback.*?\}\, \[\]\);\n/s, '');
fs.writeFileSync('src/marketing/components/MainLayout.tsx', content);
console.log('Cleaned unused definitions');
