const fs = require('fs');
const path = require('path');

const files = [
  'src/components/platform/auth/signup-form.tsx',
  'src/components/platform/auth/mfa-verify-form.tsx',
  'src/components/platform/auth/login-form.tsx',
  'src/components/ai/widgets/insights-panel.tsx',
  'src/components/ai/conversation-list.tsx',
  'src/components/ai/chat-input.tsx',
  'src/components/ai/AIRightPanel.tsx',
  'src/components/dashboard/shared/CrisisPageContent.tsx',
];

files.forEach(f => {
  const fullPath = path.resolve(f);
  let content = fs.readFileSync(fullPath, 'utf8');
  const orig = content;
  
  // Remove motion import lines
  content = content.replace(/^import\s+\{[^}]*\}\s+from\s+['"]motion\/react['"];?\s*\n/gm, '');
  content = content.replace(/^import\s+\{[^}]*\}\s+from\s+['"]framer-motion['"];?\s*\n/gm, '');
  
  // Replace AnimatePresence wrappers - just remove open/close tags
  content = content.replace(/<AnimatePresence[^>]*>/g, '');
  content = content.replace(/<\/AnimatePresence>/g, '');
  
  // Replace motion.div with div
  content = content.replace(/<motion\.div/g, '<div');
  content = content.replace(/<\/motion\.div>/g, '</div>');
  content = content.replace(/<motion\.span/g, '<span');
  content = content.replace(/<\/motion\.span>/g, '</span>');
  content = content.replace(/<motion\.p/g, '<p');
  content = content.replace(/<\/motion\.p>/g, '</p>');
  content = content.replace(/<motion\.button/g, '<button');
  content = content.replace(/<\/motion\.button>/g, '</button>');
  
  // Remove motion-specific props (multiline-safe)
  content = content.replace(/\s+initial=\{[^}]*\}/g, '');
  content = content.replace(/\s+animate=\{[^}]*\}/g, '');
  content = content.replace(/\s+exit=\{[^}]*\}/g, '');
  // transition prop can be multiline with nested objects
  content = content.replace(/\s+transition=\{\{[^}]*\}[^}]*\}/g, '');
  content = content.replace(/\s+transition=\{[^}]*\}/g, '');
  content = content.replace(/\s+variants=\{[^}]*\}/g, '');
  content = content.replace(/\s+whileHover=\{[^}]*\}/g, '');
  content = content.replace(/\s+whileTap=\{[^}]*\}/g, '');
  content = content.replace(/\s+layout\b(?!=)/g, '');
  content = content.replace(/\s+layoutId="[^"]*"/g, '');
  
  if (content !== orig) {
    fs.writeFileSync(fullPath, content);
    console.log('Processed: ' + f);
  } else {
    console.log('No changes: ' + f);
  }
});
