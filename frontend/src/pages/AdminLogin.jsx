import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegister) {
      const result = await register(username, password);
      if (result.success) {
        setSuccess('Registration successful! Logging in...');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setError(result.message || 'Registration failed (note: only one admin can register)');
      }
    } else {
      const result = await login(username, password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.message || 'Invalid username or password');
      }
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card glow-card">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>
          {isRegister ? 'Create Admin Account' : 'Admin Portal'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
          {isRegister ? 'Register the first administrator user.' : 'Authenticate to manage portfolio databases.'}
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                id="login-username"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.8rem' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-pass">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                id="login-pass"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.8rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', border: 'none', fontFamily: 'inherit' }}
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem' }}>
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}
          >
            {isRegister ? 'Back to Login' : 'Setup first admin account?'}
          </button>
        </div>
      </div>
    </div>
  );
}
