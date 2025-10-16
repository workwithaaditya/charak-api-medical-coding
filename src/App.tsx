import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DoctorDashboard from './pages/DoctorDashboard';
import ApiDocs from './pages/ApiDocs';
import Navbar from './components/Navbar';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-medical-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DoctorDashboard />;
      case 'api':
        return <ApiDocs />;
      default:
        return <DoctorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light to-gray-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pt-4">
        {renderPage()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;