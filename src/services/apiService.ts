const API_BASE_URL = 'http://localhost:3002/api'; // Fixed: Point to backend portonst API_BASE_URL = 'http://localhost:3002/api';

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface SearchParams extends PaginationParams {
  search?: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }
    
    return data;
  }

  // Health Check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await this.handleResponse(response);
  }

  // Authentication
  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await this.handleResponse(response);
  }

  async register(userData: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: 'DOCTOR' | 'GOVERNMENT' | 'ADMIN';
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await this.handleResponse(response);
  }

  // Enhanced Users CRUD with pagination and search
  async getUsers(params?: SearchParams & { role?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.role) queryParams.set('role', params.role);
    if (params?.search) queryParams.set('search', params.search);
    
    const response = await fetch(`${API_BASE_URL}/users?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    return await this.handleResponse(response);
  }

  async createUser(userData: {
    username: string;
    password: string;
    email: string;
    role: 'DOCTOR' | 'GOVERNMENT' | 'ADMIN';
    firstName: string;
    lastName: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return await this.handleResponse(response);
  }

  async deleteUser(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return await this.handleResponse(response);
  }

  // Enhanced Patients CRUD with advanced search
  async getPatients(params?: SearchParams & {
    city?: string;
    state?: string;
    gender?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.city) queryParams.set('city', params.city);
    if (params?.state) queryParams.set('state', params.state);
    if (params?.gender) queryParams.set('gender', params.gender);
    
    const response = await fetch(`${API_BASE_URL}/patients?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    return await this.handleResponse(response);
  }

  async getPatientByAbhaId(abhaId: string) {
    const response = await fetch(`${API_BASE_URL}/patients/abha/${abhaId}`, {
      headers: this.getAuthHeaders()
    });
    return await this.handleResponse(response);
  }

  async createPatient(patientData: {
    abhaId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(patientData)
    });
    return await this.handleResponse(response);
  }

  // Enhanced Disorders CRUD with language support
  async getDisorders(params?: SearchParams & {
    category?: string;
    language?: 'english' | 'sanskrit';
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.category) queryParams.set('category', params.category);
    if (params?.language) queryParams.set('language', params.language);
    
    const response = await fetch(`${API_BASE_URL}/disorders?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    return await this.handleResponse(response);
  }

  async createDisorder(disorderData: {
    englishName: string;
    sanskritName: string;
    icd11Code: string;
    namasteCode: string;
    category: string;
    ayurvedicClassification: string;
    description?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/disorders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(disorderData)
    });
    return await this.handleResponse(response);
  }

  // Medical Analytics
  async getMedicalAnalytics() {
    const response = await fetch(`${API_BASE_URL}/medical/analytics/overview`, {
      headers: this.getAuthHeaders()
    });
    return await this.handleResponse(response);
  }

  // Enhanced Dashboard Data
  async getDashboardData() {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: this.getAuthHeaders()
    });
    return await this.handleResponse(response);
  }

  // Diagnosis Management
  async createDiagnosis(diagnosisData: {
    patientId: string;
    disorderId: string;
    notes?: string;
    severity?: number;
    status?: 'ACTIVE' | 'RESOLVED' | 'CHRONIC';
  }) {
    const response = await fetch(`${API_BASE_URL}/diagnoses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(diagnosisData)
    });
    return await this.handleResponse(response);
  }

  // Bulk Operations
  async bulkCreatePatients(patients: any[]) {
    const response = await fetch(`${API_BASE_URL}/bulk/patients`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ patients })
    });
    return await this.handleResponse(response);
  }

  // Database test
  async testDatabase() {
    const response = await fetch(`${API_BASE_URL}/db-test`);
    return await this.handleResponse(response);
  }

  // Backward compatibility methods for existing services
  async searchDisorders(query: string, language: 'english' | 'sanskrit' = 'english') {
    return this.getDisorders({ search: query, language, limit: 50 });
  }

  async addDiagnosis(diagnosisData: {
    patientId: string;
    disorderId: string;
    symptoms: string;
    treatment: string;
    notes?: string;
  }) {
    // Map old format to new format
    return this.createDiagnosis({
      patientId: diagnosisData.patientId,
      disorderId: diagnosisData.disorderId,
      notes: `Symptoms: ${diagnosisData.symptoms}\nTreatment: ${diagnosisData.treatment}${diagnosisData.notes ? `\nNotes: ${diagnosisData.notes}` : ''}`
    });
  }

  async getPatientHistory(patientId: string) {
    // This would typically be a separate endpoint, but for backward compatibility
    // we'll get the patient with diagnoses
    const patient = await this.getPatients({ search: patientId, limit: 1 });
    return (patient as any)?.patients?.[0]?.diagnoses || [];
  }

  // Problem 5 Fix: Add missing API methods
  async deletePatient(id: string) {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete patient');
    return response.json();
  }

  async updatePatient(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update patient');
    return response.json();
  }

  async deleteDisorder(id: string) {
    const response = await fetch(`${API_BASE_URL}/disorders/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete disorder');
    return response.json();
  }

  async updateDisorder(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/disorders/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update disorder');
    return response.json();
  }

  async searchPatients(searchTerm: string) {
    return this.getPatients({ search: searchTerm });
  }
}

export default new ApiService();