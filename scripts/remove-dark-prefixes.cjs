/**
 * Removes all `dark:` Tailwind prefixes from specified files.
 * CSS variable theming handles dark mode via .dark class on :root,
 * so dark: prefixes are unnecessary and violate the design system.
 */
const fs = require('fs');
const path = require('path');

// Regex to match dark: prefixed classes in className strings
// Matches: dark:anything that's a valid Tailwind class (until next space or quote)
const DARK_CLASS_REGEX = /\s*dark:[^\s"'`]+/g;

// Also handle the chart.tsx THEMES object specially
const CHART_THEMES_REGEX = /const THEMES = \{ light: "", dark: "\.dark" \} as const/;

const files = [
  // Non-UI component files (Phase 2)
  'src/components/ai-elements/commit.tsx',
  'src/components/ai-elements/attachments.tsx',
  'src/components/ai-elements/conversation.tsx',
  'src/components/ai-elements/model-selector.tsx',
  'src/components/ai-elements/package-info.tsx',
  'src/components/ai-elements/schema-display.tsx',
  'src/components/ai-elements/test-results.tsx',
  'src/components/data-table.tsx',
  'src/components/dashboard/therapist/active-session/ProtocolRunner.tsx',
  'src/components/section-cards.tsx',
  'src/components/settings-dialog.tsx',
  // Skip: code-block.tsx (shiki theme config), code-block-node*.tsx (syntax highlighting)
  // Skip: chart.tsx (THEMES object is functional for recharts)
];

const root = path.resolve(__dirname, '..');
let totalRemoved = 0;
let filesModified = 0;

for (const relPath of files) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`SKIP (not found): ${relPath}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // Count dark: class occurrences
  const matches = content.match(DARK_CLASS_REGEX);
  const count = matches ? matches.length : 0;

  if (count === 0) {
    console.log(`SKIP (no dark:): ${relPath}`);
    continue;
  }

  // Remove dark: classes
  content = content.replace(DARK_CLASS_REGEX, '');

  // Clean up any resulting double spaces
  content = content.replace(/  +/g, ' ');
  // Clean up space before closing quote
  content = content.replace(/ "/g, '"');
  content = content.replace(/ '/g, "'");
  content = content.replace(/ `/g, '`');

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`CLEANED: ${relPath} (removed ${count} dark: classes)`);
    totalRemoved += count;
    filesModified++;
  }
}

console.log(`\nDone! Removed ${totalRemoved} dark: classes from ${filesModified} files.`);
