import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import './index.css';

if (typeof document !== 'undefined') {
  Modal.setAppElement('#root');
}

const ProjectAdmission = () => {
  const [walkins, setWalkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWalkin, setSelectedWalkin] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [guideFilter, setGuideFilter] = useState('');
  const [guides, setGuides] = useState([]);
  const api = process.env.REACT_APP_API;


  const fetchWalkins = async () => {
    try {
      const response = await fetch(`${api}/walkins`);
      if (response.ok) {
        const data = await response.json();
        setWalkins(data);
        const uniqueGuides = [...new Set([...data.map(walkin => walkin.councillorName)])];
        setGuides(uniqueGuides.filter(guide => guide)); // Filter out empty strings
      } else {
        setError('Failed to fetch walkin data');
      }
    } catch (error) {
      setError('An error occurred while fetching walkin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalkins();
  }, [api]);

  const filteredWalkins = walkins.filter(walkin => {
    return (
      (statusFilter === '' || walkin.status === statusFilter) &&
      (guideFilter === '' || walkin.councillorName === guideFilter)
    );
  });

  const openModal = (walkin) => {
    setSelectedWalkin(walkin);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWalkin(null);
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    data.walkIn = selectedWalkin._id;
    try {
      const response = await fetch(`${api}/project-admissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Enrollment saved successfully!');
        fetchWalkins()
        reset();
        closeModal();
        
      } else {
        alert('Failed to save enrollment');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving enrollment');
    }
  };

  if (loading) {
    return <p className="project-admission-loading">Loading...</p>;
  }

  if (error) {
    return <p className="project-admission-error">{error}</p>;
  }

  return (
    <div className="project-admission-container">
      <div className="project-admission-header">
        <h1>Walkin Information</h1>
        <span className="project-admission-count">Total Walkins: {filteredWalkins.length}</span>
      </div>
      <div className="filters">
        <div className="filter-item">
          <label>
            Status:

            <select
              className="project-admission-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="joined">Joined</option>
              <option value="not joined">Not Joined</option>
             
            </select>
          </label>
        </div>

        <div className="filter-item">
          <label>
            Counselor:
            <select
              className="project-admission-guide-filter"
              value={guideFilter}
              onChange={(e) => setGuideFilter(e.target.value)}
            >
              <option value="">All</option>
              {guides.map((guide, index) => (
                <option key={index} value={guide}>
                  {guide}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {filteredWalkins.length === 0 ? (
        <p className="project-admission-no-data">NO DATA</p>
      ) : (
        <table className="project-admission-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>College Name</th>
              <th>Phone Number</th>
              <th>Councillor Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredWalkins.map((walkin) => (
              <tr key={walkin._id}>
                <td>{walkin.studentName}</td>
                <td>{walkin.collegeName}</td>
                <td>{walkin.mobileNumber}</td>
                <td>{walkin.councillorName}</td>
                <td>
                {walkin.status === 'not joined' ? (
                    <button
                    className="project-admission-enroll-btn"
                    onClick={() => openModal(walkin)}
                  >
                    Enroll
                  </button>
                ):<h4>Joined</h4>}
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedWalkin && (
  <Modal
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    contentLabel="Enroll Modal"
    className="project-admission-modal"
    overlayClassName="project-admission-modal-overlay"
  >
    <h2>Enroll Student</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="enroll-form">
      {/* Form fields with validation */}
      <div className="form-group">
        <label>
          Project ID <span className="required">*</span>
        </label>
        <input
          type="text"
          {...register('projectId', { required: true })}
        />
        {errors.projectId && <p className="error">Project ID is required</p>}
      </div>
      <div className="form-group">
        <label>
          Project Name <span className="required">*</span>
        </label>
        <input
          type="text"
          {...register('projectName', { required: true })}
        />
        {errors.projectName && <p className="error">Project Name is required</p>}
      </div>
      <div className="form-group">
        <label>
          Project Category <span className="required">*</span>
        </label>
        <select {...register('projectCategory', { required: true })}>
          <option value="">Select Category</option>
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
        {errors.projectCategory && <p className="error">Project Category is required</p>}
      </div>
      <div className="form-group">
        <label>
          Student Name 1 <span className="required">*</span>
        </label>
        <input
          type="text"
          {...register('studentName1', { required: true })}
        />
        {errors.studentName1 && <p className="error">Student Name 1 is required</p>}
      </div>
      <div className="form-group">
        <label>Student Name 2</label>
        <input type="text" {...register('studentName2')} />
      </div>
      <div className="form-group">
        <label>
          Phone Number 1 <span className="required">*</span>
        </label>
        <input
          type="text"
          {...register('phoneNumber1', { required: true, pattern: /^[0-9]{10}$/ })}
        />
        {errors.phoneNumber1 && (
          <p className="error">
            {errors.phoneNumber1.type === 'required'
              ? 'Phone Number 1 is required'
              : 'Phone Number 1 must be 10 digits'}
          </p>
        )}
      </div>
      <div className="form-group">
        <label>Phone Number 2</label>
        <input
          type="text"
          {...register('phoneNumber2', { pattern: /^[0-9]{10}$/ })}
        />
        {errors.phoneNumber2 && (
          <p className="error">Phone Number 2 must be 10 digits</p>
        )}
      </div>
      <div className="form-group">
        <label>
          Total Fees <span className="required">*</span>
        </label>
        <input
          type="number"
          {...register('totalFees', { required: true })}
        />
        {errors.totalFees && <p className="error">Total Fees is required</p>}
      </div>
      <div className="form-group">
        <label>
          Fees Paid <span className="required">*</span>
        </label>
        <input
          type="number"
          {...register('feesPaid', { required: true })}
        />
        {errors.feesPaid && <p className="error">Fees Paid is required</p>}
      </div>
      <div className="form-group">
        <label>
          Guide 1 <span className="required">*</span>
        </label>
        <input
          type="text"
          {...register('guide1', { required: true })}
        />
        {errors.guide1 && <p className="error">Guide 1 is required</p>}
      </div>
      <div className="form-group">
        <label>Guide 2</label>
        <input type="text" {...register('guide2')} />
      </div>
      <div className="form-group">
        <label>
          Deadline <span className="required">*</span>
        </label>
        <input
          type="date"
          {...register('deadline', { required: true })}
        />
        {errors.deadline && <p className="error">Deadline is required</p>}
      </div>
      <div className="form-group">
        <label>
          Status <span className="required">*</span>
        </label>
        <select {...register('status', { required: true })}>
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
        {errors.status && <p className="error">Status is required</p>}
      </div>
      <div className="form-group">
        <label>
          Councillor <span className="required">*</span>
        </label>
        <input
          type="text"
          {...register('councillor', { required: true })}
        />
        {errors.councillor && <p className="error">Councillor is required</p>}
      </div>
      <div className="form-group">
        <label>Remarks</label>
        <textarea {...register('remarks')} rows={10} cols={60}></textarea>
      </div>
      <button type="submit" className="project-admission-save-button">Save</button>
    </form>
    <button onClick={closeModal} className="close-modal-btn">Close</button>
  </Modal>
)}

    </div>
  );
};

export default ProjectAdmission;
