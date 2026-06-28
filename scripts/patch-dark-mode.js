const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '..', 'src');

const replacements = [
  // Text colors
  { regex: /(?<!dark:)text-slate-900/g, replacement: 'text-slate-900 dark:text-slate-100' },
  { regex: /(?<!dark:)text-slate-800/g, replacement: 'text-slate-800 dark:text-slate-200' },
  { regex: /(?<!dark:)text-slate-700/g, replacement: 'text-slate-700 dark:text-slate-300' },
  { regex: /(?<!dark:)text-slate-600/g, replacement: 'text-slate-600 dark:text-slate-400' },
  { regex: /(?<!dark:)text-slate-500/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { regex: /(?<!dark:)text-gray-900/g, replacement: 'text-gray-900 dark:text-gray-100' },
  { regex: /(?<!dark:)text-gray-800/g, replacement: 'text-gray-800 dark:text-gray-200' },
  { regex: /(?<!dark:)text-gray-700/g, replacement: 'text-gray-700 dark:text-gray-300' },
  { regex: /(?<!dark:)text-gray-600/g, replacement: 'text-gray-600 dark:text-gray-400' },
  { regex: /(?<!dark:)text-gray-500/g, replacement: 'text-gray-500 dark:text-gray-400' },
  
  // Backgrounds
  { regex: /(?<!dark:)bg-white/g, replacement: 'bg-white dark:bg-slate-950' },
  { regex: /(?<!dark:)bg-slate-50(?!0)/g, replacement: 'bg-slate-50 dark:bg-slate-900' },
  { regex: /(?<!dark:)bg-slate-100/g, replacement: 'bg-slate-100 dark:bg-slate-900' },
  { regex: /(?<!dark:)bg-slate-200/g, replacement: 'bg-slate-200 dark:bg-slate-800' },
  
  // Borders
  { regex: /(?<!dark:)border-slate-100/g, replacement: 'border-slate-100 dark:border-slate-800' },
  { regex: /(?<!dark:)border-slate-200/g, replacement: 'border-slate-200 dark:border-slate-800' },
  { regex: /(?<!dark:)border-slate-300/g, replacement: 'border-slate-300 dark:border-slate-700' },

  // Special UI elements
  { regex: /(?<!dark:)bg-amber-50(?!0)/g, replacement: 'bg-amber-50 dark:bg-amber-950/40' },
  { regex: /(?<!dark:)text-amber-600/g, replacement: 'text-amber-600 dark:text-amber-500' },
  { regex: /(?<!dark:)text-amber-700/g, replacement: 'text-amber-700 dark:text-amber-400' },
  { regex: /(?<!dark:)text-amber-800/g, replacement: 'text-amber-800 dark:text-amber-300' },
  { regex: /(?<!dark:)text-amber-900/g, replacement: 'text-amber-900 dark:text-amber-200' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const { regex, replacement } of replacements) {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(directoryPath);
console.log('Finished applying dark mode patches.');
