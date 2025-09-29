import { mockAnalyticsData, mockVataData, mockEMRData } from '../lib/mockData'

export interface VataImbalanceData {
  state: string
  severity: number
  cases: number
}

export interface EMRUsageData {
  sectorType: string
  region: string
  adoptionRate: number
  totalCenters: number
  adoptedCenters: number
}

export class AnalyticsService {
  // Get Vata imbalance reports by state
  static async getVataImbalanceReports(): Promise<VataImbalanceData[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockVataData
  }

  // Get EMR usage statistics
  static async getEMRUsageStats(): Promise<EMRUsageData[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockEMRData
  }

  // Get anonymized trend data
  static async getAnonymizedTrendData() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockAnalyticsData
  }

  // Get disease analytics for specific disorder
  static async getDetailedDiseaseAnalytics(disorderName: string) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simulate detailed analytics based on search term
    return {
      disorder: disorderName,
      sanskritName: 'Mock Sanskrit Name',
      totalCases: Math.floor(Math.random() * 1000) + 100,
      regionalDistribution: {
        'North India': 35,
        'South India': 28,
        'West India': 22,
        'East India': 15
      },
      seasonalTrends: {
        peak: 'Winter (Dec-Feb)',
        lowest: 'Monsoon (Jun-Sep)',
        growthRate: '+12% annually'
      },
      demographics: {
        mostAffected: 'Adults 25-45 years',
        genderRatio: '60% Male, 40% Female',
        urbanVsRural: '70% Urban, 30% Rural'
      }
    }
  }
}