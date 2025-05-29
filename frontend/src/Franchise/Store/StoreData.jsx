import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getStoreDataRoute, updateStoreDataRoute } from '../APIRoutes';
import '../CSS/StoreData.css';

function StoreData() {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('Jan');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [availableYears, setAvailableYears] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    useEffect(() => {
        axios.get(getStoreDataRoute)
            .then(response => {
                if (response.data.status) {
                    const allData = response.data.data;
                    setData(allData);

                    // Extract years from any of the month-mapped fields
                    const yearsSet = new Set();
                    allData.forEach(entry => {
                        Object.keys(entry.MonthWiseRevenueGenerated || {}).forEach(key => {
                            const parts = key.split('-'); // "Jan-2023"
                            if (parts.length === 2) yearsSet.add(parts[1]);
                        });
                    });
                    setAvailableYears(Array.from(yearsSet).sort());
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const selectedKey = `${selectedMonth}-${selectedYear}`;

    const handleEditClick = (item) => {
        setEditingItem({ ...item });
        setShowModal(true);
    };

    const handleInputChange = (field, value) => {
        if (!editingItem) return;
        const updated = { ...editingItem };

        if (field.group === 'TotalAmountDue') {
            updated.TotalAmountDue = Number(value);
        } else {
            if (!updated[field.group]) updated[field.group] = {};
            updated[field.group][selectedKey] = Number(value);
        }

        setEditingItem(updated);
    };

    const handleSave = () => {
        axios.put(updateStoreDataRoute, {
            id: editingItem._id,
            updates: {
                MonthWiseRevenueGenerated: { [selectedKey]: editingItem.MonthWiseRevenueGenerated[selectedKey] },
                MonthWiseAmountCollected: { [selectedKey]: editingItem.MonthWiseAmountCollected[selectedKey] },
                RoyaltyMonthWise: { [selectedKey]: editingItem.RoyaltyMonthWise[selectedKey] },
                AmountReceivedMonthWise: { [selectedKey]: editingItem.AmountReceivedMonthWise[selectedKey] },
                CertificateRequestPerMonth: { [selectedKey]: editingItem.CertificateRequestPerMonth[selectedKey] },
                TotalAmountDue: editingItem.TotalAmountDue
            }
        })
            .then(response => {
                if (response.data.status) {
                    alert("Data updated successfully");
                    setData(prevData => prevData.map(item => item._id === editingItem._id ? editingItem : item));
                }
            })
            .catch(error => {
                console.error("Error updating data:", error);
                alert("Error updating data");
            });

        setShowModal(false);
    };

    return (
        <div className="store-data-container">
            <div className="filter-section">
                <label>Filter by Month: </label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>

                <label style={{ marginLeft: '20px' }}>Year: </label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Center Name</th>
                        <th>Branch Head</th>
                        <th>Contact Number</th>
                        <th>Total Amount Due</th>
                        <th>Revenue</th>
                        <th>Amount Collected</th>
                        <th>Royalty</th>
                        <th>Amount Received</th>
                        <th>Certificates</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.CenterName}</td>
                            <td>{item.BranchHeadName}</td>
                            <td>{item.ContactNumber}</td>
                            <td>{item.TotalAmountDue}</td>
                            <td>{item.MonthWiseRevenueGenerated?.[selectedKey] || 0}</td>
                            <td>{item.MonthWiseAmountCollected?.[selectedKey] || 0}</td>
                            <td>{item.RoyaltyMonthWise?.[selectedKey] || 0}</td>
                            <td>{item.AmountReceivedMonthWise?.[selectedKey] || 0}</td>
                            <td>{item.CertificateRequestPerMonth?.[selectedKey] || 0}</td>
                            <td><button className="edit-button" onClick={() => handleEditClick(item)}>Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && editingItem && (
                <div className="modal-overlay">
                    <div className="modal-content" id='modalContent'>
                        <div className="modal-header">
                            <h3>Edit - {editingItem.CenterName} ({selectedKey})</h3>
                        </div>
                        {['MonthWiseRevenueGenerated', 'MonthWiseAmountCollected', 'RoyaltyMonthWise', 'AmountReceivedMonthWise', 'CertificateRequestPerMonth'].map(group => (
                            <div className="input-group" key={group}>
                                <label>{group.replace('MonthWise', '').replace('CertificateRequestPerMonth', 'Certificates')}: </label>
                                <input
                                    type="number"
                                    value={editingItem[group]?.[selectedKey] || 0}
                                    onChange={(e) => handleInputChange({ group }, e.target.value)}
                                />
                            </div>
                        ))}
                        <div className="input-group">
                            <label>Total Amount Due: </label>
                            <input
                                type="number"
                                value={editingItem.TotalAmountDue}
                                onChange={(e) => handleInputChange({ group: 'TotalAmountDue' }, e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="save-button" onClick={handleSave}>Save</button>
                            <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StoreData;
