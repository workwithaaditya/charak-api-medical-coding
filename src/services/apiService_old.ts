const API_BASE_URL = 'http://localhost:3000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
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
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) {
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
    email?: string;
    role: 'DOCTOR' | 'GOVERNMENT' | 'ADMIN';
    firstName?: string;
    lastName?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return await response.json();
  }

  async deleteUser(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return await response.json();
  }

  // Disorders CRUD
  async getDisorders(params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/disorders?${searchParams}`, {
      headers: this.getAuthHeaders()
    });
    return await response.json();
  }

  async createDisorder(disorderData: {
    englishName: string;
    sanskritName?: string;
    icd11Code: string;
    namasteCode: string;
    category: string;
    description?: string;
    severity?: string;
    treatment?: string;
    symptoms?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/disorders`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(disorderData)
    });
    return await response.json();
  }

  async updateDisorder(id: string, disorderData: any) {
    const response = await fetch(`${API_BASE_URL}/disorders/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(disorderData)
    });
    return await response.json();
  }

  async deleteDisorder(id: string) {
    const response = await fetch(`${API_BASE_URL}/disorders/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return await response.json();
  }

  // Patients CRUD
  async getPatients(params?: {
    abhaId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.abhaId) searchParams.append('abhaId', params.abhaId);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/patients?${searchParams}`, {
      headers: this.getAuthHeaders()
    });
    return await response.json();
  }

  async createPatient(patientData: {
    abhaId: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
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
    return await response.json();
  }

  async updatePatient(id: string, patientData: any) {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(patientData)
    });
    return await response.json();
  }

  async deletePatient(id: string) {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return await response.json();
  }

  // Diagnoses
  async addDiagnosis(patientId: string, diagnosisData: {
    disorderId: string;
    diagnosis: string;
    notes?: string;
    severity?: number;
    status?: 'ACTIVE' | 'RESOLVED' | 'CHRONIC' | 'FOLLOW_UP';
    consentGiven?: boolean;
  }) {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/diagnoses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(diagnosisData)
    });
    return await response.json();
  }

  // Analytics
  async getAnalytics() {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      headers: this.getAuthHeaders()
    });
    return await response.json();
  }

  async getDashboardData() {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: this.getAuthHeaders()
    });
    return await response.json();
  }

  // Health checks
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      return { status: 'ERROR', message: 'API server not reachable' };
    }
  }

  async databaseTest() {
    try {
      const response = await fetch(`${API_BASE_URL}/db-test`);
      return await response.json();
    } catch (error) {
      return { status: 'Database Connection Failed', error: 'Database not reachable' };
    }
  }

  // Utility methods for data management
  async bulkCreateDisorders(disorders: any[]) {
    const promises = disorders.map(disorder => this.createDisorder(disorder));
    return await Promise.allSettled(promises);
  }

  async bulkCreatePatients(patients: any[]) {
    const promises = patients.map(patient => this.createPatient(patient));
    return await Promise.allSettled(promises);
  }

  // Export/Import functionality
  async exportData(type: 'users' | 'disorders' | 'patients' | 'all') {
    switch (type) {
      case 'users':
        return await this.getUsers();
      case 'disorders':
        return await this.getDisorders({ limit: 1000 });
      case 'patients':
        return await this.getPatients({ limit: 1000 });
      case 'all':
        const [users, disorders, patients] = await Promise.all([
          this.getUsers(),
          this.getDisorders({ limit: 1000 }),
          this.getPatients({ limit: 1000 })
        ]);
        return { users, disorders, patients };
      default:
        throw new Error('Invalid export type');
    }
  }

  // Search functionality
  async searchMedical(query: string) {
    const [disorders, patients] = await Promise.all([
      this.getDisorders({ search: query, limit: 10 }),
      this.getPatients({ search: query, limit: 10 })
    ]);
    
    return {
      disorders: disorders.disorders || [],
      patients: patients.patients || []
    };
  }
}

export const apiService = new ApiService();
export type { ApiService };