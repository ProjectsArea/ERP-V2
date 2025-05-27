import React, { useEffect, useState } from 'react';
import './index.css';

const EnquiryStatus = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinedCount, setJoinedCount] = useState(0);
  const [notJoinedCount, setNotJoinedCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');

  const center = localStorage.getItem('center');
  const token = localStorage.getItem("jwt_token");
  const api = process.env.REACT_APP_API;

  useEffect(() => {
    fetch(`${api}/enquiry-status`,{
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        mode: 'cors',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const filteredData = data.filter(data => data.centerName === center);
        setEnquiries(filteredData);
        setFilteredEnquiries(filteredData);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    filterEnquiries();
  }, [statusFilter, dateFilter, searchTerm, startDate, endDate]);

  const filterEnquiries = () => {
    let filtered = enquiries;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(enquiry => enquiry.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      if (dateFilter === 'today') {
        filtered = filtered.filter(enquiry => new Date(enquiry.date).toDateString() === today.toDateString());
      } else if (dateFilter === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        filtered = filtered.filter(enquiry => new Date(enquiry.date).toDateString() === yesterday.toDateString());
      } else if (dateFilter === 'lastMonth') {
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filtered = filtered.filter(enquiry => new Date(enquiry.date) >= lastMonth && new Date(enquiry.date) <= today);
      }
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter(enquiry => new Date(enquiry.date) >= start && new Date(enquiry.date) <= end);
    }

    if (searchTerm) {
      filtered = filtered.filter(enquiry =>
        enquiry.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEnquiries(filtered);
    const joined = filtered.filter(enquiry => enquiry.status === 'joined').length;
    const notJoined = filtered.length - joined;
    setJoinedCount(joined);
    setNotJoinedCount(notJoined);
  };

  const handleFollowUpClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowPopup(true);
  };

  const handleSaveFollowUp = () => {
   
    const followUpData = {
      enquiryId: selectedEnquiry._id,
      studentName: selectedEnquiry.name,
      studentContact:selectedEnquiry.mobile,
      courseInquired:selectedEnquiry.coursePreferred,
      notes: followUpNotes,
      nextFollowUpDate: nextFollowUpDate
    };

    fetch(`${api}/add-follow-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(followUpData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        alert('Follow-up added successfully');
        setShowPopup(false);
        setFollowUpNotes("");
        setNextFollowUpDate("");
      })
      .catch(error => {
        console.error('Error adding follow-up:', error);
      });
  };

  if (loading) {
    return <p className="studentJoinStatus-loading">Loading...</p>;
  }

  if (error) {
    return <p className="studentJoinStatus-error">Error: {error.message}</p>;
  }

  return (
    <div className="studentJoinStatus-container">
      <div className="studentJoinStatus-filters">
        <input
          type="text"
          className="studentJoinStatus-search"
          placeholder="Search by student name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="studentJoinStatus-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="joined">Joined</option>
          <option value="notJoined">Not Joined</option>
        </select>
        <select className="studentJoinStatus-filter" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="lastMonth">Last Month</option>
        </select>
        <input className="studentJoinStatus-filter" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input className="studentJoinStatus-filter" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div className="studentJoinStatus-counts">
        <p style={{ color: 'green' }}>Joined: {joinedCount}</p>
        <p style={{ color: 'red' }}>Not Joined: {notJoinedCount}</p>
      </div>
      <table className="studentJoinStatus-table">
        <thead>
          <tr>
            <th className="studentJoinStatus-th">Student Name</th>
            <th className="studentJoinStatus-th">Course Name</th>
            <th className="studentJoinStatus-th">Phone Number</th>
            <th className='studentJoinStatus-th'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEnquiries.map((enquiry, index) => (
            <tr
              key={index}
              className={`studentJoinStatus-tr ${
                enquiry.status === 'joined' ? 'studentJoinStatus-joined' : 'studentJoinStatus-notJoined'
              }`}
            >
              <td className="studentJoinStatus-td">{enquiry.name}</td>
              <td className="studentJoinStatus-td">{enquiry.coursePreferred}</td>
              <td className="studentJoinStatus-td">{enquiry.mobile}</td>
              <td className="studentJoinStatus-td">
                {enquiry.status === "joined" ? (
                  <h6>JOINED</h6>
                ) : (
                  <button onClick={() => handleFollowUpClick(enquiry)}>Add Follow Up</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Follow Up</h2>
            <textarea
              className="popup-textarea"
              placeholder="Enter follow-up notes"
              value={followUpNotes}
              onChange={(e) => setFollowUpNotes(e.target.value)}
            />
            <h5>Next Follow Up Date</h5>
            <input
              className="popup-input"
              type="date"
              value={nextFollowUpDate}
              onChange={(e) => setNextFollowUpDate(e.target.value)}
            />
            <button className="popup-save" onClick={handleSaveFollowUp}>Save</button>
            <button className="popup-close" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryStatus;
