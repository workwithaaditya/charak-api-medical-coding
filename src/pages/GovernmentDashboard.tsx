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
    <div className="max-w-7xl mx-auto p-4">
      {/* Disease Analytics Search */}
      <div className="medical-card mb-4 p-4">
        <h2 className="text-base font-bold text-medical-primary mb-2">Disease Analytics Search</h2>
        <input
          type="text"
          placeholder="Search for disease trends and analytics"
          className="medical-search-input"
          onChange={(e) => searchDiseases(e.target.value)}
        />
        {loading && (
          <div className="mt-2 text-center text-gray-500 text-sm">
            Loading analytics data...
          </div>
        )}
        {diseaseAnalytics && (
          <div className="mt-3 p-2 bg-blue-50 rounded">
            <div className="text-sm font-medium">Found analytics for: {diseaseAnalytics.disorder || 'Selected condition'}</div>
            <div className="text-xs text-gray-600">Analysis results available</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Vata Imbalance Reports */}
        <div className="medical-card p-4">
          <h2 className="text-base font-bold text-medical-primary mb-3">Vata Imbalance Reports</h2>
          <div className="space-y-2">
            {vataData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-medium text-sm">{item.state}</span>
                <div className="flex items-center space-x-2 flex-1 ml-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-medical-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${item.severity}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium w-10">{item.severity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EMR Usage Breakdown */}
        <div className="medical-card p-4">
          <h2 className="text-base font-bold text-medical-primary mb-3">EMR Usage Breakdown</h2>
          <div className="space-y-3">
            {getEmrDisplayData().map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{item.sector}</span>
                  <span className="text-xs font-bold">{item.adoption}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${item.adoption}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anonymized Trend Data */}
      <div className="medical-card p-4">
        <h2 className="text-base font-bold text-medical-primary mb-3">Anonymized Trend Data</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-medical-primary">
                <th className="text-left p-2 font-semibold text-sm">Disorder Category</th>
                <th className="text-left p-2 font-semibold text-sm">Region</th>
                <th className="text-left p-2 font-semibold text-sm">Trend</th>
                <th className="text-left p-2 font-semibold text-sm">Age Group</th>
                <th className="text-left p-2 font-semibold text-sm">Cases</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium text-sm">{item.disorder}</td>
                  <td className="p-2 text-sm">{item.region}</td>
                  <td className="p-2">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getTrendColor(item.trend)}`}>
                      {item.trend}
                    </span>
                  </td>
                  <td className="p-2 text-sm">{item.ageGroup}</td>
                  <td className="p-2 font-semibold text-sm">{item.cases.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disease Analytics Modal */}
      {showDiseaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-medical-primary">Disease Analytics: {selectedDisease}</h3>
              <button
                onClick={() => setShowDiseaseModal(false)}
                className="text-gray-500 hover:text-gray-700 text-lg font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-medical-light p-3 rounded">
                <h4 className="font-semibold mb-2 text-sm">Regional Distribution</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>North India: 35%</div>
                  <div>South India: 28%</div>
                  <div>West India: 22%</div>
                  <div>East India: 15%</div>
                </div>
              </div>
              
              <div className="bg-medical-light p-3 rounded">
                <h4 className="font-semibold mb-2 text-sm">Seasonal Trends</h4>
                <div className="text-xs">
                  <div>Peak Season: Winter (Dec-Feb)</div>
                  <div>Lowest Incidence: Monsoon (Jun-Sep)</div>
                  <div>Growth Rate: +12% annually</div>
                </div>
              </div>
              
              <div className="bg-medical-light p-3 rounded">
                <h4 className="font-semibold mb-2 text-sm">Demographics</h4>
                <div className="text-xs">
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