import React, { useState, useEffect } from 'react';
import './index.css';
import Papa from 'papaparse';

const EnquiryForm = () => {
  const api = process.env.REACT_APP_API;
  const [formData, setFormData] = useState({
    place: '',
    name: '',
    address: '',
    background: '',
    collegeSchool: '',
    mobile: '',
    email: '',
    dob: '',
    aadhar: '',
    coursePreferred: '',
    timePreferred: '',
    source: '',
    courseFee: '',
    counselorName: '',
    centerName: '',
    status: '',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [csvFileData, setCsvFileData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const center = localStorage.getItem('center');

  const fetchEmployees = async () => {
    const response = await fetch(`${api}/employees`);
    const data = await response.json();
    const filteredData = data.employees.filter(
      (employee) => employee.center === center && employee.role === 'Councillor'
    );
    setEmployees(filteredData);
  };

  const fetchCourses = async () => {
    const response = await fetch(`${api}/get-center-courses?center=${center}`);
    const data = await response.json();
    if(data.courses === undefined){
      setCourses([]);
      return
    }
    setCourses(data.courses);
  };

  useEffect(() => {
    fetchEmployees();
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'coursePreferred') {
      const selectedCourse = courses.find((course) => course.courseName === value);
      console.log(selectedCourse);
      if (selectedCourse) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          coursePreferred: value,
          courseFee: selectedCourse.centerFees // Use centerFees for course fee
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
          courseFee: ''
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.place) tempErrors.place = 'Place is required';
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.address) tempErrors.address = 'Address is required';
    if (!formData.background) tempErrors.background = 'Background is required';
    if (formData.background === 'student' && !formData.collegeSchool)
      tempErrors.collegeSchool = 'College/School is required';
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile))
      tempErrors.mobile = 'Valid mobile number is required';
    if (!formData.dob) tempErrors.dob = 'Date of Birth is required';
    if (!formData.coursePreferred)
      tempErrors.coursePreferred = 'Course Preferred is required';
    if (!formData.timePreferred)
      tempErrors.timePreferred = 'Time Preferred is required';
    if (!formData.source) tempErrors.source = 'Source is required';
    if (!formData.counselorName)
      tempErrors.counselorName = 'Counselor Name is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt_token');
    if (validate()) {
      try {
        // const filteredFormData = Object.fromEntries(
        //   Object.entries(formData).filter(([key, value]) => value.trim() !== '')
        // );
        formData.centerName = center;
        const response = await fetch(`${api}/enquiries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
          mode: 'cors',
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          alert('Invalid Access');
          throw new Error('Failed to submit form data');
        }
        alert('Registered Successfully');
        setFormData({
          place: '',
          name: '',
          address: '',
          background: '',
          collegeSchool: '',
          mobile: '',
          email: '',
          dob: '',
          aadhar: '',
          coursePreferred: '',
          timePreferred: '',
          source: '',
          courseFee: '',
          counselorName: '',
          remarks: ''
        });
      } catch (error) {
        console.error('Error submitting form data:', error.message);
        alert('Failed to Register');
      }
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
  
    if (file && file.type === 'text/csv') {
      const formData = new FormData();
      formData.append('file', file); // The key must match `upload.single('file')` in the backend
  
      fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('File upload failed');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Uploaded CSV Data:', data);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    } else {
      alert('Please upload a valid CSV file');
    }
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Modal render check
  useEffect(() => {
    if (isModalOpen) {
      console.log('Modal is now open');
    }
  }, [isModalOpen]);
  return (
    <>
      <button onClick={openModal} className="modal-button">Open Modal</button> {/* Button to open modal */}

{/* Modal for file upload */}
{isModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <span className="close" onClick={closeModal}>×</span>
      <h2>Upload your CSV file</h2>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={closeModal}>Close</button>
    </div>
  </div>
)}
    <form onSubmit={handleSubmit} className="enquiry-form">
      <div className="form-group">
        <label>Place:</label>
        <input
          type="text"
          name="place"
          value={formData.place}
          onChange={handleChange}
        />
        {errors.place && <span className="error">{errors.place}</span>}
      </div>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && <span className="error">{errors.address}</span>}
      </div>
      <div className="form-group">
        <label>Background:</label>
        <select
          name="background"
          value={formData.background}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="student">Student</option>
          <option value="service">Service</option>
          <option value="housewife">House Wife</option>
          <option value="professional">Professional</option>
          <option value="business">Business</option>
          <option value="others">Others</option>
        </select>
        {errors.background && <span className="error">{errors.background}</span>}
      </div>
      {formData.background === 'student' && (
        <div className="form-group">
          <label>College/School:</label>
          <input
            type="text"
            name="collegeSchool"
            value={formData.collegeSchool}
            onChange={handleChange}
          />
          {errors.collegeSchool && (
            <span className="error">{errors.collegeSchool}</span>
          )}
        </div>
      )}
      <div className="form-group">
        <label>Mobile:</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />
        {errors.mobile && <span className="error">{errors.mobile}</span>}
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
        {errors.dob && <span className="error">{errors.dob}</span>}
      </div>
      <div className="form-group">
        <label>Aadhar Card No:</label>
        <input
          type="text"
          name="aadhar"
          value={formData.aadhar}
          onChange={handleChange}
        />
        {errors.aadhar && <span className="error">{errors.aadhar}</span>}
      </div>
      <div className="form-group">
        <label>Course Preferred:</label>
        <select
          name="coursePreferred"
          value={formData.coursePreferred}
          onChange={handleChange}
        >
          <option value="" key = " ">Select</option>
          {courses.map((course) => (
            <option key={course.courseName} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>
        {errors.coursePreferred && (
          <span className="error">{errors.coursePreferred}</span>
        )}
      </div>
      <div className="form-group">
        <label>Time Preferred:</label>
        <select
          name="timePreferred"
          value={formData.timePreferred}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
        {errors.timePreferred && (
          <span className="error">{errors.timePreferred}</span>
        )}
      </div>
      <div className="form-group">
        <label>How did you come to know about DATAPRO:</label>
        <select name="source" value={formData.source} onChange={handleChange}>
          <option value="">Select</option>
          <option value="friends">Friends</option>
          <option value="relatives">Relatives</option>
          <option value="datapro-students">Datapro Students</option>
          <option value="newspaper">News Paper</option>
          <option value="direct-walk-in">Direct Walk-in</option>
          <option value="telecalling">Telecalling</option>
          <option value="others">Others</option>
        </select>
        {errors.source && <span className="error">{errors.source}</span>}
      </div>
      <div className="form-group">
        <label>Course Fee:</label>
        <input
          type="text"
          name="courseFee"
          value={formData.courseFee}
          onChange={handleChange}
          readOnly
        />
        {errors.courseFee && <span className="error">{errors.courseFee}</span>}
      </div>
      <div className="form-group">
        <label>Counselor Name:</label>
        <select
          name="counselorName"
          value={formData.counselorName}
          onChange={handleChange}
        >
          <option value="">Select</option>
          {employees.map((employee) => (
            <option key={employee.username} value={employee.username}>
              {employee.username}
            </option>
          ))}
        </select>
        {errors.counselorName && (
          <span className="error">{errors.counselorName}</span>
        )}
      </div>
      {/* <div className="form-group">
        <label>Status:</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="">Select</option>
          <option value="joined">Joined</option>
          <option value="notJoined">Not Joined</option>
        </select>
      </div> */}
      <div className="form-group">
        <label>Remarks:</label>
        <textarea
          type="text"
          name="remarks"
          cols={70}
          rows={10}
          value={formData.remarks}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
    </>
  );
};

export default EnquiryForm;
