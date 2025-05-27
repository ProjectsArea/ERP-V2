import React, { useEffect, useState } from 'react';
import './index.css';
import { useParams } from 'react-router-dom';
import EnquirySlider from '../EnquirySlider';

const EnquiryTable = () => {
    const { id } = useParams();
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [filter, setFilter] = useState('today');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const api = process.env.REACT_APP_API;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}/enquiries`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                const filteredData = data.filter(item => item.centerName === id);
                setEnquiries(filteredData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, api]);

    useEffect(() => {
        const filterData = () => {
            const now = new Date();
            let filteredData;
            if (filter === 'today') {
                filteredData = enquiries.filter(enquiry => {
                    const enquiryDate = new Date(enquiry.date);
                    return (
                        enquiryDate.getDate() === now.getDate() &&
                        enquiryDate.getMonth() === now.getMonth() &&
                        enquiryDate.getFullYear() === now.getFullYear()
                    );
                });
            } else if (filter === 'yesterday') {
                const yesterday = new Date(now);
                yesterday.setDate(now.getDate() - 1);
                filteredData = enquiries.filter(enquiry => {
                    const enquiryDate = new Date(enquiry.date);
                    return (
                        enquiryDate.getDate() === yesterday.getDate() &&
                        enquiryDate.getMonth() === yesterday.getMonth() &&
                        enquiryDate.getFullYear() === yesterday.getFullYear()
                    );
                });
            } else if (filter === 'lastMonth') {
                const lastMonth = new Date(now);
                lastMonth.setMonth(now.getMonth() - 1);
                filteredData = enquiries.filter(enquiry => {
                    const enquiryDate = new Date(enquiry.date);
                    return (
                        enquiryDate.getMonth() >= lastMonth.getMonth() &&
                        enquiryDate.getFullYear() === lastMonth.getFullYear()
                    );
                });
            }
            setFilteredEnquiries(filteredData);
        };

        filterData();
    }, [filter, enquiries]);

    const handleDateRangeFilter = () => {
        console.log(enquiries)
        const from = new Date(fromDate);
        const to = new Date(toDate);
        const filteredData = enquiries.filter(enquiry => {
            const enquiryDate = new Date(enquiry.date);
            return enquiryDate >= from && enquiryDate <= to;
        });
        setFilteredEnquiries(filteredData);
      
    };

    return (
        <div className="table-container">
            <div className='head-container'>
                <h1 className='center-name' style={{ fontSize: "46px" }}>{id}</h1>
                <h1 className="total-count">Total: {filteredEnquiries.length}</h1>
            </div>
            <EnquirySlider enquiries={filteredEnquiries} />
            <div className='table-filter-container'>
                <table className="enquiry-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Counselor Name</th>
                            <th>Course Name</th>
                            <th>Course Fee</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEnquiries.map((enquiry, index) => (
                            <tr key={index} className="table-row">
                                <td>{enquiry.name}</td>
                                <td>{enquiry.counselorName}</td>
                                <td>{enquiry.coursePreferred}</td>
                                <td>{enquiry.courseFee}</td>
                                <td>{new Date(enquiry.date).toLocaleDateString()}</td>
                                <td>{new Date(enquiry.date).toLocaleTimeString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="filter-container">
                    <select 
                        className="date-filter" 
                        value={filter} 
                        onChange={e => setFilter(e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="lastMonth">Last Month</option>
                    </select>
                    <div className="date-range-filter">
                        <label>
                            From:
                            <input 
                                type="date" 
                                value={fromDate} 
                                onChange={e => setFromDate(e.target.value)} 
                            />
                        </label>
                        <label>
                            To:
                            <input 
                                type="date" 
                                value={toDate} 
                                onChange={e => setToDate(e.target.value)} 
                            />
                        </label>
                        <button onClick={handleDateRangeFilter}>Get</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnquiryTable;
