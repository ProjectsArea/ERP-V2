import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './index.css';

const EmployeeLoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const { id } = useParams();
    console.log(id)
    const navigate = useNavigate();
    const api = process.env.REACT_APP_API;

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            if (id === 'FrontOffice') {
                navigate('/navbar/enquiry-form', { replace: true });
            } else if (id === 'Councillor') {
                navigate('/admission-process/form', { replace: true });
            }else if(id === 'Admin'){
                console.log("hello")
                navigate('/admin/pay-fees',{replace:true})
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const center = localStorage.getItem('center');
        formData['center'] = center;
        formData['role'] = id;

        try {
            const response = await fetch(`${api}/login-employee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Login SuccessFull")
                localStorage.setItem('jwt_token', data.token);
                if (id === 'FrontOffice') {
                    navigate('/navbar/enquiry-form', { replace: true });
                } else if (id === 'Councillor') {
                    navigate('/admission-process/form', { replace: true });
                }else if (id === 'Admin') {
                    navigate('/admin/pay-fees', { replace: true });
                }
            } else {
                alert("Login Failed")
                const error = await response.json();
                console.error('Error logging in:', error);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="employee-login-form-container">
            <form className="employee-login-form" onSubmit={handleSubmit}>
                <h2 className="employee-login-form-title">Employee Login</h2>
                <div className="employee-form-group">
                    <label htmlFor="username" className="employee-form-label">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="employee-form-input"
                        required
                    />
                </div>
                <div className="employee-form-group">
                    <label htmlFor="password" className="employee-form-label">
                        Password:
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="employee-form-input"
                        required
                    />
                    <button type="button" onClick={toggleShowPassword} className="employee-show-password-button">
                        {showPassword ? 'Hide' : 'Show'} Password
                    </button>
                </div>
                <button type="submit" className="employee-submit-button">
                    Login
                </button>
            </form>
        </div>
    );
};

export default EmployeeLoginForm;
