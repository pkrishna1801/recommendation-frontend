import React, { useState } from 'react';
import { registerUser } from '../services/api';
import '../styles/Auth.css';

const Register = ({ onToggleForm }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const validateEmail = (email) => {
    // Simple email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    // Validate inputs
    if (!username.trim()) {
      setFormError('Username is required');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setFormError('Email is required');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setFormError('Password is required');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Attempt registration directly with the API
      const result = await registerUser(username, email, password);

      if (result.success) {
        setRegistrationSuccess(true);
        // Clear the form
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // Wait for 2 seconds before redirecting to login
        setTimeout(() => {
          onToggleForm(); // This switches to the login form
        }, 2000);
      } else {
        setFormError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setFormError('An error occurred during registration. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create an Account</h2>
      
      {registrationSuccess ? (
        <div className="auth-success">
          Registration successful! Redirecting to login page...
        </div>
      ) : (
        <>
          {formError && <div className="auth-error">{formError}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          
          <div className="auth-toggle">
            Already have an account?{' '}
            <button 
              className="auth-toggle-button" 
              onClick={onToggleForm}
              disabled={loading}
            >
              Login
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Register;