import React, { useState } from 'react';
import './index.css';

const ManagerRegistration = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [center, setCenter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const api = process.env.REACT_APP_API

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    console.log(name,password);

    try {
      const response = await fetch(`${api}/register-manager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode:"cors",
        body: JSON.stringify({
          name,
          password,
          center
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setLoading(false);
      alert('Employee registered successfully');
      console.log(data);

      setName('');
      setPassword('');
      setConfirmPassword('');
      setCenter('');
    } catch (error) {
      setLoading(false);
      setError('Failed to register. Please try again.');
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="employee-registration">
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            className="form-input"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            className="form-input"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="form-input"
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            className="form-checkbox"
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label className="form-label-checkbox" htmlFor="showPassword">Show Password</label>
        </div>

       
        <div className="form-group">
          <label className="form-label" htmlFor="center">Center</label>
          <select
            className="form-select"
            id="center"
            value={center}
            onChange={(e) => setCenter(e.target.value)}
            required
          >
            <option value="">Select Center</option>
            <option value="DWK">DWK</option>
            <option value="MVP">MVP</option>
            <option value="MVP">GWK</option>
          </select>
        </div>

        <div className="form-group">
          <button className="form-button" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

      </form>
    </div>
  );
};

export default ManagerRegistration;
