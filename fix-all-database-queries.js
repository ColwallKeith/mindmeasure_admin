#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'src/hooks/useDashboardData.ts',
  'src/services/auth.ts',
  'src/services/auth-aws.ts',
  'src/services/UniversityDataService.ts',
  'src/services/CostTrackingService.ts',
  'src/features/auth/ensureProfile.ts',
  'src/components/institutional/cms/UniversityDataManager.tsx',
  'src/components/ProcessingLogs.tsx'
];

function fixDatabaseQueries(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Fix simple eq operators: { field: { operator: 'eq', value: X } } -> { field: X }
  const eqPattern = /(\w+):\s*{\s*operator:\s*['"]eq['"],\s*value:\s*([^}]+)\s*}/g;
  content = content.replace(eqPattern, (match, field, value) => {
    changes++;
    return `${field}: ${value}`;
  });

  // Fix gte operators: { field: { operator: 'gte', value: X } } -> keep as is for now (more complex)
  // We'll handle these case by case if needed

  if (changes > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${changes} database queries in ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed in ${filePath}`);
  }
}

console.log('🔧 Fixing all database query formats...\n');

filesToFix.forEach(fixDatabaseQueries);

console.log('\n✅ Database query format fixes complete!');
