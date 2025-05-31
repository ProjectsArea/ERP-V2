import React, { useState } from 'react';
import axios from 'axios';
import { addStoreDataRoute } from '../APIRoutes';
import "../CSS/StoreAddData.css"

function StoreAddData() {
    const [formData, setFormData] = useState({
        CenterName: '',
        BranchHeadName: '',
        ContactNumber: '',
        FranchiseName: '',
        MonthlyData: {}, // to be populated dynamically based on selectedMonth/year
        TotalAmountDue: 0,
    });

    const [selectedMonth, setSelectedMonth] = useState('Jan');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const years = Array.from({ length: 10 }, (_, i) => 2023 + i); // 2023 to 2032

    const handleTextInput = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleMonthFieldChange = (field, value) => {
        const key = `${selectedMonth}-${selectedYear}`;
        setFormData(prev => {
            const existing = prev.MonthlyData[key] || {
                Revenue: 0,
                Collected: 0,
                Royalty: 0,
                Received: 0,
                Certificates: 0,
            };
            return {
                ...prev,
                MonthlyData: {
                    ...prev.MonthlyData,
                    [key]: {
                        ...existing,
                        [field]: Number(value)
                    }
                }
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(addStoreDataRoute, formData)
            .then(res => {
                if (res.data.status) {
                    alert("Store added successfully");
                    setFormData({
                        CenterName: '',
                        BranchHeadName: '',
                        ContactNumber: '',
                        FranchiseName: '',
                        MonthlyData: {},
                        TotalAmountDue: 0
                    });
                } else {
                    alert("Failed to add store");
                }
            })
            .catch(err => {
                console.error("Error submitting form:", err);
                alert("Server error while adding data");
            });
    };

    const currentMonthData = formData.MonthlyData[`${selectedMonth}-${selectedYear}`] || {};

    return (
        <div className="store-add-container">
            <form onSubmit={handleSubmit} className="store-form">
                <input type="text" placeholder="Center Name" value={formData.CenterName}
                    onChange={e => handleTextInput('CenterName', e.target.value)} required />

                <input type="text" placeholder="Branch Head Name" value={formData.BranchHeadName}
                    onChange={e => handleTextInput('BranchHeadName', e.target.value)} required />

                <input type="text" placeholder="Contact Number" value={formData.ContactNumber}
                    onChange={e => handleTextInput('ContactNumber', e.target.value)} required />

                <input type="text" placeholder="Franchise Name" value={formData.FranchiseName}
                    onChange={e => handleTextInput('FranchiseName', e.target.value)} required />

                <div className="dropdowns">
                    <label>Month:</label>
                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>

                    <label>Year:</label>
                    <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                <div className="month-group">
                    <input type="number" placeholder="Revenue" value={currentMonthData.Revenue || ''}
                        onChange={e => handleMonthFieldChange('Revenue', e.target.value)} />
                    <input type="number" placeholder="Collected" value={currentMonthData.Collected || ''}
                        onChange={e => handleMonthFieldChange('Collected', e.target.value)} />
                    <input type="number" placeholder="Royalty" value={currentMonthData.Royalty || ''}
                        onChange={e => handleMonthFieldChange('Royalty', e.target.value)} />
                    <input type="number" placeholder="Received" value={currentMonthData.Received || ''}
                        onChange={e => handleMonthFieldChange('Received', e.target.value)} />
                    <input type="number" placeholder="Certificates" value={currentMonthData.Certificates || ''}
                        onChange={e => handleMonthFieldChange('Certificates', e.target.value)} />
                </div>

                <input type="number" placeholder="Total Amount Due"
                    value={formData.TotalAmountDue}
                    onChange={e => handleTextInput('TotalAmountDue', e.target.value)} />

                <button type="submit">Add Store</button>
            </form>
        </div>
    );
}

export default StoreAddData;
