import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import { UserRole, Gender, DiagnosisStatus, TrendType } from '@prisma/client'

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.diagnosis.deleteMany({})
  await prisma.patientHistory.deleteMany({})
  await prisma.patient.deleteMany({})
  await prisma.disorder.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.analyticsData.deleteMany({})
  await prisma.eMRUsage.deleteMany({})

  console.log('✅ Cleared existing data')

  // Create demo users
  const demoDoctor = await prisma.user.create({
    data: {
      username: 'demodoctor',
      password: '123', // In production, this should be hashed
      role: UserRole.DOCTOR,
      email: 'doctor@charak.health',
      firstName: 'Dr. Aditya',
      lastName: 'Sharma',
    }
  })

  const govAgent = await prisma.user.create({
    data: {
      username: 'GovAgent',
      password: '123',
      role: UserRole.GOVERNMENT,
      email: 'gov@charak.health',
      firstName: 'Rajesh',
      lastName: 'Kumar',
    }
  })

  console.log('✅ Created demo users')

  // Create medical disorders with dual coding
  const disorders = [
    {
      englishName: 'Fever',
      sanskritName: 'Jwara',
      icd11Code: 'MG50',
      namasteCode: 'N001',
      category: 'Infectious Diseases',
      description: 'Elevated body temperature due to infection or inflammation',
      confidence: 98
    },
    {
      englishName: 'Headache',
      sanskritName: 'Shirashoola',
      icd11Code: 'MG30.0',
      namasteCode: 'N002',
      category: 'Neurological',
      description: 'Pain in the head or upper neck',
      confidence: 95
    },
    {
      englishName: 'Common Cold',
      sanskritName: 'Pratishyaya',
      icd11Code: 'CA40.0',
      namasteCode: 'N003',
      category: 'Respiratory',
      description: 'Viral infection of the upper respiratory tract',
      confidence: 92
    },
    {
      englishName: 'Cough',
      sanskritName: 'Kaasa',
      icd11Code: 'MD12.0',
      namasteCode: 'N004',
      category: 'Respiratory',
      description: 'Sudden expulsion of air from the lungs',
      confidence: 96
    },
    {
      englishName: 'Indigestion',
      sanskritName: 'Ajirna',
      icd11Code: 'DD90.1',
      namasteCode: 'N005',
      category: 'Digestive',
      description: 'Difficulty in digesting food',
      confidence: 94
    },
    {
      englishName: 'Anxiety',
      sanskritName: 'Chittodvega',
      icd11Code: '6B00',
      namasteCode: 'N006',
      category: 'Mental Health',
      description: 'Feeling of worry, nervousness, or unease',
      confidence: 90
    },
    {
      englishName: 'Diabetes',
      sanskritName: 'Madhumeha',
      icd11Code: '5A10',
      namasteCode: 'N007',
      category: 'Metabolic',
      description: 'Group of diseases that result in high blood sugar',
      confidence: 99
    },
    {
      englishName: 'Hypertension',
      sanskritName: 'Raktachapa',
      icd11Code: 'BA00',
      namasteCode: 'N008',
      category: 'Cardiovascular',
      description: 'High blood pressure condition',
      confidence: 97
    },
    {
      englishName: 'Arthritis',
      sanskritName: 'Sandhivata',
      icd11Code: 'FB30',
      namasteCode: 'N009',
      category: 'Musculoskeletal',
      description: 'Inflammation of joints causing pain and stiffness',
      confidence: 93
    },
    {
      englishName: 'Asthma',
      sanskritName: 'Swasa Roga',
      icd11Code: 'CA23',
      namasteCode: 'N010',
      category: 'Respiratory',
      description: 'Respiratory condition with narrowed airways',
      confidence: 96
    }
  ]

  const createdDisorders = []
  for (const disorder of disorders) {
    const created = await prisma.disorder.create({ data: disorder })
    createdDisorders.push(created)
  }

  console.log('✅ Created medical disorders')

  // Create demo patients
  const patients = [
    {
      abhaId: '12345678901234',
      firstName: 'Priya',
      lastName: 'Patel',
      dateOfBirth: new Date('1985-03-15'),
      gender: Gender.FEMALE,
      phone: '+91-9876543210',
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    {
      abhaId: '98765432109876',
      firstName: 'Rahul',
      lastName: 'Singh',
      dateOfBirth: new Date('1978-07-22'),
      gender: Gender.MALE,
      phone: '+91-8765432109',
      city: 'Bangalore',
      state: 'Karnataka'
    },
    {
      abhaId: '11223344556677',
      firstName: 'Anjali',
      lastName: 'Reddy',
      dateOfBirth: new Date('1992-11-08'),
      gender: Gender.FEMALE,
      phone: '+91-7654321098',
      city: 'Hyderabad',
      state: 'Telangana'
    },
    {
      abhaId: '55789012345678',
      firstName: 'Aaditya',
      lastName: 'Negi',
      dateOfBirth: new Date('1995-05-20'),
      gender: Gender.MALE,
      phone: '+91-9123456789',
      email: 'aaditya.negi@email.com',
      address: '123 Mountain View Society',
      city: 'Dehradun',
      state: 'Uttarakhand',
      pincode: '248001'
    }
  ]

  const createdPatients = []
  for (const patient of patients) {
    const created = await prisma.patient.create({ data: patient })
    createdPatients.push(created)
  }

  console.log('✅ Created demo patients')

  // Create sample diagnoses
  const diagnoses = [
    {
      patientId: createdPatients[0].id,
      disorderId: createdDisorders[0].id, // Fever
      doctorId: demoDoctor.id,
      notes: 'Patient presented with high fever and body aches',
      severity: 7,
      consentGiven: true,
      diagnosedAt: new Date('2024-09-15')
    },
    {
      patientId: createdPatients[0].id,
      disorderId: createdDisorders[1].id, // Headache
      doctorId: demoDoctor.id,
      notes: 'Tension headache, stress-related',
      severity: 5,
      consentGiven: true,
      diagnosedAt: new Date('2024-08-20')
    },
    {
      patientId: createdPatients[1].id,
      disorderId: createdDisorders[6].id, // Diabetes
      doctorId: demoDoctor.id,
      notes: 'Type 2 diabetes, requires lifestyle changes',
      severity: 8,
      consentGiven: true,
      status: DiagnosisStatus.CHRONIC,
      diagnosedAt: new Date('2024-07-10')
    }
  ]

  for (const diagnosis of diagnoses) {
    await prisma.diagnosis.create({ data: diagnosis })
  }

  console.log('✅ Created sample diagnoses')

  // Create analytics data
  const analyticsData = [
    {
      region: 'North India',
      state: 'Delhi',
      disorder: 'Respiratory Issues',
      ageGroup: '25-40',
      gender: Gender.MALE,
      cases: 1250,
      trend: TrendType.INCREASING,
      period: '2024-Q3'
    },
    {
      region: 'West India',
      state: 'Maharashtra',
      disorder: 'Digestive Disorders',
      ageGroup: '40-60',
      gender: Gender.FEMALE,
      cases: 890,
      trend: TrendType.STABLE,
      period: '2024-Q3'
    },
    {
      region: 'South India',
      state: 'Karnataka',
      disorder: 'Cardiovascular',
      ageGroup: '50+',
      gender: Gender.MALE,
      cases: 670,
      trend: TrendType.DECREASING,
      period: '2024-Q3'
    }
  ]

  for (const data of analyticsData) {
    await prisma.analyticsData.create({ data })
  }

  console.log('✅ Created analytics data')

  // Create EMR usage data
  const emrData = [
    {
      sectorType: 'Public Hospitals',
      region: 'All India',
      totalCenters: 1000,
      adoptedCenters: 850,
      adoptionRate: 85.0,
      month: '2024-09'
    },
    {
      sectorType: 'Private Clinics',
      region: 'All India',
      totalCenters: 5000,
      adoptedCenters: 3100,
      adoptionRate: 62.0,
      month: '2024-09'
    },
    {
      sectorType: 'Ayush Centers',
      region: 'All India',
      totalCenters: 2000,
      adoptedCenters: 760,
      adoptionRate: 38.0,
      month: '2024-09'
    }
  ]

  for (const data of emrData) {
    await prisma.eMRUsage.create({ data })
  }

  console.log('✅ Created EMR usage data')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📋 Demo Credentials:')
  console.log('Doctor: demodoctor / 123')
  console.log('Government: GovAgent / 123')
}

seedDatabase()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })