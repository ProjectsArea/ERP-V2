import React, { useEffect, useState } from 'react';
import '../CSS/AdminViewActors.css'; // Create styling as needed
import axios from 'axios';
import { viewAllUsers } from '../APIRoutes';

function AdminViewActors() {
    const [actors, setActors] = useState([]);

    useEffect(() => {
        // Replace with your actual API call
        axios.get(viewAllUsers)
            .then(res => setActors(res.data.users || []))
            .catch(error => {
                console.error('Error fetching actors:', error);
                alert('Failed to fetch actors.');
            });
    }, []);

    const handleDelete = async (actorId) => {
        if (!window.confirm('Are you sure you want to delete this actor?')) return;

        try {
            const res = await axios.delete(`${viewAllUsers}/${actorId}`);
            if (res.data.status === true) {
                setActors(prev => prev.filter(actor => actor._id !== actorId));
            }
            else{
                alert(res.data.message)
            }
        } catch (error) {
            console.error('Error deleting actor:', error);
            alert('Failed to delete actor.');
        }
    };

    return (
        <div className="admin-view-actors-container">
            <h2>Actors List</h2>
            <table className="actors-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Actor Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {actors.length > 0 ? actors.map((actor, index) => (
                        <tr key={actor._id}>
                            <td>{index + 1}</td>
                            <td>{actor.username}</td>
                            <td>
                                <button className="delete-btn" onClick={() => handleDelete(actor._id)}>Delete</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="3">No actors found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminViewActors;
