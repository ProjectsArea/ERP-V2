import React, { useState } from 'react';
import '../CSS/AdminAddUser.css';
import axios from 'axios';
import { addFranchiseUserRoute } from '../APIRoutes';

function AdminAddUser() {
    const [form, setForm] = useState({
        role: 'USER',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [criteria, setCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === 'password') {
            checkPasswordCriteria(value);
        }
    };

    const checkPasswordCriteria = (password) => {
        setCriteria({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            specialChar: /[@$!%*?&]/.test(password),
        });
    };

    const isPasswordValid = () => {
        return Object.values(criteria).every(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { role, username, password, confirmPassword } = form;

        if (!username || !password || !confirmPassword) {
            alert('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (!isPasswordValid()) {
            alert('Password does not meet all the required criteria.');
            return;
        }

        try {
            const res = await axios.post(addFranchiseUserRoute, {
                role,
                username,
                password,
                confirmPassword,
            });

            if (res.data.status === true) {
                alert(res.data.message || 'User created successfully!');
                setForm({
                    role: 'USER',
                    username: '',
                    password: '',
                    confirmPassword: '',
                });
                setCriteria({
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    number: false,
                    specialChar: false,
                });
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert('Something went wrong. Try again later.');
            console.error(err);
        }
    };

    return (
        <div className="admin-add-user-container">
            <div className="admin-form-wrapper">
                <h2 className="admin-title">Create New User</h2>
                <form className="admin-form" onSubmit={handleSubmit}>
                    <label>
                        Role:
                        <select className="admin-select" name="role" value={form.role} onChange={handleChange}>
                            <option value="STORE">STORE</option>
                            <option value="ACCOUNTANT">ACCOUNTANT</option>
                            <option value="USER">USER</option>
                        </select>
                    </label>
                    <label>
                        Username:
                        <input className="admin-input" type="text" name="username" value={form.username} onChange={handleChange} />
                    </label>
                    <label>
                        Password:
                        <input className="admin-input" type="password" name="password" value={form.password} onChange={handleChange} />
                    </label>

                    {form.password && (
                        <div className="password-criteria" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            <p>Password must contain:</p>
                            <ul style={{ paddingLeft: '1.2rem' }}>
                                <li style={{ color: criteria.length ? 'green' : 'red' }}>• At least 8 characters</li>
                                <li style={{ color: criteria.uppercase ? 'green' : 'red' }}>• One uppercase letter (A-Z)</li>
                                <li style={{ color: criteria.lowercase ? 'green' : 'red' }}>• One lowercase letter (a-z)</li>
                                <li style={{ color: criteria.number ? 'green' : 'red' }}>• One number (0-9)</li>
                                <li style={{ color: criteria.specialChar ? 'green' : 'red' }}>• One special character (@$!%*?&)</li>
                            </ul>
                        </div>
                    )}

                    <label>
                        Confirm Password:
                        <input className="admin-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                    </label>
                    <button type="submit" className="admin-submit-btn">Create</button>
                </form>
            </div>
        </div>
    );
}

export default AdminAddUser;
