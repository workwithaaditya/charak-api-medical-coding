import { mockDisorders } from '../lib/mockData'

export interface SearchDisordersParams {
  query: string
  limit?: number
  confidence?: number
}

export class DisorderService {
  // Search disorders by English or Sanskrit names using mock data
  static async searchDisorders(params: SearchDisordersParams) {
    const { query, limit = 10, confidence = 0 } = params
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const results = mockDisorders.filter(disorder =>
      disorder.isActive &&
      disorder.confidence >= confidence &&
      (
        disorder.englishName.toLowerCase().includes(query.toLowerCase()) ||
        disorder.sanskritName.toLowerCase().includes(query.toLowerCase()) ||
        disorder.category.toLowerCase().includes(query.toLowerCase())
      )
    )

    return results
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit)
  }

  // Get disorder by ID
  static async getDisorderById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockDisorders.find(d => d.id === id)
  }

  // Get all disorder categories
  static async getDisorderCategories() {
    await new Promise(resolve => setTimeout(resolve, 100))
    const categories = mockDisorders.reduce((acc, disorder) => {
      if (!acc[disorder.category]) {
        acc[disorder.category] = 0
      }
      acc[disorder.category]++
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categories).map(([name, count]) => ({ name, count }))
  }

  // Get disorders by ICD-11 or NAMASTE code
  static async getDisorderByCode(code: string, codeType: 'icd11' | 'namaste') {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return mockDisorders.find(disorder =>
      codeType === 'icd11' ? disorder.icd11Code === code : disorder.namasteCode === code
    )
  }

  // Get popular disorders (mock implementation)
  static async getPopularDisorders(limit: number = 10) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return mockDisorders
      .slice(0, limit)
      .sort((a, b) => b.confidence - a.confidence)
  }
}