import React, { useState } from 'react';
import './index.css';

const RegisterEmployees = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'FrontOffice',
    });
    const [showPassword, setShowPassword] = useState(false);
    const api = process.env.REACT_APP_API;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        const token = localStorage.getItem("jwt_token");
        e.preventDefault();
        try {
            const response = await fetch(`${api}/register-employee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Registration successful!');
                setFormData({
                    username: '',
                    password: '',
                    role: 'FrontOffice',
                });
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className='register-form-body'>
            <div className="register-form-container">
                <form className="register-form" onSubmit={handleSubmit}>
                    <h2 className="register-form-title">Register</h2>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
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
                    <div className="form-group">
                        <label htmlFor="role">Role:</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="form-input"
                            required
                        >
                            <option value="FrontOffice">Front Office</option>
                            <option value="Councillor">Councillor</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterEmployees;
