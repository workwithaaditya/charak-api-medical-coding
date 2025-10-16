import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const navItems = [
    { id: 'dashboard', label: 'CHARAK EMR' },
    { id: 'api', label: 'API Documentation' }
  ];

  return (
    <nav className="bg-white shadow-lg border-b-2 border-medical-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-medical-primary">CHARAK API</h1>
            </div>
            <div className="ml-10 flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-medical-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-700">{user.username}</span>
              <span className="text-xs bg-medical-accent text-white px-2 py-1 rounded-full">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-gray-700 hover:text-red-600 text-sm font-medium"
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