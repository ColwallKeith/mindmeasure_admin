#!/usr/bin/env node

// Fix incomplete database calls
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing incomplete database calls...\n');

const fixDatabaseCalls = (filePath) => {
  console.log(`🔧 Fixing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix incomplete database calls
  const fixes = [
    // Fix .from() calls
    {
      pattern: /backendService\.database\s*\n\s*\.from\(/g,
      replacement: 'backendService.database.select('
    },
    // Fix query chains that start with .from
    {
      pattern: /backendService\.database\s*\n\s*\.from\(['"]([^'"]+)['"]\)\s*\n\s*\.select\(['"]([^'"]*)['"]\)/g,
      replacement: 'backendService.database.select(\'$1\', {\n      columns: \'$2\''
    },
    // Fix simple select queries
    {
      pattern: /backendService\.database\s*\n\s*\.from\(['"]([^'"]+)['"]\)\s*\n\s*\.select\(['"]([^'"]*)['"]\)\s*\n\s*\.order\(['"]([^'"]+)['"],\s*{\s*ascending:\s*(true|false)\s*}\)/g,
      replacement: 'backendService.database.select(\'$1\', {\n      columns: \'$2\',\n      orderBy: [{ column: \'$3\', ascending: $4 }]\n    })'
    },
    // Fix queries with eq
    {
      pattern: /backendService\.database\s*\n\s*\.from\(['"]([^'"]+)['"]\)\s*\n\s*\.select\(['"]([^'"]*)['"]\)\s*\n\s*\.eq\(['"]([^'"]+)['"],\s*([^)]+)\)/g,
      replacement: 'backendService.database.select(\'$1\', {\n      columns: \'$2\',\n      filters: { $3: { operator: \'eq\', value: $4 } }\n    })'
    },
    // Fix insert queries
    {
      pattern: /backendService\.database\s*\n\s*\.from\(['"]([^'"]+)['"]\)\s*\n\s*\.insert\(/g,
      replacement: 'backendService.database.insert(\'$1\','
    },
    // Fix update queries
    {
      pattern: /backendService\.database\s*\n\s*\.from\(['"]([^'"]+)['"]\)\s*\n\s*\.update\(/g,
      replacement: 'backendService.database.update(\'$1\','
    },
    // Fix delete queries
    {
      pattern: /backendService\.database\s*\n\s*\.from\(['"]([^'"]+)['"]\)\s*\n\s*\.delete\(\)\s*\n\s*\.eq\(['"]([^'"]+)['"],\s*([^)]+)\)/g,
      replacement: 'backendService.database.delete(\'$1\', {\n      filters: { $2: { operator: \'eq\', value: $3 } }\n    })'
    }
  ];
  
  for (const { pattern, replacement } of fixes) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Fixed database calls`);
  } else {
    console.log(`  ⚠️  No changes needed`);
  }
  
  return modified;
};

// Files that likely have database call issues
const filesToFix = [
  'src/features/cms/data.ts',
  'src/features/dashboards/data.ts',
  'src/features/mobile/data.ts',
  'src/features/admin/functions.ts'
];

let totalFixed = 0;
for (const file of filesToFix) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    if (fixDatabaseCalls(fullPath)) {
      totalFixed++;
    }
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
}

console.log(`\n✅ Database call fixes completed!`);
console.log(`📊 Fixed ${totalFixed} files`);
