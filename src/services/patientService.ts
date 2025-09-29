import { mockPatients, mockDisorders } from '../lib/mockData'

export interface CreateDiagnosisData {
  patientId: string
  disorderId: string
  doctorId: string
  notes?: string
  severity?: number
  consentGiven: boolean
}

// In-memory storage for new diagnoses (in production, this would be in a database)
let diagnosisCounter = 4
const newDiagnoses: any[] = []

export class PatientService {
  // Find patient by ABHA ID
  static async findPatientByAbhaId(abhaId: string) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const patient = mockPatients.find(p => p.abhaId === abhaId)
    if (patient) {
      // Add any new diagnoses that were added during this session
      const additionalDiagnoses = newDiagnoses.filter(d => d.patientId === patient.id)
      return {
        ...patient,
        diagnoses: [...patient.diagnoses, ...additionalDiagnoses]
      }
    }
    return null
  }

  // Add diagnosis
  static async addDiagnosis(data: CreateDiagnosisData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const disorder = mockDisorders.find(d => d.id === data.disorderId)
    if (!disorder) {
      throw new Error('Disorder not found')
    }

    const diagnosis = {
      id: `diagnosis_${diagnosisCounter++}`,
      patientId: data.patientId,
      disorderId: data.disorderId,
      doctorId: data.doctorId,
      notes: data.notes,
      severity: data.severity,
      consentGiven: data.consentGiven,
      diagnosedAt: new Date(),
      disorder: disorder,
      doctor: {
        username: 'demodoctor',
        firstName: 'Dr. Aditya',
        lastName: 'Sharma'
      }
    }

    // Add to in-memory storage
    newDiagnoses.push(diagnosis)

    return diagnosis
  }

  // Get patient medical history
  static async getPatientHistory(abhaId: string, limit: number = 20) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const patient = mockPatients.find(p => p.abhaId === abhaId)
    if (!patient) {
      throw new Error('Patient not found')
    }

    return patient.diagnoses.slice(0, limit)
  }

  // Get patient statistics
  static async getPatientStats() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const totalDiagnoses = mockPatients.reduce((sum, p) => sum + p.diagnoses.length, 0) + newDiagnoses.length
    
    return {
      totalPatients: mockPatients.length,
      totalDiagnoses: totalDiagnoses,
      activePatients: mockPatients.length,
    }
  }

  // Search patients by name or ABHA ID
  static async searchPatients(query: string, limit: number = 10) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const results = mockPatients.filter(patient =>
      patient.abhaId.includes(query) ||
      patient.firstName?.toLowerCase().includes(query.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(query.toLowerCase()) ||
      patient.phone?.includes(query)
    )

    return results.slice(0, limit)
  }
}