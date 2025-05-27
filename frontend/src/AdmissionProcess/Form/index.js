import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import './index.css';

const AdmissionForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { id } = useParams();
  const api = process.env.REACT_APP_API;
  const navigate = useNavigate();

  // Fetch existing data if id is not "form"
  useEffect(() => {
    const fetchData = async () => {
      if (id && id !== "form") {
        try {
          // Check if JWT token exists
          const token = localStorage.getItem("jwt_token");
          if (!token) {
            alert("Unauthorized: Please log in.");
            navigate('/login'); // Redirect to login if no token found
            return;
          }
  
          const response = await fetch(`${api}/admissions/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Make sure token is included with "Bearer"
            },
            mode: 'cors',
          });
  
          if (response.ok) {
            const result = await response.json();
            reset(result); // Populate the form with fetched data
          } else if (response.status === 404) {
            // Handle not found error
            alert("Admission data not found for this ID");
          } else if (response.status === 401) {
            // Handle unauthorized error
            alert("Unauthorized access, please log in again");
            navigate('/login');
          } else {
            console.error(`Error fetching form data: ${response.statusText}`);
            alert("Failed to fetch data, please try again later.");
          }
        } catch (error) {
          console.error('Network error fetching form data', error);
          alert("Network error, failed to fetch data. Please check your connection.");
        }
      }
    };
  
    fetchData();
  }, [id, api, reset, navigate]);
  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'image') {
        formData.append(key, data[key][0]); // Append the image file
      } else {
        formData.append(key, data[key]);
      }
    }
    formData.append("centerName", localStorage.getItem("center"));
    if (id && id !== "form") {
      formData.append("enrolledId", id);
    }
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${api}/admissions`, {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        mode: 'cors',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert("Admitted Successfully");
        navigate("/admission-process/search-enroll");
      } else {
        console.error('Error submitting form');
        alert("Failed To Admit");
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-heading">{id === "form" ? "New Admission" : "Edit Admission"}</h2>
      <form className="admission-form" onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group">
          <label htmlFor="IdNo">ID No*</label>
          <input type="text" id="IdNo" className="input-field" {...register('IdNo', { required: true })} />
          {errors.IdNo && <span className="error">ID No is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="name">Name*</label>
          <input type="text" id="name" className="input-field" {...register('name', { required: true })} />
          {errors.name && <span className="error">Name is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender*</label>
          <select id="gender" className="input-field" {...register('gender', { required: true })}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="error">Gender is required</span>}
        </div>

        {/* <div className="form-group">
          <label htmlFor="image">Image</label>
          <input type="file" id="image" className="input-field" {...register('image')} />
          {errors.image && <span className="error">Image is required</span>}
        </div> */}

        <div className="form-group">
          <label htmlFor="address">Address*</label>
          <input type="text" id="address" className="input-field" {...register('address', { required: true })} />
          {errors.address && <span className="error">Address is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="aadharNo">Aadhar No*</label>
          <input type="text" id="aadharNo" className="input-field" 
                 {...register('aadhar', { 
                   required: true,
                   maxLength: 12,
                   minLength: 12,
                   pattern: /^[0-9]+$/ 
                 })} />
          {errors.aadhar && <span className="error">
            {errors.aadhar.type === 'maxLength' ? 'Aadhar No must be 12 digits' : 'Aadhar No is required and should be numeric'}
          </span>}
        </div>

        <div className="form-group">
          <label htmlFor="mobileNo">Mobile No*</label>
          <input type="text" id="mobileNo" className="input-field" 
                 {...register('mobile', { 
                   required: true,
                   maxLength: 10,
                   minLength: 10,
                   pattern: /^[0-9]+$/ 
                 })} />
          {errors.mobile && <span className="error">
            {errors.mobile.type === 'maxLength' ? 'Mobile No must be 10 digits' : 'Mobile No is required and should be numeric'}
          </span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" className="input-field" {...register('email')} />
        </div>

        <div className="form-group">
          <label htmlFor="group">Group/College/Occupation/Others</label>
          <input type="text" id="group" className="input-field" {...register('group')} />
        </div>

        <h2 className="form-heading">Fees and Course Details</h2>

        <div className="form-group">
          <label htmlFor="course">Course Enrolled*</label>
          <input type="text" id="course" className="input-field" {...register('courseEnrolled', { required: true })} />
          {errors.courseEnrolled && <span className="error">Course is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="totalFees">Total Fees*</label>
          <input type="text" id="totalFees" className="input-field" {...register('totalFees', { required: true })} />
          {errors.totalFees && <span className="error">Total Fees is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration of Course*<br/>(in days)</label>
          <input type="text" id="duration" className="input-field" {...register('durationOfCourse', { required: true })} />
          {errors.durationOfCourse && <span className="error">Duration is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="feeDueDate">Fee Due Date*</label>
          <input type="date" id="feeDueDate" className="input-field" {...register('feeDueDate', { required: true })} />
          {errors.feeDueDate && <span className="error">Fee Due Date is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="trainer">Trainer*</label>
          <input type="text" id="trainer" className="input-field" {...register('trainer', { required: true })} />
          {errors.trainer && <span className="error">Trainer is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="timings">Timings*</label>
          <select id="timings" className="input-field" {...register('timings', { required: true })}>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
          {errors.timings && <span className="error">Timings are required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="remarks">Remarks</label>
          <textarea id="remarks" {...register('remarks')} rows={10} cols={70} />
        </div>

        <button type="submit" className="admission-submit-button">Submit</button>
      </form>
    </div>
  );
};

export default AdmissionForm;
