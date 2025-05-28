import React, { useState } from 'react';
import '../CSS/AdminAddUser.css'; // Reusing your existing CSS
import axios from 'axios';
import { changePasswordRoute } from '../APIRoutes';

function AdminChangePassword() {
    const [form, setForm] = useState({
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
        const res = await axios.post(changePasswordRoute, {
            username,
            newPassword,
            currentPassword
        });
        if (res.data.status === false) {
            console.log(res.data.message);
            alert(res.data.message);
        }
        else {
            alert(res.data.message)
        }
    };

    return (
        <div className="admin-add-user-container">
            <div className="admin-form-wrapper">
                <h2 className="admin-title">Change Password</h2>
                <form className="admin-form" onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input
                            className="admin-input"
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Current Password:
                        <input
                            className="admin-input"
                            type="password"
                            name="currentPassword"
                            value={form.currentPassword}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        New Password:
                        <input
                            className="admin-input"
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Confirm New Password:
                        <input
                            className="admin-input"
                            type="password"
                            name="confirmNewPassword"
                            value={form.confirmNewPassword}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit" className="admin-submit-btn">Change Password</button>
                </form>
            </div>
        </div>
    );
}

export default AdminChangePassword;
