import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listAbhaIds() {
  try {
    console.log('\n📋 ABHA IDs in Database:\n');
    console.log('='.repeat(50));
    
    const patients = await prisma.patient.findMany({
      select: {
        abhaId: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
      },
      orderBy: {
        abhaId: 'asc'
      }
    });

    if (patients.length === 0) {
      console.log('❌ No patients found in database');
      return;
    }

    console.log(`\n✅ Found ${patients.length} patients:\n`);
    
    patients.forEach((patient, index) => {
      const age = patient.dateOfBirth 
        ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
        : 'N/A';
      
      console.log(`${index + 1}. ABHA ID: ${patient.abhaId}`);
      console.log(`   Name: ${patient.firstName} ${patient.lastName}`);
      console.log(`   Age: ${age} | Gender: ${patient.gender}`);
      console.log('');
    });

    console.log('='.repeat(50));
    console.log('\n💡 Copy any ABHA ID to use in the application\n');

  } catch (error) {
    console.error('Error fetching ABHA IDs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAbhaIds();
