import { ApiClient } from '../lib/api';

export interface VataImbalanceData {
  state: string;
  severity: number;
  cases: number;
}

export interface EMRUsageData {
  sectorType: string;
  region: string;
  adoptionRate: number;
  totalCenters: number;
  adoptedCenters: number;
}

export interface AnalyticsTrend {
  region: string;
  state?: string;
  disorder: string;
  ageGroup: string;
  gender?: string;
  cases: number;
  trend: string;
  period: string;
}

export interface DetailedDiseaseAnalytics {
  disorder: string;
  totalCases: number;
  regionalDistribution: Record<string, number>;
  detailedData: AnalyticsTrend[];
}

export class AnalyticsService {
  // Get Vata imbalance reports by state (using mock data for compatibility)
  static async getVataImbalanceReports(): Promise<VataImbalanceData[]> {
    // This is a simulated dataset - in real scenario this would come from analytics
    return [
      { state: 'Delhi', severity: 75, cases: 1250 },
      { state: 'Maharashtra', severity: 68, cases: 890 },
      { state: 'Karnataka', severity: 62, cases: 670 },
      { state: 'Tamil Nadu', severity: 58, cases: 540 },
      { state: 'Gujarat', severity: 55, cases: 480 },
      { state: 'Rajasthan', severity: 52, cases: 420 },
      { state: 'Uttar Pradesh', severity: 48, cases: 380 },
      { state: 'West Bengal', severity: 45, cases: 350 }
    ];
  }

  // Get EMR usage statistics
  static async getEMRUsageStats(): Promise<EMRUsageData[]> {
    try {
      return await ApiClient.get<EMRUsageData[]>('/api/analytics/emr-usage');
    } catch (error) {
      console.error('Error fetching EMR usage stats:', error);
      return [];
    }
  }

  // Get anonymized trend data
  static async getAnonymizedTrendData(): Promise<AnalyticsTrend[]> {
    try {
      return await ApiClient.get<AnalyticsTrend[]>('/api/analytics/trends');
    } catch (error) {
      console.error('Error fetching trend data:', error);
      return [];
    }
  }

  // Get disease analytics for specific disorder
  static async getDetailedDiseaseAnalytics(disorderName: string): Promise<DetailedDiseaseAnalytics> {
    try {
      return await ApiClient.get<DetailedDiseaseAnalytics>(
        `/api/analytics/disease/${encodeURIComponent(disorderName)}`
      );
    } catch (error) {
      console.error('Error fetching disease analytics:', error);
      // Return mock data as fallback
      return {
        disorder: disorderName,
        totalCases: 0,
        regionalDistribution: {},
        detailedData: []
      };
    }
  }

  // Get dashboard summary
  static async getDashboardSummary() {
    try {
      return await ApiClient.get('/api/analytics/dashboard');
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      return {
        stats: {
          totalPatients: 0,
          totalDisorders: 0,
          totalDiagnoses: 0,
          totalUsers: 0
        },
        recentDiagnoses: []
      };
    }
  }
}