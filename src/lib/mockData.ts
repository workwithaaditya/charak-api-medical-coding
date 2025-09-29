// Mock data for frontend-only application
// In production, this would be replaced with API calls to a backend server

export const mockUsers = [
  {
    id: 'user_1',
    username: 'demodoctor',
    password: '123',
    role: 'DOCTOR' as const,
    email: 'doctor@charak.health',
    firstName: 'Dr. Aditya',
    lastName: 'Sharma',
  },
  {
    id: 'user_2',
    username: 'GovAgent',
    password: '123',
    role: 'GOVERNMENT' as const,
    email: 'gov@charak.health',
    firstName: 'Rajesh',
    lastName: 'Kumar',
  }
];

export const mockDisorders = [
  {
    id: 'disorder_1',
    englishName: 'Fever',
    sanskritName: 'Jwara',
    icd11Code: 'MG50',
    namasteCode: 'N001',
    category: 'Infectious Diseases',
    description: 'Elevated body temperature due to infection or inflammation',
    confidence: 98,
    isActive: true
  },
  {
    id: 'disorder_2',
    englishName: 'Headache',
    sanskritName: 'Shirashoola',
    icd11Code: 'MG30.0',
    namasteCode: 'N002',
    category: 'Neurological',
    description: 'Pain in the head or upper neck',
    confidence: 95,
    isActive: true
  },
  {
    id: 'disorder_3',
    englishName: 'Common Cold',
    sanskritName: 'Pratishyaya',
    icd11Code: 'CA40.0',
    namasteCode: 'N003',
    category: 'Respiratory',
    description: 'Viral infection of the upper respiratory tract',
    confidence: 92,
    isActive: true
  },
  {
    id: 'disorder_4',
    englishName: 'Cough',
    sanskritName: 'Kaasa',
    icd11Code: 'MD12.0',
    namasteCode: 'N004',
    category: 'Respiratory',
    description: 'Sudden expulsion of air from the lungs',
    confidence: 96,
    isActive: true
  },
  {
    id: 'disorder_5',
    englishName: 'Indigestion',
    sanskritName: 'Ajirna',
    icd11Code: 'DD90.1',
    namasteCode: 'N005',
    category: 'Digestive',
    description: 'Difficulty in digesting food',
    confidence: 94,
    isActive: true
  },
  {
    id: 'disorder_6',
    englishName: 'Anxiety',
    sanskritName: 'Chittodvega',
    icd11Code: '6B00',
    namasteCode: 'N006',
    category: 'Mental Health',
    description: 'Feeling of worry, nervousness, or unease',
    confidence: 90,
    isActive: true
  },
  {
    id: 'disorder_7',
    englishName: 'Diabetes',
    sanskritName: 'Madhumeha',
    icd11Code: '5A10',
    namasteCode: 'N007',
    category: 'Metabolic',
    description: 'Group of diseases that result in high blood sugar',
    confidence: 99,
    isActive: true
  },
  {
    id: 'disorder_8',
    englishName: 'Hypertension',
    sanskritName: 'Raktachapa',
    icd11Code: 'BA00',
    namasteCode: 'N008',
    category: 'Cardiovascular',
    description: 'High blood pressure condition',
    confidence: 97,
    isActive: true
  }
];

export const mockPatients = [
  {
    id: 'patient_1',
    abhaId: '12345678901234',
    firstName: 'Priya',
    lastName: 'Patel',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'FEMALE' as const,
    phone: '+91-9876543210',
    city: 'Mumbai',
    state: 'Maharashtra',
    diagnoses: [
      {
        id: 'diagnosis_1',
        diagnosedAt: new Date('2024-09-15'),
        disorder: mockDisorders[0],
        doctor: {
          username: 'demodoctor',
          firstName: 'Dr. Aditya',
          lastName: 'Sharma'
        },
        notes: 'Patient presented with high fever and body aches',
        severity: 7
      },
      {
        id: 'diagnosis_2',
        diagnosedAt: new Date('2024-08-20'),
        disorder: mockDisorders[1],
        doctor: {
          username: 'demodoctor',
          firstName: 'Dr. Aditya',
          lastName: 'Sharma'
        },
        notes: 'Tension headache, stress-related',
        severity: 5
      }
    ]
  },
  {
    id: 'patient_2',
    abhaId: '98765432109876',
    firstName: 'Rahul',
    lastName: 'Singh',
    dateOfBirth: new Date('1978-07-22'),
    gender: 'MALE' as const,
    phone: '+91-8765432109',
    city: 'Bangalore',
    state: 'Karnataka',
    diagnoses: [
      {
        id: 'diagnosis_3',
        diagnosedAt: new Date('2024-07-10'),
        disorder: mockDisorders[6],
        doctor: {
          username: 'demodoctor',
          firstName: 'Dr. Aditya',
          lastName: 'Sharma'
        },
        notes: 'Type 2 diabetes, requires lifestyle changes',
        severity: 8
      }
    ]
  }
];

export const mockAnalyticsData = [
  {
    disorder: 'Respiratory Issues',
    category: 'Respiratory',
    region: 'North India',
    trend: 'INCREASING' as const,
    ageGroup: '25-40',
    cases: 1250,
    icd11Code: 'CA40',
    namasteCode: 'N003'
  },
  {
    disorder: 'Digestive Disorders',
    category: 'Digestive',
    region: 'West India',
    trend: 'STABLE' as const,
    ageGroup: '40-60',
    cases: 890,
    icd11Code: 'DD90',
    namasteCode: 'N005'
  },
  {
    disorder: 'Cardiovascular',
    category: 'Cardiovascular',
    region: 'South India',
    trend: 'DECREASING' as const,
    ageGroup: '50+',
    cases: 670,
    icd11Code: 'BA00',
    namasteCode: 'N008'
  },
  {
    disorder: 'Mental Health',
    category: 'Mental Health',
    region: 'East India',
    trend: 'INCREASING' as const,
    ageGroup: '18-35',
    cases: 1450,
    icd11Code: '6B00',
    namasteCode: 'N006'
  }
];

export const mockVataData = [
  { state: 'Maharashtra', severity: 75, cases: 1200 },
  { state: 'Karnataka', severity: 68, cases: 980 },
  { state: 'Tamil Nadu', severity: 82, cases: 1450 },
  { state: 'Gujarat', severity: 55, cases: 750 },
  { state: 'Rajasthan', severity: 90, cases: 1680 },
  { state: 'Kerala', severity: 45, cases: 560 },
  { state: 'West Bengal', severity: 72, cases: 1100 }
];

export const mockEMRData = [
  {
    sectorType: 'Public Hospitals',
    region: 'All India',
    totalCenters: 1000,
    adoptedCenters: 850,
    adoptionRate: 85.0
  },
  {
    sectorType: 'Private Clinics',
    region: 'All India',
    totalCenters: 5000,
    adoptedCenters: 3100,
    adoptionRate: 62.0
  },
  {
    sectorType: 'Ayush Centers',
    region: 'All India',
    totalCenters: 2000,
    adoptedCenters: 760,
    adoptionRate: 38.0
  }
];