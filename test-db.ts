#!/usr/bin/env node

/**
 * CHARAK API - Backend & Database Test Examples
 * Run this script to test various backend and database operations
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Test functions
async function testDatabaseConnection() {
  console.log('🔧 Testing Database Connection...');
  
  try {
    const userCount = await prisma.user.count();
    const disorderCount = await prisma.disorder.count();
    const patientCount = await prisma.patient.count();
    
    console.log('✅ Database Connected Successfully!');
    console.log(`   Users: ${userCount}`);
    console.log(`   Disorders: ${disorderCount}`);
    console.log(`   Patients: ${patientCount}\n`);
    
    return true;
  } catch (error) {
    console.log('❌ Database Connection Failed:');
    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    return false;
  }
}

async function testUserAuthentication() {
  console.log('🔐 Testing User Authentication...');
  
  try {
    const testUser = await prisma.user.findFirst({
      where: { username: 'demodoctor' }
    });
    
    if (testUser) {
      console.log('✅ Test user found:');
      console.log(`   Username: ${testUser.username}`);
      console.log(`   Role: ${testUser.role}`);
      console.log(`   Email: ${testUser.email || 'Not set'}\n`);
    } else {
      console.log('⚠️  Test user not found - database might need seeding\n');
    }
    
    return testUser;
  } catch (error) {
    console.log('❌ User Authentication Test Failed:');
    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    return null;
  }
}

async function testDisorderSearch() {
  console.log('🏥 Testing Disorder Search...');
  
  try {
    const disorders = await prisma.disorder.findMany({
      take: 5,
      orderBy: { englishName: 'asc' }
    });
    
    console.log(`✅ Found ${disorders.length} disorders:`);
    disorders.forEach((disorder, index) => {
      console.log(`   ${index + 1}. ${disorder.englishName} (${disorder.icd11Code})`);
      if (disorder.sanskritName) {
        console.log(`      Sanskrit: ${disorder.sanskritName}`);
      }
    });
    console.log('');
    
    return disorders;
  } catch (error) {
    console.log('❌ Disorder Search Test Failed:');
    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    return [];
  }
}

async function testPatientQueries() {
  console.log('👥 Testing Patient Queries...');
  
  try {
    const patients = await prisma.patient.findMany({
      take: 3,
      include: {
        diagnoses: {
          include: { disorder: true }
        }
      }
    });
    
    console.log(`✅ Found ${patients.length} patients:`);
    patients.forEach((patient, index) => {
      console.log(`   ${index + 1}. ${patient.firstName} ${patient.lastName}`);
      console.log(`      ABHA ID: ${patient.abhaId}`);
      console.log(`      Gender: ${patient.gender}`);
      console.log(`      Diagnoses: ${patient.diagnoses.length}`);
    });
    console.log('');
    
    return patients;
  } catch (error) {
    console.log('❌ Patient Query Test Failed:');
    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    return [];
  }
}

async function testAnalytics() {
  console.log('📊 Testing Analytics Data...');
  
  try {
    const analytics = await prisma.analyticsData.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`✅ Found ${analytics.length} analytics records:`);
    analytics.forEach((record, index) => {
      console.log(`   ${index + 1}. ${record.createdAt.toISOString().split('T')[0]} - ${record.disorder}`);
      console.log(`      Cases: ${record.cases}, Trend: ${record.trend}`);
    });
    console.log('');
    
    return analytics;
  } catch (error) {
    console.log('❌ Analytics Test Failed:');
    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    return [];
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 CHARAK API - Backend & Database Tests');
  console.log('==========================================\n');
  
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.log('💡 Try running: npm run db:push && npm run db:seed\n');
    process.exit(1);
  }
  
  await testUserAuthentication();
  await testDisorderSearch();
  await testPatientQueries();
  await testAnalytics();
  
  console.log('✅ All tests completed!');
  console.log('\n📖 Next steps:');
  console.log('   • Start backend: npm run server');
  console.log('   • Start frontend: npm run dev');
  console.log('   • View database: npm run db:studio');
  
  await prisma.$disconnect();
}

// Handle CLI arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
CHARAK API Database Tester

Usage:
  npm run test:db                    # Run all tests
  tsx test-db.ts --connection       # Test only database connection
  tsx test-db.ts --auth             # Test only authentication
  tsx test-db.ts --help             # Show this help

Examples:
  npm run db:push                    # Push schema to database
  npm run db:seed                    # Seed database with test data
  npm run db:studio                  # Open Prisma Studio
  npm run server                     # Start backend server
`);
  process.exit(0);
}

if (args.includes('--connection')) {
  testDatabaseConnection().then(() => prisma.$disconnect());
} else if (args.includes('--auth')) {
  testUserAuthentication().then(() => prisma.$disconnect());
} else {
  runAllTests();
}