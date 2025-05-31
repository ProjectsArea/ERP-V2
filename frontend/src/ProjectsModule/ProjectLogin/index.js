import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

function ProjectLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      navigate("/project-navbar/enquiry");
    }
  }, [navigate]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/project/login', {
        username,
        password
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem('jwt_token', token);
        navigate("/project-navbar/enquiry");
      } else {
        alert("Login failed: Token not received.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Invalid credentials or server error");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Sign In</h2>
          <div className="input-group">
            <label className="login-label" htmlFor="username">Username</label>
            <input
              className="login-input"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="login-label" htmlFor="password">Password</label>
            <div className="password-container">
              <input
                className="login-input"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-password-button"
                onClick={handleShowPassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button className="login-button" type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default ProjectLogin;
