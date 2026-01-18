#!/usr/bin/env node

// Phase 1: Critical Syntax Fixes
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Phase 1: Critical Syntax Fixes\n');

// Get all files with syntax errors
const getFilesWithErrors = () => {
  try {
    const result = execSync(`grep -r -l "AWS backend" src/`, { encoding: 'utf8' });
    return result.trim().split('\n').filter(f => f.length > 0);
  } catch (error) {
    return [];
  }
};

const fixSyntaxErrors = (filePath) => {
  console.log(`🔧 Fixing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Critical syntax fixes
  const fixes = [
    // Fix malformed variable names
    { 
      pattern: /const AWS backend/g, 
      replacement: 'const backendService' 
    },
    { 
      pattern: /let AWS backend/g, 
      replacement: 'let backendService' 
    },
    { 
      pattern: /AWS backend\s*=/g, 
      replacement: 'backendService =' 
    },
    
    // Fix function calls
    { 
      pattern: /await AWS backend\b/g, 
      replacement: 'await backendService.database' 
    },
    { 
      pattern: /AWS backend\./g, 
      replacement: 'backendService.database.' 
    },
    { 
      pattern: /AWS backend\s*\n/g, 
      replacement: 'backendService.database\n' 
    },
    
    // Fix object properties
    { 
      pattern: /AWS backend:/g, 
      replacement: 'backend:' 
    },
    { 
      pattern: /AWS backendResults/g, 
      replacement: 'backendResults' 
    },
    { 
      pattern: /AWS backendConfig/g, 
      replacement: 'backendConfig' 
    },
    
    // Fix malformed TODO comments
    { 
      pattern: /\/\* TODO: Replace with AWS backend - was: backendService\(\s*\*\/\s*backendService\.database/g, 
      replacement: 'backendService.rpc(' 
    },
    { 
      pattern: /\/\* TODO: Replace with AWS backend - was: \/\* TODO:[^*]*\*\/[^*]*\*\/[^;]*/g, 
      replacement: '' 
    },
    
    // Fix broken function calls
    { 
      pattern: /backendService\.database'([^']+)'/g, 
      replacement: 'backendService.rpc(\'$1\'' 
    },
    
    // Add missing service initialization where needed
    {
      condition: (content) => 
        content.includes('backendService.database') && 
        !content.includes('const backendService =') && 
        !content.includes('BackendServiceFactory'),
      fix: (content) => {
        // Add import if missing
        if (!content.includes('BackendServiceFactory')) {
          content = `import { BackendServiceFactory } from '@/services/database/BackendServiceFactory';\n${content}`;
        }
        
        // Find function start and add service initialization
        const functionMatches = [
          /(export\s+(?:async\s+)?function\s+\w+[^{]*{)/,
          /(const\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>\s*{)/,
          /(export\s+const\s+\w+[^{]*{)/
        ];
        
        for (const match of functionMatches) {
          const functionMatch = content.match(match);
          if (functionMatch) {
            const insertPoint = content.indexOf('{', content.indexOf(functionMatch[0])) + 1;
            const serviceInit = `
  const backendService = BackendServiceFactory.createService(
    BackendServiceFactory.getEnvironmentConfig()
  );
`;
            content = content.slice(0, insertPoint) + serviceInit + content.slice(insertPoint);
            return content;
          }
        }
        return content;
      }
    }
  ];
  
  // Apply standard fixes
  for (const fix of fixes) {
    if (fix.condition && fix.fix) {
      if (fix.condition(content)) {
        const newContent = fix.fix(content);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
    } else if (fix.pattern && fix.replacement !== undefined) {
      if (fix.pattern.test(content)) {
        content = content.replace(fix.pattern, fix.replacement);
        modified = true;
      }
    }
  }
  
  // Clean up any remaining malformed patterns
  const cleanupPatterns = [
    // Remove empty lines
    { pattern: /\n\s*\n\s*\n/g, replacement: '\n\n' },
    // Fix spacing
    { pattern: /\s+\n/g, replacement: '\n' },
    // Fix double semicolons
    { pattern: /;;/g, replacement: ';' }
  ];
  
  for (const { pattern, replacement } of cleanupPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Fixed syntax errors`);
  } else {
    console.log(`  ⚠️  No changes needed`);
  }
  
  return modified;
};

// Main execution
const filesToFix = getFilesWithErrors();
console.log(`Found ${filesToFix.length} files with syntax errors\n`);

let totalFixed = 0;
for (const file of filesToFix) {
  if (fixSyntaxErrors(file)) {
    totalFixed++;
  }
}

console.log(`\n✅ Phase 1 completed!`);
console.log(`📊 Fixed ${totalFixed} out of ${filesToFix.length} files`);

// Verify fixes
const remaining = getFilesWithErrors();
console.log(`🎯 Remaining files with errors: ${remaining.length}`);

if (remaining.length === 0) {
  console.log('\n🎉 SUCCESS: All syntax errors fixed!');
  console.log('Ready for Phase 2: Service Architecture Standardization');
} else {
  console.log('\n📋 Files still needing attention:');
  remaining.forEach(file => console.log(`  - ${file}`));
}
