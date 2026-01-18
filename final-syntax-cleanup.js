#!/usr/bin/env node

// Final comprehensive syntax cleanup
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Final Syntax Cleanup - Fixing all remaining issues...\n');

const fixAllSyntaxIssues = (filePath) => {
  console.log(`🔧 Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Comprehensive syntax fixes
  const fixes = [
    // Fix malformed object properties
    { pattern: /AWS backend:/g, replacement: 'backend:' },
    { pattern: /AWS backendScore:/g, replacement: 'backendScore:' },
    { pattern: /AWS backendResults/g, replacement: 'backendResults' },
    { pattern: /AWS backendConfig/g, replacement: 'backendConfig' },
    
    // Fix variable declarations
    { pattern: /const AWS backend/g, replacement: 'const backendService' },
    { pattern: /let AWS backend/g, replacement: 'let backendService' },
    { pattern: /AWS backend\s*=/g, replacement: 'backendService =' },
    
    // Fix function calls and references
    { pattern: /AWS backend\b(?!\w)/g, replacement: 'backendService' },
    { pattern: /\(AWS backend\)/g, replacement: '(backendService)' },
    { pattern: /await AWS backend/g, replacement: 'await backendService' },
    
    // Fix method calls
    { pattern: /backendService\.database\s*\n\s*\.from/g, replacement: 'backendService.database.select' },
    
    // Fix broken TODO comments
    { pattern: /\/\* TODO: Replace with AWS[^*]*\*\/[^;]*/g, replacement: '' },
    { pattern: /backendService\.database'([^']+)'/g, replacement: 'backendService.rpc(\'$1\'' },
    
    // Fix spacing and formatting
    { pattern: /\s+\n/g, replacement: '\n' },
    { pattern: /\n\s*\n\s*\n/g, replacement: '\n\n' },
    { pattern: /;;/g, replacement: ';' },
    
    // Fix specific patterns that might cause issues
    { pattern: /provider\s*=\s*'AWS backend'/g, replacement: 'provider = \'aws\'' },
    { pattern: /provider\s*=\s*'aurora-serverless'/g, replacement: 'provider = \'aws\'' },
    
    // Fix any remaining malformed expressions
    { pattern: /\s+backendService\b/g, replacement: ' backendService' },
    { pattern: /backendService\s+/g, replacement: 'backendService ' }
  ];
  
  for (const { pattern, replacement } of fixes) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Fixed syntax issues`);
  } else {
    console.log(`  ⚠️  No changes needed`);
  }
  
  return modified;
};

// Get all TypeScript/TSX files
const getAllFiles = (dir, extensions = ['.ts', '.tsx']) => {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
      files.push(...getAllFiles(fullPath, extensions));
    } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
};

// Main execution
const srcDir = path.join(__dirname, 'src');
const allFiles = getAllFiles(srcDir);

console.log(`Processing ${allFiles.length} files...\n`);

let totalFixed = 0;
for (const file of allFiles) {
  if (fixAllSyntaxIssues(file)) {
    totalFixed++;
  }
}

console.log(`\n✅ Final syntax cleanup completed!`);
console.log(`📊 Fixed ${totalFixed} out of ${allFiles.length} files`);

// Test build
console.log('\n🧪 Testing build...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build successful!');
} catch (error) {
  console.log('❌ Build still has issues:');
  console.log(error.stdout?.toString() || error.message);
}
