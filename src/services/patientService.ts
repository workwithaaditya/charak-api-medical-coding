import { ApiClient } from '../lib/api';

export interface Patient {
  id: string;
  abhaId: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  diagnoses?: any[];
}

export interface CreateDiagnosisData {
  patientId: string;
  disorderId: string;
  doctorId: string;
  notes?: string;
  severity?: number;
  consentGiven: boolean;
}

export interface PatientStats {
  totalPatients: number;
  totalDiagnoses: number;
  activePatients: number;
  recentDiagnoses?: number;
}

export class PatientService {
  // Find patient by ABHA ID
  static async findPatientByAbhaId(abhaId: string): Promise<Patient | null> {
    try {
      return await ApiClient.get<Patient>(`/api/patients/abha/${abhaId}`);
    } catch (error) {
      console.error('Error finding patient:', error);
      return null;
    }
  }

  // Add diagnosis
  static async addDiagnosis(data: CreateDiagnosisData) {
    try {
      return await ApiClient.post('/api/diagnoses', data);
    } catch (error) {
      console.error('Error adding diagnosis:', error);
      throw error;
    }
  }

  // Get patient medical history
  static async getPatientHistory(abhaId: string, limit: number = 20) {
    try {
      const patient = await this.findPatientByAbhaId(abhaId);
      return patient?.diagnoses?.slice(0, limit) || [];
    } catch (error) {
      console.error('Error fetching patient history:', error);
      return [];
    }
  }

  // Get patient statistics
  static async getPatientStats(): Promise<PatientStats> {
    try {
      return await ApiClient.get<PatientStats>('/api/patients/stats/summary');
    } catch (error) {
      console.error('Error fetching patient stats:', error);
      return {
        totalPatients: 0,
        totalDiagnoses: 0,
        activePatients: 0
      };
    }
  }

  // Search patients by name or ABHA ID
  static async searchPatients(query: string, limit: number = 10): Promise<Patient[]> {
    try {
      return await ApiClient.get<Patient[]>(
        `/api/patients/search?query=${encodeURIComponent(query)}&limit=${limit}`
      );
    } catch (error) {
      console.error('Error searching patients:', error);
      return [];
    }
  }

  // Create new patient
  static async createPatient(patientData: Partial<Patient>): Promise<Patient | null> {
    try {
      return await ApiClient.post<Patient>('/api/patients', patientData);
    } catch (error) {
      console.error('Error creating patient:', error);
      return null;
    }
  }

  // Update patient
  static async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient | null> {
    try {
      return await ApiClient.put<Patient>(`/api/patients/${id}`, patientData);
    } catch (error) {
      console.error('Error updating patient:', error);
      return null;
    }
  }
}