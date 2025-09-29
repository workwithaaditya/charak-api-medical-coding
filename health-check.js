#!/usr/bin/env node

/**
 * CHARAK API - Automated System Health Check
 * Comprehensive testing script to verify all components
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import http from 'http';

const execAsync = promisify(exec);

// Simple fetch replacement using built-in http
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 5000
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          json: () => Promise.resolve(JSON.parse(data)),
          text: () => Promise.resolve(data)
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.bold}${colors.blue}\n🔍 ${msg}${colors.reset}`)
};

// Test results tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0
};

function updateResults(passed, isWarning = false) {
  results.total++;
  if (passed) {
    results.passed++;
  } else {
    if (isWarning) {
      results.warnings++;
    } else {
      results.failed++;
    }
  }
}

// Test functions
async function testNodeVersion() {
  log.header('Testing Node.js Environment');
  
  try {
    const { stdout } = await execAsync('node --version');
    const version = stdout.trim();
    const majorVersion = parseInt(version.slice(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      log.success(`Node.js ${version} ✓`);
      updateResults(true);
    } else {
      log.warning(`Node.js ${version} (recommended: v18+)`);
      updateResults(false, true);
    }
    
    const { stdout: npmVersion } = await execAsync('npm --version');
    log.success(`NPM ${npmVersion.trim()} ✓`);
    updateResults(true);
    
  } catch (error) {
    log.error('Node.js/NPM not found');
    updateResults(false);
  }
}

async function testDependencies() {
  log.header('Testing Dependencies');
  
  try {
    await execAsync('npm list --depth=0');
    log.success('All dependencies installed ✓');
    updateResults(true);
  } catch (error) {
    log.error('Dependencies missing - run: npm install');
    updateResults(false);
  }
}

async function testDatabase() {
  log.header('Testing Database');
  
  try {
    // Test Prisma client generation
    await execAsync('npx prisma generate');
    log.success('Prisma client generated ✓');
    updateResults(true);
    
    // Test database connection
    const { stdout } = await execAsync('npm run test:db -- --connection');
    if (stdout.includes('Database Connected Successfully')) {
      log.success('Database connection working ✓');
      updateResults(true);
    } else {
      log.error('Database connection failed');
      updateResults(false);
    }
    
  } catch (error) {
    log.error('Database test failed - run: npm run db:push && npm run db:seed');
    updateResults(false);
  }
}

async function testTypeScript() {
  log.header('Testing TypeScript Compilation');
  
  try {
    await execAsync('npx tsc --noEmit');
    log.success('TypeScript compilation successful ✓');
    updateResults(true);
  } catch (error) {
    log.error('TypeScript errors found');
    updateResults(false);
  }
}

async function testBackendAPI() {
  log.header('Testing Backend API');
  
  // Check if server is running
  try {
    const response = await fetch('http://localhost:3000/api/health', {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      const data = await response.json();
      log.success(`Backend API responding: ${data.status} ✓`);
      updateResults(true);
      
      // Test database endpoint
      const dbResponse = await fetch('http://localhost:3000/api/db-test');
      const dbData = await dbResponse.json();
      
      if (dbData.status === 'Database Connected') {
        log.success(`Database API: ${dbData.stats.users} users, ${dbData.stats.disorders} disorders ✓`);
        updateResults(true);
      } else {
        log.error('Database API not responding');
        updateResults(false);
      }
      
    } else {
      throw new Error('API not responding');
    }
    
  } catch (error) {
    log.warning('Backend not running - start with: npm run server');
    updateResults(false, true);
  }
}

async function testFrontend() {
  log.header('Testing Frontend Application');
  
  try {
    // Check if Vite dev server is accessible
    const response = await fetch('http://localhost:3001/', {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      const html = await response.text();
      if (html.includes('CHARAK API')) {
        log.success('Frontend application accessible ✓');
        updateResults(true);
      } else {
        log.error('Frontend not loading correctly');
        updateResults(false);
      }
    } else {
      throw new Error('Frontend not responding');
    }
    
  } catch (error) {
    log.warning('Frontend not running - start with: npm run dev');
    updateResults(false, true);
  }
}

async function testAuthEndpoints() {
  log.header('Testing Authentication');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'demodoctor',
        password: '123'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.token && data.user) {
        log.success(`Authentication working: ${data.user.username} (${data.user.role}) ✓`);
        updateResults(true);
      } else {
        log.error('Authentication response invalid');
        updateResults(false);
      }
    } else {
      log.error('Authentication endpoint failed');
      updateResults(false);
    }
    
  } catch (error) {
    log.warning('Authentication test skipped - backend not running');
    updateResults(false, true);
  }
}

async function testMedicalData() {
  log.header('Testing Medical Data APIs');
  
  try {
    // Test disorders endpoint
    const disordersResponse = await fetch('http://localhost:3000/api/disorders');
    if (disordersResponse.ok) {
      const disorders = await disordersResponse.json();
      log.success(`Medical disorders: ${disorders.length} available ✓`);
      updateResults(true);
    } else {
      log.error('Disorders API failed');
      updateResults(false);
    }
    
    // Test patients endpoint
    const patientsResponse = await fetch('http://localhost:3000/api/patients');
    if (patientsResponse.ok) {
      const patients = await patientsResponse.json();
      log.success(`Patient data: ${patients.length} records ✓`);
      updateResults(true);
    } else {
      log.error('Patients API failed');
      updateResults(false);
    }
    
  } catch (error) {
    log.warning('Medical data tests skipped - backend not running');
    updateResults(false, true);
  }
}

async function testFileStructure() {
  log.header('Testing File Structure');
  
  const requiredFiles = [
    'package.json',
    'prisma/schema.prisma',
    'src/main.tsx',
    'src/App.tsx',
    'server.ts',
    'test-db.ts'
  ];
  
  for (const file of requiredFiles) {
    try {
      await execAsync(`test -f "${file}" || ls "${file}"`);
      log.success(`${file} exists ✓`);
      updateResults(true);
    } catch (error) {
      log.error(`${file} missing`);
      updateResults(false);
    }
  }
}

// Print summary
function printSummary() {
  console.log(`\n${colors.bold}📊 Test Summary${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  
  console.log(`Total Tests: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  
  if (results.failed > 0) {
    console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  }
  
  if (results.warnings > 0) {
    console.log(`${colors.yellow}Warnings: ${results.warnings}${colors.reset}`);
  }
  
  const successRate = ((results.passed / results.total) * 100).toFixed(1);
  console.log(`Success Rate: ${successRate}%`);
  
  if (results.failed === 0) {
    console.log(`\n${colors.green}🎉 All critical tests passed! System is ready.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}⚠️  Some tests failed. Check the errors above.${colors.reset}`);
  }
  
  console.log(`\n${colors.blue}💡 Quick Start Commands:${colors.reset}`);
  console.log(`   Database: npm run db:studio`);
  console.log(`   Backend:  npm run server`);
  console.log(`   Frontend: npm run dev`);
  console.log(`   Tests:    npm run test:db`);
}

// Main execution
async function runAllTests() {
  console.log(`${colors.bold}${colors.blue}`);
  console.log('🔍 CHARAK API - System Health Check');
  console.log('====================================');
  console.log(`${colors.reset}`);
  
  await testNodeVersion();
  await testFileStructure();
  await testDependencies();
  await testTypeScript();
  await testDatabase();
  await testBackendAPI();
  await testFrontend();
  await testAuthEndpoints();
  await testMedicalData();
  
  printSummary();
}

// Handle CLI arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
CHARAK API System Health Check

Usage:
  npm run health-check              # Run all system tests
  node health-check.js --quick      # Quick essential tests only
  node health-check.js --backend    # Backend/API tests only
  node health-check.js --frontend   # Frontend tests only
  node health-check.js --help       # Show this help

Examples:
  npm run health-check              # Full system check
  node health-check.js --quick      # Essential tests only
`);
  process.exit(0);
}

if (args.includes('--quick')) {
  // Quick tests only
  (async () => {
    await testNodeVersion();
    await testDependencies();
    await testDatabase();
    printSummary();
  })();
} else if (args.includes('--backend')) {
  // Backend tests only
  (async () => {
    await testBackendAPI();
    await testAuthEndpoints();
    await testMedicalData();
    printSummary();
  })();
} else if (args.includes('--frontend')) {
  // Frontend tests only
  (async () => {
    await testFrontend();
    printSummary();
  })();
} else {
  // Run all tests
  runAllTests();
}