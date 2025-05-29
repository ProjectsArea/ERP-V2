import React, { useState, useEffect } from 'react';
import './index.css';
import { Chrono } from 'react-chrono';

const JoinedAdmission = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [popupData, setPopupData] = useState({
    completedPercentage: '',
    supportRequired: '',
    anyProblems: '',
    estimatedDateToComplete: '',
  });
  const [viewDetailsPopup, setViewDetailsPopup] = useState(null);
  const [filters, setFilters] = useState({
    projectCategory: '',
    guide: '',
    fromDate: '',
    toDate: '',
    searchQuery: '',
  });
  const api = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const response = await fetch(`${api}/project-admissions`);
        if (response.ok) {
          const data = await response.json();
          setAdmissions(data);
        } else {
          setError('Failed to fetch project admissions');
        }
      } catch (error) {
        setError('An error occurred while fetching project admissions');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, [api]);

  const handleUpdateClick = (admission) => {
    setSelectedAdmission(admission);
    setPopupData({
      projectId: admission.projectId,
      completedPercentage: admission.completedPercentage || '',
      supportRequired: admission.supportRequired || '',
      anyProblems: admission.anyProblems || '',
      estimatedDateToComplete: admission.estimatedDateToComplete || '',
    });
  };

  const handleViewDetailsClick = async (admission) => {
    try {
      const response = await fetch(`${api}/project-status/${admission.projectId}`);
      if (response.ok) {
        const data = await response.json();
        setViewDetailsPopup(data.status);
        console.log(data)
      } else {
        setError('Failed to fetch project status details');
      }
    } catch (error) {
      setError('An error occurred while fetching project status details');
    }
  };

  const handleClosePopup = () => {
    setSelectedAdmission(null);
    setViewDetailsPopup(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPopupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${api}/project-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(popupData),
      });

      if (response.ok) {
        const updatedAdmission = await response.json();
        setAdmissions((prevAdmissions) =>
          prevAdmissions.map((admission) =>
            admission._id === updatedAdmission._id ? updatedAdmission : admission
          )
        );
        handleClosePopup();
      } else {
        setError('Failed to update project admission');
      }
    } catch (error) {
      setError('An error occurred while updating project admission');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredAdmissions = admissions.filter((admission) => {
    const { projectCategory, guide, fromDate, toDate, searchQuery } = filters;

    return (
      (projectCategory === '' || admission.projectCategory === projectCategory) &&
      (guide === '' || admission.guide1.toLowerCase() === guide.toLowerCase() || admission.guide2.toLowerCase() === guide.toLowerCase()) &&
      (fromDate === '' || new Date(admission.deadline) >= new Date(fromDate)) &&
      (toDate === '' || new Date(admission.deadline) <= new Date(toDate)) &&
      (searchQuery === '' || admission.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  if (loading) {
    return <p className="project-admission-loading">Loading...</p>;
  }

  if (error) {
    return <p className="project-admission-error">{error}</p>;
  }


  return (
    <div className="project-admission-container">
      <div className="project-admission-header">
        <h1>Project Admissions</h1>
        <p className="project-admission-count">Total Projects: {filteredAdmissions.length}</p>
      </div>
      <div className="project-admission-filters">
        <input
          type="text"
          name="searchQuery"
          placeholder="Search by Project Title"
          value={filters.searchQuery}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <select
          name="projectCategory"
          value={filters.projectCategory}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="Blockchain">Blockchain</option>
          <option value="Web Designing">Web Designing</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Artificial Intelligence">Artificial Intelligence</option>
          <option value="Deep Learning">Deep Learning</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="Networking">Networking</option>
          <option value="Cloud Computing">Cloud Computing</option>
          <option value="IoT">IoT</option>
          <option value="Android">Android</option>
        </select>
        <select
          name="guide"
          value={filters.guide}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Guides</option>
          <option value = "vijay">Vijay</option>
          <option value="deepak">Deepak</option>
          <option value = "haribabu">Hari Babu</option>
          <option value = "srikanth">Srikanth</option>
          <option value = "saswith">Saswith</option>
          <option value = "saswith">DurgaPrasad</option>
        </select>
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>
      {filteredAdmissions.length === 0 ? (
        <p className="project-admission-no-data">NO DATA</p>
      ) : (
        <table className="project-admission-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Student Name 1</th>
              <th>Phone Number 1</th>
              <th>Total Fees</th>
              <th>Fees Paid</th>
              <th>Guide 1</th>
              <th>Guide 2</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Councillor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmissions.map((admission) => (
              <tr key={admission._id}>
                <td>{admission.projectId}</td>
                <td>{admission.projectName}</td>
                <td>{admission.studentName1}</td>
                <td>{admission.phoneNumber1}</td>
                <td>{admission.totalFees}</td>
                <td>{admission.feesPaid}</td>
                <td>{admission.guide1}</td>
                <td>{admission.guide2}</td>
                <td>{new Date(admission.deadline).toLocaleDateString()}</td>
                <td>{admission.status}</td>
                <td>{admission.councillor}</td>
                <td>
                  <button onClick={() => handleUpdateClick(admission)} style={{ marginBottom: "10px" }}>Update</button>
                  <button onClick={() => handleViewDetailsClick(admission)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedAdmission && (
        <div className="project-admission-popup">
          <div className="project-admission-popup-content">
            <h2>Update Project Admission</h2>
            <label>
              Completed Percentage:
              <input
                type="number"
                name="completedPercentage"
                value={popupData.completedPercentage}
                onChange={handleChange}
              />
            </label>
            <label>
              Remarks:
              <textarea
                name="supportRequired"
                value={popupData.supportRequired}
                onChange={handleChange}
              />
            </label>
            <label>
              Any Problems:
              <textarea
                name="anyProblems"
                value={popupData.anyProblems}
                onChange={handleChange}
              />
            </label>
            <label>
              Estimated Date to Complete:
              <input
                type="date"
                name="estimatedDateToComplete"
                value={popupData.estimatedDateToComplete}
                onChange={handleChange}
              />
            </label>
            <button className="project-admission-popup-close" onClick={handleClosePopup}  style={{margin:"10px"}}>Close</button>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
      {viewDetailsPopup && (
        <div className="chrono-popup">
          <div className="chrono-popup-content">
            <Chrono
              items={viewDetailsPopup}
              mode="VERTICAL"
              theme={{ primary: 'blue', secondary: 'yellow' }}
            >
              {viewDetailsPopup.map((status, index) => (
            <div key={index}>
              <p><strong>Completed Percentage:</strong> {status.completedPercentage}</p>
              <p><strong>Remarks:</strong> {status.supportRequired}</p>
              <p><strong>Problems:</strong> {status.anyProblems}</p>
            </div>
          ))}
            </Chrono>
            <button className="chrono-popup-close" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinedAdmission;
