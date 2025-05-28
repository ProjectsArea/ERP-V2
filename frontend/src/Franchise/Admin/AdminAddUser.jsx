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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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

        try {
            const res = await axios.post(addFranchiseUserRoute, {
                role,
                username,
                password,
                confirmPassword,
            });

            if (res.data.status === true) {
                alert(res.data.message || 'User created successfully!');
                // Optionally reset the form
                setForm({
                    role: 'USER',
                    username: '',
                    password: '',
                    confirmPassword: '',
                });
            }
            else {
                alert(res.data.message)
            }
        } catch (err) {
            alert(err);
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
