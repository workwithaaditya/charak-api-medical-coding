import { ApiClient } from '../lib/api';

export interface Disorder {
  id: string;
  englishName: string;
  sanskritName: string;
  icd11Code: string;
  namasteCode: string;
  category: string;
  description?: string;
  confidence: number;
  isActive: boolean;
}

export interface SearchDisordersParams {
  query: string;
  limit?: number;
  confidence?: number;
}

export class DisorderService {
  // Search disorders by English or Sanskrit names using API
  static async searchDisorders(params: SearchDisordersParams): Promise<Disorder[]> {
    const { query, limit = 10, confidence = 0 } = params;
    
    try {
      const disorders = await ApiClient.get<Disorder[]>(
        `/api/disorders/search?query=${encodeURIComponent(query)}&limit=${limit}&confidence=${confidence}`
      );
      return disorders;
    } catch (error) {
      console.error('Error searching disorders:', error);
      return [];
    }
  }

  // Get disorder by ID
  static async getDisorderById(id: string): Promise<Disorder | null> {
    try {
      return await ApiClient.get<Disorder>(`/api/disorders/${id}`);
    } catch (error) {
      console.error('Error fetching disorder:', error);
      return null;
    }
  }

  // Get all disorder categories
  static async getDisorderCategories(): Promise<string[]> {
    try {
      return await ApiClient.get<string[]>('/api/disorders/categories/list');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get disorders by ICD-11 or NAMASTE code
  static async getDisorderByCode(code: string, codeType: 'icd11' | 'namaste'): Promise<Disorder | null> {
    try {
      return await ApiClient.get<Disorder>(`/api/disorders/code/${code}?type=${codeType}`);
    } catch (error) {
      console.error('Error fetching disorder by code:', error);
      return null;
    }
  }

  // Get all disorders
  static async getAllDisorders(limit: number = 50): Promise<Disorder[]> {
    try {
      return await ApiClient.get<Disorder[]>(`/api/disorders?limit=${limit}`);
    } catch (error) {
      console.error('Error fetching disorders:', error);
      return [];
    }
  }
}