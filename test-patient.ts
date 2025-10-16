import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testNewPatient() {
  console.log('🔍 Searching for Aaditya Negi...')
  
  try {
    // Search by ABHA ID
    const patientByAbha = await prisma.patient.findUnique({
      where: { abhaId: '55789012345678' }
    })
    
    if (patientByAbha) {
      console.log('✅ Found patient by ABHA ID:')
      console.log(`Name: ${patientByAbha.firstName} ${patientByAbha.lastName}`)
      console.log(`ABHA ID: ${patientByAbha.abhaId}`)
      console.log(`Phone: ${patientByAbha.phone}`)
      console.log(`City: ${patientByAbha.city}, ${patientByAbha.state}`)
      console.log(`Email: ${patientByAbha.email}`)
    } else {
      console.log('❌ Patient not found by ABHA ID')
    }
    
    // Search by name
    const patientsByName = await prisma.patient.findMany({
      where: {
        OR: [
          { firstName: { contains: 'Aaditya' } },
          { lastName: { contains: 'Negi' } }
        ]
      }
    })
    
    console.log(`\n📊 Found ${patientsByName.length} patients matching name "Aaditya Negi"`)
    patientsByName.forEach((patient, index) => {
      console.log(`${index + 1}. ${patient.firstName} ${patient.lastName} (ABHA: ${patient.abhaId})`)
    })
    
    // Get all patients count
    const totalPatients = await prisma.patient.count()
    console.log(`\n📈 Total patients in database: ${totalPatients}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testNewPatient()