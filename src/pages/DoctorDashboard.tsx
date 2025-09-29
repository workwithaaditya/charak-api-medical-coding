import React, { useState } from 'react';
import { DisorderService } from '../services/disorderService';
import { PatientService } from '../services/patientService';
import { useAuth } from '../context/AuthContext';

interface Disorder {
  id: string;
  englishName: string;
  sanskritName: string;
  icd11Code: string;
  namasteCode: string;
  confidence: number;
}

interface PatientHistory {
  diagnosedAt: Date;
  disorder: {
    englishName: string;
    sanskritName: string;
    icd11Code: string;
    namasteCode: string;
  };
  doctor: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [abhaId, setAbhaId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Disorder[]>([]);
  const [patientHistory, setPatientHistory] = useState<PatientHistory[]>([]);
  const [sessionDiagnoses, setSessionDiagnoses] = useState<Disorder[]>([]);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedDisorder, setSelectedDisorder] = useState<Disorder | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<any>(null);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length > 1) {
      try {
        setLoading(true);
        const results = await DisorderService.searchDisorders({ 
          query: term, 
          limit: 10 
        });
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAbhaSearch = async () => {
    if (abhaId) {
      try {
        setLoading(true);
        const patient = await PatientService.findPatientByAbhaId(abhaId);
        if (patient) {
          setCurrentPatient(patient);
          setPatientHistory(patient.diagnoses as PatientHistory[] || []);
        } else {
          alert('Patient not found. Creating new patient record...');
          // In production, you'd show a form to create a new patient
        }
      } catch (error) {
        console.error('Patient search error:', error);
        alert('Error retrieving patient data');
      } finally {
        setLoading(false);
      }
    }
  };

  const addToDiagnosis = (disorder: Disorder) => {
    if (!currentPatient) {
      alert('Please select a patient first by entering their ABHA ID');
      return;
    }
    setSelectedDisorder(disorder);
    setShowConsentModal(true);
  };

  const confirmDiagnosis = async () => {
    if (selectedDisorder && currentPatient && user) {
      try {
        setLoading(true);
        await PatientService.addDiagnosis({
          patientId: currentPatient.id,
          disorderId: selectedDisorder.id,
          doctorId: user.id,
          consentGiven: true,
          notes: 'Diagnosed during consultation',
        });
        
        setSessionDiagnoses([...sessionDiagnoses, selectedDisorder]);
        setShowConsentModal(false);
        setSelectedDisorder(null);
        
        // Refresh patient history
        await handleAbhaSearch();
      } catch (error) {
        console.error('Error adding diagnosis:', error);
        alert('Error adding diagnosis');
      } finally {
        setLoading(false);
      }
    }
  };

  const generateHandout = () => {
    alert(`Generating treatment handout for ${sessionDiagnoses.length} diagnoses...`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Patient Context Section */}
      <div className="medical-card mb-6 p-6">
        <h2 className="text-xl font-bold text-medical-primary mb-4">Patient Context</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={abhaId}
            onChange={(e) => setAbhaId(e.target.value)}
            placeholder="Enter ABHA ID"
            className="medical-search-input flex-1"
          />
          <button onClick={handleAbhaSearch} className="medical-button-primary">
            Retrieve History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical Search Section */}
        <div className="medical-card p-6">
          <h2 className="text-xl font-bold text-medical-primary mb-4">Intelligent Medical Search</h2>
          
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search disorders (English/Sanskrit)"
              className="medical-search-input"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-500 py-4">
                Searching medical conditions...
              </div>
            ) : (
              searchResults.map((disorder) => (
                <div key={disorder.id} className="p-3 border rounded-md hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{disorder.englishName} / {disorder.sanskritName}</div>
                      <div className="text-sm text-gray-600">
                        ICD-11: {disorder.icd11Code} | NAMASTE: {disorder.namasteCode}
                      </div>
                      <div className="text-xs text-medical-accent">
                        Confidence: {disorder.confidence}%
                      </div>
                    </div>
                    <button
                      onClick={() => addToDiagnosis(disorder)}
                      className="text-sm bg-medical-primary text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Patient History */}
        <div className="medical-card p-6">
          <h2 className="text-xl font-bold text-medical-primary mb-4">Patient History</h2>
          
          {patientHistory.length > 0 ? (
            <div className="space-y-3">
              {patientHistory.map((entry, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <div className="font-medium">{entry.disorder.englishName} / {entry.disorder.sanskritName}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(entry.diagnosedAt).toLocaleDateString()} | ICD-11: {entry.disorder.icd11Code}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Enter ABHA ID to retrieve patient history
            </div>
          )}
        </div>
      </div>

      {/* Session Diagnoses */}
      <div className="medical-card mt-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-medical-primary">Current Session Diagnoses</h2>
          {sessionDiagnoses.length > 0 && (
            <button onClick={generateHandout} className="medical-button-primary">
              Generate Handout
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessionDiagnoses.map((diagnosis, index) => (
            <div key={index} className="p-4 bg-medical-light rounded-md">
              <div className="font-medium">{diagnosis.englishName}</div>
              <div className="text-sm text-gray-600">{diagnosis.sanskritName}</div>
              <div className="text-xs mt-1">
                ICD-11: {diagnosis.icd11Code} | NAMASTE: {diagnosis.namasteCode}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ABHA Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">ABHA Consent Required</h3>
            <p className="text-gray-600 mb-4">
              Adding this diagnosis will update the patient's medical record. 
              Do you have patient consent for this update?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDiagnosis}
                className="flex-1 bg-medical-primary text-white py-2 rounded"
              >
                Confirm with Consent
              </button>
              <button
                onClick={() => setShowConsentModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;