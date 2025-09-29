import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/analyticsService';

interface AnalyticsData {
  disorder: string;
  region: string;
  trend: string;
  ageGroup: string;
  cases: number;
}

interface VataData {
  state: string;
  severity: number;
  cases: number;
}

const GovernmentDashboard: React.FC = () => {
  const [selectedDisease, setSelectedDisease] = useState('');
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [vataData, setVataData] = useState<VataData[]>([]);
  const [loading, setLoading] = useState(false);
  const [diseaseAnalytics, setDiseaseAnalytics] = useState<any>(null);
  const [emrData, setEmrData] = useState<any[]>([]);

  // Load data on component mount
  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [trendData, vataReports, emrUsage] = await Promise.all([
        AnalyticsService.getAnonymizedTrendData(),
        AnalyticsService.getVataImbalanceReports(),
        AnalyticsService.getEMRUsageStats()
      ]);
      
      setAnalyticsData(trendData);
      setVataData(vataReports);
      setEmrData(emrUsage);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmrDisplayData = () => {
    return emrData.length > 0 ? emrData.map(item => ({
      sector: item.sectorType,
      adoption: item.adoptionRate,
      color: item.sectorType === 'Public Hospitals' ? 'bg-medical-primary' :
             item.sectorType === 'Private Clinics' ? 'bg-medical-accent' : 'bg-gray-400'
    })) : [
      { sector: 'Public Hospitals', adoption: 85, color: 'bg-medical-primary' },
      { sector: 'Private Clinics', adoption: 62, color: 'bg-medical-accent' },
      { sector: 'Ayush Centers', adoption: 38, color: 'bg-gray-400' }
    ];
  };

  const searchDiseases = async (query: string) => {
    setSelectedDisease(query);
    if (query.length > 2) {
      try {
        const analytics = await AnalyticsService.getDetailedDiseaseAnalytics(query);
        setDiseaseAnalytics(analytics);
        setShowDiseaseModal(true);
      } catch (error) {
        console.error('Error fetching disease analytics:', error);
        setShowDiseaseModal(true);
      }
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Increasing': return 'text-red-600 bg-red-100';
      case 'Decreasing': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Disease Analytics Search */}
      <div className="medical-card mb-6 p-6">
        <h2 className="text-xl font-bold text-medical-primary mb-4">Disease Analytics Search</h2>
        <input
          type="text"
          placeholder="Search for disease trends and analytics"
          className="medical-search-input"
          onChange={(e) => searchDiseases(e.target.value)}
        />
        {loading && (
          <div className="mt-3 text-center text-gray-500">
            Loading analytics data...
          </div>
        )}
        {diseaseAnalytics && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <div className="text-sm font-medium">Found analytics for: {diseaseAnalytics.disorder || 'Selected condition'}</div>
            <div className="text-xs text-gray-600">Analysis results available</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Vata Imbalance Reports */}
        <div className="medical-card p-6">
          <h2 className="text-xl font-bold text-medical-primary mb-4">Vata Imbalance Reports</h2>
          <div className="space-y-3">
            {vataData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-medium">{item.state}</span>
                <div className="flex items-center space-x-2 flex-1 ml-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-medical-primary h-4 rounded-full transition-all duration-300"
                      style={{ width: `${item.severity}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12">{item.severity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EMR Usage Breakdown */}
        <div className="medical-card p-6">
          <h2 className="text-xl font-bold text-medical-primary mb-4">EMR Usage Breakdown</h2>
          <div className="space-y-4">
            {getEmrDisplayData().map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{item.sector}</span>
                  <span className="text-sm font-bold">{item.adoption}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${item.color} h-3 rounded-full transition-all duration-300`}
                    style={{ width: `${item.adoption}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anonymized Trend Data */}
      <div className="medical-card p-6">
        <h2 className="text-xl font-bold text-medical-primary mb-4">Anonymized Trend Data</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-medical-primary">
                <th className="text-left p-3 font-semibold">Disorder Category</th>
                <th className="text-left p-3 font-semibold">Region</th>
                <th className="text-left p-3 font-semibold">Trend</th>
                <th className="text-left p-3 font-semibold">Age Group</th>
                <th className="text-left p-3 font-semibold">Cases</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.disorder}</td>
                  <td className="p-3">{item.region}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(item.trend)}`}>
                      {item.trend}
                    </span>
                  </td>
                  <td className="p-3">{item.ageGroup}</td>
                  <td className="p-3 font-semibold">{item.cases.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disease Analytics Modal */}
      {showDiseaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-medical-primary">Disease Analytics: {selectedDisease}</h3>
              <button
                onClick={() => setShowDiseaseModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-medical-light p-4 rounded-md">
                <h4 className="font-semibold mb-2">Regional Distribution</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>North India: 35%</div>
                  <div>South India: 28%</div>
                  <div>West India: 22%</div>
                  <div>East India: 15%</div>
                </div>
              </div>
              
              <div className="bg-medical-light p-4 rounded-md">
                <h4 className="font-semibold mb-2">Seasonal Trends</h4>
                <div className="text-sm">
                  <div>Peak Season: Winter (Dec-Feb)</div>
                  <div>Lowest Incidence: Monsoon (Jun-Sep)</div>
                  <div>Growth Rate: +12% annually</div>
                </div>
              </div>
              
              <div className="bg-medical-light p-4 rounded-md">
                <h4 className="font-semibold mb-2">Demographics</h4>
                <div className="text-sm">
                  <div>Most Affected: Adults 25-45 years</div>
                  <div>Gender Ratio: 60% Male, 40% Female</div>
                  <div>Urban vs Rural: 70% Urban, 30% Rural</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentDashboard;