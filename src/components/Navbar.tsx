import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const doctorNav = [
    { id: 'dashboard', label: 'Medical Search' },
    { id: 'api', label: 'API Docs' }
  ];

  const govNav = [
    { id: 'analytics', label: 'Analytics Dashboard' },
    { id: 'api', label: 'API Docs' }
  ];

  const navItems = user.role === 'DOCTOR' ? doctorNav : govNav;

  return (
    <nav className="bg-white shadow border-b border-medical-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-medical-primary">CHARAK API</h1>
            </div>
            <div className="ml-6 flex space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-medical-primary text-white'
                      : 'text-gray-700 hover:text-medical-primary hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-medical-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-gray-700">{user.username}</span>
              <span className="text-xs bg-medical-accent text-white px-1.5 py-0.5 rounded">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-gray-700 hover:text-red-600 text-xs font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;