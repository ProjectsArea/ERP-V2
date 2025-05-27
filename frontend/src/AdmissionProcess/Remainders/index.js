import React, { useEffect, useState } from 'react';
import './index.css';

const Remainders = () => {
  const [remainders, setRemainders] = useState([]);
  const [filteredRemainders, setFilteredRemainders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const api = process.env.REACT_APP_API;

  const handleFollowUpClick = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowPopup(true);
  };

  const handleSaveFollowUp = () => {
    const followUpData = {
      enquiryId: selectedEnquiry._id,
      studentName: selectedEnquiry.studentName,
      studentContact: selectedEnquiry.studentContact,
      courseInquired: selectedEnquiry.courseInquired,
      notes: followUpNotes,
      nextFollowUpDate: nextFollowUpDate,
    };

    fetch(`${api}/add-follow-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(followUpData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        alert('Follow-up added successfully');
        setShowPopup(false);
        setFollowUpNotes('');
        setNextFollowUpDate('');
        fetchRemainders();
      })
      .catch((error) => {
        console.error('Error adding follow-up:', error);
      });
  };

  const fetchRemainders = async () => {
    try {
      const response = await fetch(`${api}/all-remainders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const today = new Date().toISOString().split('T')[0];
      const filteredData = data.data.filter((item) => item.latestRemark && new Date(item.latestRemark.nextFollowUpDate).toISOString().split('T')[0] === today);
      setRemainders(filteredData);
      //const filteredData = data.data.filter((item) => new Date(item.latestRemark.nextFollowUpDate) === new Date())
      setFilteredRemainders(filteredData);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemainders();
  }, []);

  const handleFilter = () => {
    if (fromDate && toDate) {
      const filtered = remainders.filter((reminder) => {
        const nextFollowUpDate = new Date(reminder.latestRemark.nextFollowUpDate);
        const from = new Date(fromDate);
        const to = new Date(toDate);
        return nextFollowUpDate >= from && nextFollowUpDate <= to;
      });
      setFilteredRemainders(filtered);
      console.log(filtered);
    } else {
      setFilteredRemainders(remainders);
    }
  };

  if (loading) {
    return <p className="enquiry-followup-loading">Loading...</p>;
  }

  if (error) {
    return <p className="enquiry-followup-error">Error: {error.message}</p>;
  }

  return (
    <>
     <div className="filter-container">
        <label className="filter-label">From:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="filter-date"
        />
        <label className="filter-label">To:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="filter-date"
        />
        <button onClick={handleFilter} className="filter-button">Filter</button>
      </div>
      <div className="enquiry-followup-container">
      <table className="enquiry-followup-table">
        <thead>
          <tr>
            <th className="enquiry-followup-th">Student Name</th>
            <th className="enquiry-followup-th">Course Name</th>
            <th className="enquiry-followup-th">Phone Number</th>
            <th className="enquiry-followup-th">Last Remark</th>
            <th className="enquiry-followup-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRemainders.map((reminder, index) => (
            <tr key={index} className="enquiry-followup-tr">
              <td className="enquiry-followup-td">{reminder.studentName}</td>
              <td className="enquiry-followup-td">{reminder.courseInquired}</td>
              <td className="enquiry-followup-td">{reminder.studentContact}</td>
              <td className="enquiry-followup-td">
                {reminder.lastRemark ? (
                  <div>
                    <p className="enquiry-followup-remark-notes">{reminder.lastRemark.notes}</p>
                  </div>
                ) : (
                  <p>No remarks</p>
                )}
              </td>
              <td className="enquiry-followup-td">
                <button onClick={() => handleFollowUpClick(reminder)}>Follow Up</button>
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
    </>
   
  );
};

export default Remainders;
