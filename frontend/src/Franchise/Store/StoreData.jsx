import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getStoreDataRoute, updateStoreDataRoute } from '../APIRoutes';
import '../CSS/StoreData.css';

function StoreData() {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('Jan');
    const [editingItem, setEditingItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get(getStoreDataRoute)
            .then(response => {
                if (response.data.status) {
                    setData(response.data.data);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const months = ['Jan', 'Feb', 'Mar'];

    const handleEditClick = (item) => {
        setEditingItem({ ...item }); // clone to avoid direct state mutation
        setShowModal(true);
    };

    const handleInputChange = (field, value) => {
        if (!editingItem) return;
        const updated = { ...editingItem };

        // Nested update
        if (['MonthWiseRevenueGenerated', 'MonthWiseAmountCollected', 'RoyaltyMonthWise', 'AmountReceivedMonthWise', 'CertificateRequestPerMonth'].includes(field.group)) {
            updated[field.group][selectedMonth] = Number(value);
        } else if (field.group === 'TotalAmountDue') {
            updated.TotalAmountDue = Number(value);
        }

        setEditingItem(updated);
    };

    const handleSave = () => {
        axios.put(updateStoreDataRoute, {
            id: editingItem._id,
            updates: {
                MonthWiseRevenueGenerated: { [selectedMonth]: editingItem.MonthWiseRevenueGenerated[selectedMonth] },
                MonthWiseAmountCollected: { [selectedMonth]: editingItem.MonthWiseAmountCollected[selectedMonth] },
                RoyaltyMonthWise: { [selectedMonth]: editingItem.RoyaltyMonthWise[selectedMonth] },
                AmountReceivedMonthWise: { [selectedMonth]: editingItem.AmountReceivedMonthWise[selectedMonth] },
                CertificateRequestPerMonth: { [selectedMonth]: editingItem.CertificateRequestPerMonth[selectedMonth] },
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
                            <td>{item.MonthWiseRevenueGenerated?.[selectedMonth]}</td>
                            <td>{item.MonthWiseAmountCollected?.[selectedMonth]}</td>
                            <td>{item.RoyaltyMonthWise?.[selectedMonth]}</td>
                            <td>{item.AmountReceivedMonthWise?.[selectedMonth]}</td>
                            <td>{item.CertificateRequestPerMonth?.[selectedMonth]}</td>
                            <td><button className="edit-button" onClick={() => handleEditClick(item)}>Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && editingItem && (
                <div className="modal-overlay">
                    <div className="modal-content" id='modalContent'>
                        <div className="modal-header">
                            <h3>Edit - {editingItem.CenterName} ({selectedMonth})</h3>
                        </div>
                        <div className="input-group">
                            <label>Revenue: </label>
                            <input
                                type="number"
                                value={editingItem.MonthWiseRevenueGenerated[selectedMonth]}
                                onChange={(e) => handleInputChange({ group: 'MonthWiseRevenueGenerated' }, e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Amount Collected: </label>
                            <input
                                type="number"
                                value={editingItem.MonthWiseAmountCollected[selectedMonth]}
                                onChange={(e) => handleInputChange({ group: 'MonthWiseAmountCollected' }, e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Royalty: </label>
                            <input
                                type="number"
                                value={editingItem.RoyaltyMonthWise[selectedMonth]}
                                onChange={(e) => handleInputChange({ group: 'RoyaltyMonthWise' }, e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Amount Received: </label>
                            <input
                                type="number"
                                value={editingItem.AmountReceivedMonthWise[selectedMonth]}
                                onChange={(e) => handleInputChange({ group: 'AmountReceivedMonthWise' }, e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Certificates: </label>
                            <input
                                type="number"
                                value={editingItem.CertificateRequestPerMonth[selectedMonth]}
                                onChange={(e) => handleInputChange({ group: 'CertificateRequestPerMonth' }, e.target.value)}
                            />
                        </div>
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
