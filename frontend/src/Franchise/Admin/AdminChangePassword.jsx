import React, { useState } from 'react';
import '../CSS/AdminAddUser.css';
import axios from 'axios';
import { changePasswordRoute } from '../APIRoutes';

function AdminChangePassword() {
    const [form, setForm] = useState({
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
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

        if (name === 'newPassword') {
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
        const { username, currentPassword, newPassword, confirmNewPassword } = form;

        if (!username || !currentPassword || !newPassword || !confirmNewPassword) {
            alert('All fields are required.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match.');
            return;
        }

        if (!isPasswordValid()) {
            alert('Password does not meet all the required criteria.');
            return;
        }

        try {
            const res = await axios.post(changePasswordRoute, {
                username,
                newPassword,
                currentPassword
            });

            alert(res.data.message);
        } catch (err) {
            alert('An error occurred. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="admin-add-user-container">
            <div className="admin-form-wrapper">
                <h2 className="admin-title">Change Password</h2>
                <form className="admin-form" onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input className="admin-input" type="text" name="username" value={form.username} onChange={handleChange} />
                    </label>
                    <label>
                        Current Password:
                        <input className="admin-input" type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} />
                    </label>
                    <label>
                        New Password:
                        <input className="admin-input" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} />
                    </label>

                    {form.newPassword && (
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
                        Confirm New Password:
                        <input className="admin-input" type="password" name="confirmNewPassword" value={form.confirmNewPassword} onChange={handleChange} />
                    </label>
                    <button type="submit" className="admin-submit-btn">Change Password</button>
                </form>
            </div>
        </div>
    );
}

export default AdminChangePassword;
