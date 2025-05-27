import React, { useState, useEffect } from 'react';
import './index.css';

const WalkinInfo = () => {
  const [walkins, setWalkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchWalkins = async () => {
      try {
        const response = await fetch(`${api}/walkins`);
        if (response.ok) {
          const data = await response.json();
          setWalkins(data);
        } else {
          setError('Failed to fetch walkin data');
        }
      } catch (error) {
        setError('An error occurred while fetching walkin data');
      } finally {
        setLoading(false);
      }
    };

    fetchWalkins();
  }, []);

  if (loading) {
    return <p className="walkin-info-loading">Loading...</p>;
  }

  if (error) {
    return <p className="walkin-info-error">{error}</p>;
  }

  return (
    <div className="walkin-info-container">
      <div className="walkin-info-header">
        <h1>Walkin Information</h1>
        <span className="walkin-info-count">Total Walkins: {walkins.length}</span>
      </div>
      {walkins.length === 0 ? (
        <p className="walkin-info-no-data">NO DATA</p>
      ) : (
        <table className="walkin-info-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>College Name</th>
              <th>Phone Number</th>
              <th>Councillor Name</th>
            </tr>
          </thead>
          <tbody>
            {walkins.map((walkin) => (
              <tr key={walkin._id}>
                <td>{walkin.studentName}</td>
                <td>{walkin.collegeName}</td>
                <td>{walkin.mobileNumber}</td>
                <td>{walkin.councillorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WalkinInfo;
