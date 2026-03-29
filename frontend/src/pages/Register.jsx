import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Mock API added for the preview environment to compile successfully.
// When copying to your local project, remove this block and restore: import api from '../utils/api';
const api = {
  post: async (url, data) => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: { message: "Success" } }), 1000));
  }
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'NORMAL_USER' // Default role added
  });
  
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      // Using your dynamic API utility! No hardcoded URLs.
      await api.post('/auth/register', formData);
      
      setStatusMessage({ type: 'success', text: 'Registration successful! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (err) {
      setStatusMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Registration failed. Check your inputs.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our platform and start managing your store experiences.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          
          {/* Status Message Display */}
          {statusMessage.text && (
            <div className={`mb-4 p-3 rounded text-sm ${statusMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {statusMessage.text}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name (20-60 characters)</label>
              <div className="mt-1">
                <input
                  name="name"
                  type="text"
                  required
                  minLength={20}
                  maxLength={60}
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your full legal name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password (8-16 chars, 1 uppercase, 1 special)</label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  maxLength={16}
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Address (Max 400 chars)</label>
              <div className="mt-1">
                <textarea
                  name="address"
                  required
                  maxLength={400}
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <div className="mt-1">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="NORMAL_USER">Normal User (Rate Stores)</option>
                  <option value="STORE_OWNER">Store Owner (Manage Stores)</option>
                  <option value="SYSTEM_ADMIN">System Admin (Full Access)</option>
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">Select your role for testing purposes.</p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'} transition duration-150 ease-in-out`}
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;