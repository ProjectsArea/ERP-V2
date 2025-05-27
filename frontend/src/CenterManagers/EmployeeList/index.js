import React, { useEffect, useState } from 'react';
import './index.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const api = process.env.REACT_APP_API;
    const center = localStorage.getItem("center");

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${api}/employees`);
            const data = await response.json();
            console.log(data)
            const filteredData = data.employees.filter(emp => emp.center === center)
            setEmployees(filteredData);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {

        fetchEmployees();
    }, [api]);

    const handleDelete = async (id) => {
        const token = localStorage.getItem("jwt_token");
        try {
            const response = await fetch(`${api}/delete-employees/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                },
            });

            if (response.ok) {
                alert('Employee deleted successfully');
                fetchEmployees();
            } else {
                alert('Failed to delete employee');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return (
        <div className="employee-table-container">
            <h2 className="employee-table-title">Employee List</h2>
            <table className="employee-table">
                <thead>
                    <tr className="employee-table-header">
                        <th className="employee-table-header-cell">Name</th>
                        <th className="employee-table-header-cell">Role</th>
                        <th className="employee-table-header-cell">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee._id} className="employee-table-row">
                            <td className="employee-table-cell">{employee.username}</td>
                            <td className="employee-table-cell">{employee.role}</td>
                            <td className="employee-table-cell">
                                <button
                                    className="employee-table-delete-button"
                                    onClick={() => handleDelete(employee._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;
