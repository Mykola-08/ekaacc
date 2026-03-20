#!/usr/bin/env node
/**
 * Postinstall patch for Next.js 16.2.0 bug:
 * _global-error page SSG fails with TypeError due to null React dispatcher
 * when RenderFromTemplateContext calls useContext during static generation.
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../node_modules/next/dist/export/routes/app-page.js');

if (!fs.existsSync(file)) {
  console.warn('patch-nextjs: app-page.js not found, skipping');
  process.exit(0);
}

let content = fs.readFileSync(file, 'utf8');

const old = `    } catch (err) {\n        if (!(0, _isdynamicusageerror.isDynamicUsageError)(err)) {\n            throw err;\n        }`;
const patched = `    } catch (err) {\n        // Workaround: Next.js 16.2.0 bug — _global-error SSG fails with null React dispatcher\n        if (isDefaultGlobalError && err instanceof TypeError) {\n            return { cacheControl: { revalidate: 0 }, fetchMetrics: undefined };\n        }\n        if (!(0, _isdynamicusageerror.isDynamicUsageError)(err)) {\n            throw err;\n        }`;

if (content.includes('Workaround: Next.js 16.2.0')) {
  console.log('patch-nextjs: already applied, skipping');
} else if (content.includes(old)) {
  fs.writeFileSync(file, content.replace(old, patched));
  console.log('patch-nextjs: applied successfully');
} else {
  console.warn('patch-nextjs: pattern not found — may already be fixed in this Next.js version');
}
