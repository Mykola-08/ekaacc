const fs = require('fs');
let content = fs.readFileSync('src/marketing/components/MainLayout.tsx', 'utf-8');
const startStr = '{/* Hover bridge — spans full width';
const endStr = '{/* Inner content wrapper with the actual visual styling */}';
const start = content.indexOf(startStr);
const end = content.indexOf(endStr);
if (start > -1 && end > -1) {
  const replaceStr = "{/* Hover bridge & Dropdown Container via CSS */}\n" +
"                          <AnimatePresence>\n" +
"                            {activeDropdown === item.name && (\n" +
"                              <motion.div\n" +
"                                initial={{ opacity: 0, scaleY: 0.95, y: -4 }}\n" +
"                                animate={{ opacity: 1, scaleY: 1, y: 0 }}\n" +
"                                exit={{ opacity: 0, scaleY: 0.95, y: -4 }}\n" +
"                                transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}\n" +
"                                className=\"absolute top-full left-1/2 z-40 w-[280px] -translate-x-1/2 pt-4\"\n" +
"                                style={{ transformOrigin: 'top center' }}\n" +
"                                onMouseEnter={() => keepMenuOpen(item.name)}\n" +
"                                onMouseLeave={scheduleHide}\n" +
"                                onKeyDown={(e) => {\n" +
"                                  if (e.key === 'Escape') {\n" +
"                                    setActiveDropdown(null);\n" +
"                                  }\n" +
"                                }}\n" +
"                                role=\"menu\"\n" +
"                                aria-label={\\ submenu\}\n" +
"                              >\n" +
"                                {/* Invisible padding zone for hover target bridge */}\n" +
"                                <div className=\"absolute inset-x-[-40px] top-0 h-8\" aria-hidden=\"true\" />\n" +
"                                ";
  content = content.substring(0, start) + replaceStr + content.substring(end);
  fs.writeFileSync('src/marketing/components/MainLayout.tsx', content);
  console.log('Successfully replaced');
} else {
  console.log('Failed:', start, end);
}
