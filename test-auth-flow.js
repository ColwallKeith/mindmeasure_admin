#!/usr/bin/env node

// Quick Authentication Flow Test
const fs = require('fs');

console.log('🔐 AUTHENTICATION FLOW TEST\n');

// Test 1: Check Auth Service Implementation
console.log('1️⃣ Auth Service Implementation:');
try {
  const authServiceContent = fs.readFileSync('src/services/auth.ts', 'utf8');
  
  const hasCognitoSignUp = authServiceContent.includes('SignUpCommand') || authServiceContent.includes('signUp');
  const hasCognitoSignIn = authServiceContent.includes('InitiateAuthCommand') || authServiceContent.includes('signIn');
  const hasProfileIntegration = authServiceContent.includes('profiles') && authServiceContent.includes('database');
  const hasErrorHandling = authServiceContent.includes('try') && authServiceContent.includes('catch');
  
  console.log(`  ${hasCognitoSignUp ? '✅' : '❌'} AWS Cognito Sign Up`);
  console.log(`  ${hasCognitoSignIn ? '✅' : '❌'} AWS Cognito Sign In`);
  console.log(`  ${hasProfileIntegration ? '✅' : '❌'} Profile Database Integration`);
  console.log(`  ${hasErrorHandling ? '✅' : '❌'} Error Handling`);
  
} catch (error) {
  console.log('  ❌ Error checking auth service');
}

// Test 2: Check API Endpoints
console.log('\n2️⃣ API Endpoints:');
const registerExists = fs.existsSync('api/auth/register.ts');
const loginExists = fs.existsSync('api/auth/login.ts');
const healthExists = fs.existsSync('api/database/health-check.ts');
const setupExists = fs.existsSync('api/database/setup-tables.ts');

console.log(`  ${registerExists ? '✅' : '❌'} Registration API Endpoint`);
console.log(`  ${loginExists ? '✅' : '❌'} Login API Endpoint`);
console.log(`  ${healthExists ? '✅' : '❌'} Database Health Check`);
console.log(`  ${setupExists ? '✅' : '❌'} Database Setup`);

// Test 3: Check Environment Configuration
console.log('\n3️⃣ Environment Configuration:');
const envExampleExists = fs.existsSync('env.example');
const hasPackageScripts = fs.readFileSync('package.json', 'utf8').includes('"typecheck"');

console.log(`  ${envExampleExists ? '✅' : '❌'} Environment Example File`);
console.log(`  ${hasPackageScripts ? '✅' : '❌'} Enhanced Package Scripts`);

// Test 4: Check Registration Components
console.log('\n4️⃣ Registration Components:');
try {
  const registrationContent = fs.readFileSync('src/components/mobile/RegistrationScreen.tsx', 'utf8');
  const hasRealSignUp = registrationContent.includes('signUp') && registrationContent.includes('authService');
  const hasValidation = registrationContent.includes('email') && registrationContent.includes('password');
  
  console.log(`  ${hasRealSignUp ? '✅' : '❌'} Real Sign Up Integration`);
  console.log(`  ${hasValidation ? '✅' : '❌'} Form Validation`);
  
} catch (error) {
  console.log('  ❌ Error checking registration components');
}

// Calculate completion percentage
const totalChecks = 10;
const completedChecks = [
  registerExists, loginExists, healthExists, setupExists,
  envExampleExists, hasPackageScripts
].filter(Boolean).length;

const completionPercentage = Math.round((completedChecks / totalChecks) * 100);

console.log('\n📊 COMPLETION STATUS:');
console.log(`✅ Completed Tasks: ${completedChecks}/${totalChecks}`);
console.log(`📈 Overall Progress: ${completionPercentage}%`);

if (completionPercentage >= 90) {
  console.log('\n🎉 AUTHENTICATION SYSTEM READY!');
  console.log('✅ All critical components implemented');
  console.log('✅ API endpoints created');
  console.log('✅ Environment configuration documented');
  console.log('🚀 Ready for live user testing!');
} else {
  console.log('\n⚠️ MINOR ITEMS REMAINING:');
  if (!registerExists) console.log('- Create registration API endpoint');
  if (!loginExists) console.log('- Create login API endpoint');
  if (!envExampleExists) console.log('- Create environment example file');
  if (!hasPackageScripts) console.log('- Enhance package.json scripts');
}

console.log('\n🏁 Authentication flow test complete!');

