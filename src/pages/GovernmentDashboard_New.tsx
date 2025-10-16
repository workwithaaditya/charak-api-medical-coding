import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/analyticsService';
import DataManagement from '../components/DataManagement';

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
  const [activeTab, setActiveTab] = useState<'analytics' | 'data'>('analytics');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [vataData, setVataData] = useState<VataData[]>([]);
  const [loading, setLoading] = useState(false);
  const [emrData, setEmrData] = useState<any[]>([]);

  // Load data on component mount
  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalyticsData();
    }
  }, [activeTab]);

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
        await AnalyticsService.getDetailedDiseaseAnalytics(query);
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
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-medical-primary text-medical-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📊 Analytics Dashboard
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'data'
                ? 'border-medical-primary text-medical-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🗄️ Data Management
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'data' ? (
        <DataManagement userRole="GOVERNMENT" />
      ) : (
        <>
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
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Disease Trends */}
            <div className="medical-card p-6">
              <h3 className="text-lg font-semibold text-medical-primary mb-4">Disease Trends by Region</h3>
              <div className="space-y-3">
                {analyticsData.length > 0 ? analyticsData.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-medical-light rounded">
                    <div>
                      <div className="font-medium">{item.disorder}</div>
                      <div className="text-sm text-gray-600">{item.region} • {item.ageGroup}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.cases.toLocaleString()}</div>
                      <div className={`text-xs px-2 py-1 rounded ${getTrendColor(item.trend)}`}>
                        {item.trend}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 py-4">
                    Loading trend data...
                  </div>
                )}
              </div>
            </div>

            {/* EMR Adoption */}
            <div className="medical-card p-6">
              <h3 className="text-lg font-semibold text-medical-primary mb-4">EMR Adoption Rates</h3>
              <div className="space-y-4">
                {getEmrDisplayData().map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{item.sector}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.adoption}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{item.adoption}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vata Imbalance Reports */}
          <div className="medical-card p-6 mb-6">
            <h3 className="text-lg font-semibold text-medical-primary mb-4">Vata Imbalance Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vataData.length > 0 ? vataData.slice(0, 6).map((item, index) => (
                <div key={index} className="bg-medical-light p-4 rounded">
                  <h4 className="font-semibold">{item.state}</h4>
                  <div className="mt-2">
                    <div className="text-sm text-gray-600">Cases: {item.cases.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">
                      Severity: 
                      <span className={`ml-1 ${item.severity > 7 ? 'text-red-600' : item.severity > 4 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {item.severity}/10
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <>
                  <div className="bg-medical-light p-4 rounded">
                    <h4 className="font-semibold">Maharashtra</h4>
                    <div className="mt-2">
                      <div className="text-sm text-gray-600">Cases: 15,234</div>
                      <div className="text-sm text-gray-600">Severity: <span className="text-yellow-600">6/10</span></div>
                    </div>
                  </div>
                  <div className="bg-medical-light p-4 rounded">
                    <h4 className="font-semibold">Tamil Nadu</h4>
                    <div className="mt-2">
                      <div className="text-sm text-gray-600">Cases: 12,456</div>
                      <div className="text-sm text-gray-600">Severity: <span className="text-green-600">4/10</span></div>
                    </div>
                  </div>
                  <div className="bg-medical-light p-4 rounded">
                    <h4 className="font-semibold">Karnataka</h4>
                    <div className="mt-2">
                      <div className="text-sm text-gray-600">Cases: 10,789</div>
                      <div className="text-sm text-gray-600">Severity: <span className="text-red-600">8/10</span></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Disease Detail Modal */}
          {showDiseaseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-medical-primary">
                    Disease Analytics: {selectedDisease}
                  </h3>
                  <button 
                    onClick={() => setShowDiseaseModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
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
        </>
      )}
    </div>
  );
};

export default GovernmentDashboard;