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
    role: 'NORMAL_USER'
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
      await api.post('/auth/register', formData);
      
      setStatusMessage({ type: 'success', text: 'Registration successful! Redirecting...' });
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
    <>
      {/* Embedded CSS to guarantee styling works without external files */}
      <style>{`
        .register-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f4f7f6;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 20px;
        }
        .register-card {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 480px;
          box-sizing: border-box;
        }
        .register-card h2 {
          text-align: center;
          color: #2d3748;
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 28px;
        }
        .register-subtitle {
          text-align: center;
          color: #718096;
          margin-bottom: 24px;
          font-size: 15px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #4a5568;
          font-weight: 600;
          font-size: 14px;
        }
        .form-control {
          width: 100%;
          padding: 12px;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 15px;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .form-control:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }
        .form-hint {
          display: block;
          font-size: 12px;
          color: #a0aec0;
          margin-top: 6px;
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background-color: #3182ce;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 10px;
        }
        .submit-btn:hover:not(:disabled) {
          background-color: #2b6cb0;
        }
        .submit-btn:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }
        .alert {
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }
        .alert-error {
          background-color: #fed7d7;
          color: #c53030;
          border: 1px solid #fc8181;
        }
        .alert-success {
          background-color: #c6f6d5;
          color: #276749;
          border: 1px solid #68d391;
        }
        .login-link {
          text-align: center;
          margin-top: 24px;
          font-size: 15px;
          color: #4a5568;
        }
        .login-link a {
          color: #3182ce;
          text-decoration: none;
          font-weight: 600;
        }
        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="register-wrapper">
        <div className="register-card">
          <h2>Create your account</h2>
          <p className="register-subtitle">Join our platform to rate and manage stores.</p>

          {statusMessage.text && (
            <div className={`alert ${statusMessage.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                name="name" 
                type="text" 
                className="form-control"
                required 
                minLength={20} 
                maxLength={60} 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter your full legal name" 
              />
              <span className="form-hint">20-60 characters required</span>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                name="email" 
                type="email" 
                className="form-control"
                required 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="john@example.com" 
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                name="password" 
                type="password" 
                className="form-control"
                required 
                minLength={8} 
                maxLength={16} 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
              />
              <span className="form-hint">8-16 chars, 1 uppercase, 1 special character</span>
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea 
                name="address" 
                className="form-control"
                required 
                maxLength={400} 
                value={formData.address} 
                onChange={handleChange} 
                rows="3" 
                placeholder="City, Country" 
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label>Account Type (Role)</label>
              <select 
                name="role" 
                className="form-control"
                value={formData.role} 
                onChange={handleChange}
              >
                <option value="NORMAL_USER">Normal User (Rate Stores)</option>
                <option value="STORE_OWNER">Store Owner (Manage Stores)</option>
                <option value="SYSTEM_ADMIN">System Admin (Full Access)</option>
              </select>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="login-link">
            Already have an account? <Link to="/login">Sign in instead</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;