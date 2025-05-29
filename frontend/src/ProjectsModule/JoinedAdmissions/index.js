import React, { useState, useEffect } from 'react';
import './index.css';
import { Chrono } from 'react-chrono';

const JoinedAdmission = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [popupData, setPopupData] = useState({
<<<<<<< HEAD
  projectId: '',
  completedPercentage: '',
  supportRequired: '',
  anyProblems: '',
  estimatedDateToComplete: '',
  dockerPullLink: '',
  dockerRunCommand: '',
  githubLink: '',
  documentationLink: '',
});
=======
    completedPercentage: '',
    supportRequired: '',
    anyProblems: '',
    estimatedDateToComplete: '',
  });
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
  const [viewDetailsPopup, setViewDetailsPopup] = useState(null);
  const [filters, setFilters] = useState({
    projectCategory: '',
    guide: '',
    fromDate: '',
    toDate: '',
    searchQuery: '',
  });
<<<<<<< HEAD

=======
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
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
<<<<<<< HEAD
=======

>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
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
<<<<<<< HEAD
      dockerPullLink: admission.dockerPullLink || '',
      dockerRunCommand: admission.dockerRunCommand || '',
      githubLink: admission.githubLink || '',
      documentationLink: admission.documentationLink || '',
=======
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
    });
  };

  const handleViewDetailsClick = async (admission) => {
    try {
      const response = await fetch(`${api}/project-status/${admission.projectId}`);
      if (response.ok) {
        const data = await response.json();
        setViewDetailsPopup(data.status);
<<<<<<< HEAD
=======
        console.log(data)
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
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
<<<<<<< HEAD
      const statusData = {
        projectId: popupData.projectId,
        completedPercentage: parseInt(popupData.completedPercentage),
        supportRequired: popupData.supportRequired,
        anyProblems: popupData.anyProblems,
        estimatedDateToComplete: popupData.estimatedDateToComplete,
        date: new Date().toISOString(),
        dockerPullLink: popupData.dockerPullLink?.replace(/^'|'$/g, '') || '',
        dockerRunCommand: popupData.dockerRunCommand?.replace(/^'|'$/g, '') || '',
        githubLink: popupData.githubLink?.replace(/^'|'$/g, '') || '',
        documentationLink: popupData.documentationLink?.replace(/^'|'$/g, '') || ''
      };

      console.log('Sending formatted data to database:', JSON.stringify(statusData, null, 2));

      const response = await fetch(`${api}/project-status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(statusData)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Project status updated successfully!');
        console.log('Database update response:', data);
        handleClosePopup();
      } else {
        const errorData = await response.json();
        setError(`Failed to update project status: ${errorData.message || 'Unknown error'}`);
        console.error('Update failed:', errorData);
      }
    } catch (error) {
      setError('An error occurred while updating project status');
      console.error('Error:', error);
=======
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
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
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

<<<<<<< HEAD
  if (loading) return <p className="project-admission-loading">Loading...</p>;
  if (error) return <p className="project-admission-error">{error}</p>;
=======
  if (loading) {
    return <p className="project-admission-loading">Loading...</p>;
  }

  if (error) {
    return <p className="project-admission-error">{error}</p>;
  }

>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d

  return (
    <div className="project-admission-container">
      <div className="project-admission-header">
        <h1>Project Admissions</h1>
        <p className="project-admission-count">Total Projects: {filteredAdmissions.length}</p>
      </div>
<<<<<<< HEAD

      {/* Filters */}
      <div className="project-admission-filters">
        <input type="text" name="searchQuery" placeholder="Search by Project Title" value={filters.searchQuery} onChange={handleFilterChange} className="filter-input" />
        <select name="projectCategory" value={filters.projectCategory} onChange={handleFilterChange} className="filter-select">
=======
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
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
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
<<<<<<< HEAD
        <select name="guide" value={filters.guide} onChange={handleFilterChange} className="filter-select">
          <option value="">All Guides</option>
          <option value="vijay">Vijay</option>
          <option value="deepak">Deepak</option>
          <option value="haribabu">Hari Babu</option>
          <option value="srikanth">Srikanth</option>
          <option value="saswith">Saswith</option>
          <option value="durgaprasad">DurgaPrasad</option>
        </select>
        <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} className="filter-input" />
        <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} className="filter-input" />
      </div>

      {/* Table */}
=======
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
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
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
<<<<<<< HEAD

      {/* Update Popup */}
=======
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
      {selectedAdmission && (
        <div className="project-admission-popup">
          <div className="project-admission-popup-content">
            <h2>Update Project Admission</h2>
<<<<<<< HEAD
            <label>Completed Percentage:
              <input type="number" name="completedPercentage" value={popupData.completedPercentage} onChange={handleChange} />
            </label>
            <label>Remarks:
              <textarea name="supportRequired" value={popupData.supportRequired} onChange={handleChange} />
            </label>
            <label>Any Problems:
              <textarea name="anyProblems" value={popupData.anyProblems} onChange={handleChange} />
            </label>
            <label>Estimated Date to Complete:
              <input type="date" name="estimatedDateToComplete" value={popupData.estimatedDateToComplete} onChange={handleChange} />
            </label>

            <div className="form-group">
              <label>Docker Pull Link:
                <input type="text" name="dockerPullLink" value={popupData.dockerPullLink} onChange={handleChange} placeholder="docker pull your-image" />
              </label>
            </div>

            <div className="form-group">
              <label>Docker Run Command:
                <input type="text" name="dockerRunCommand" value={popupData.dockerRunCommand} onChange={handleChange} placeholder="docker run your-container" />
              </label>
            </div>

            <div className="form-group">
              <label>GitHub Repository Link:
                <input type="text" name="githubLink" value={popupData.githubLink} onChange={handleChange} placeholder="https://github.com/your-repo" />
              </label>
            </div>

            <div className="form-group">
              <label>Documentation Link:
                <input type="text" name="documentationLink" value={popupData.documentationLink} onChange={handleChange} placeholder="https://your-docs.com" />
              </label>
            </div>

            <button className="project-admission-popup-close" onClick={handleClosePopup} style={{ margin: "10px" }}>Close</button>
=======
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
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
<<<<<<< HEAD

      {/* View Details Popup */}
      {viewDetailsPopup && (
        <div className="chrono-popup">
          <div className="chrono-popup-content">
            <Chrono items={viewDetailsPopup} mode="VERTICAL" theme={{ primary: 'blue', secondary: 'yellow' }}>
              {viewDetailsPopup.map((status, index) => (
                <div key={index}>
                  <p><strong>Completed Percentage:</strong> {status.completedPercentage}</p>
                  <p><strong>Remarks:</strong> {status.supportRequired}</p>
                  <p><strong>Problems:</strong> {status.anyProblems}</p>
                   <p><strong>dockerPullLink:</strong> {status.dockerPullLink}</p>
                    <p><strong>dockerRunCommand:</strong> {status.dockerRunCommand}</p>
                     <p><strong>githubLink:</strong> {status.githubLink}</p>
                      <p><strong>documentationLin:</strong> {status.documentationLink}</p>
                </div>
              ))}
=======
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
>>>>>>> 9d671ee4ee53baa0347d466e712331f353ed920d
            </Chrono>
            <button className="chrono-popup-close" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinedAdmission;
