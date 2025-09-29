import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (!success) {
      setError('Invalid credentials. Try demodoctor/123 or GovAgent/123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light to-white flex items-center justify-center">
      <div className="medical-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-medical-primary mb-2">CHARAK API</h1>
          <p className="text-gray-600">Advanced Medical Coding System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="medical-search-input"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="medical-search-input"
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <button type="submit" className="w-full medical-button-primary">
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <p><strong>Doctor:</strong> demodoctor / 123</p>
          <p><strong>Government:</strong> GovAgent / 123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;