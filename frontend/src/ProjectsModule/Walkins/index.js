import React from 'react';
import { useForm } from 'react-hook-form';
import './index.css';

const WalkIns = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const api = process.env.REACT_APP_API;

  const onSubmit = (data) => {
    console.log(data);
    fetch(`${api}/walkins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
        alert("Registered Successfully")
        reset()
        
      })
      .catch((error) => {
        console.error('Error:', error);
        alert("Failed")
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="student-form">
      <div className="form-group">
        <label>
          Student Name <span className="required">*</span>
        </label>
        <input
          type="text"
          {...register('studentName', { required: true })}
        />
        {errors.studentName && <p className="error">Student Name is required</p>}
      </div>

      <div className="form-group">
        <label>
          College Name <span className="required">*</span>
        </label>
        <input
          type="text"
          {...register('collegeName', { required: true })}
        />
        {errors.collegeName && <p className="error">College Name is required</p>}
      </div>

      <div className="form-group">
        <label>Reference</label>
        <input type="text" {...register('reference')} />
      </div>

      <div className="form-group">
        <label>
          Councillor Name <span className="required">*</span>
        </label>
        <input
          type="text"
          {...register('councillorName', { required: true })}
        />
        {errors.councillorName && <p className="error">Councillor Name is required</p>}
      </div>

      <div className="form-group">
        <label>Project Title</label>
        <input type="text" {...register('projectTitle')} />
      </div>

      <div className="form-group">
        <label>
          Mobile Number <span className="required">*</span>
        </label>
        <input
          type="text"
          {...register('mobileNumber', {
            required: true,
            pattern: /^[0-9]{10}$/,
          })}
        />
        {errors.mobileNumber && (
          <p className="error">
            {errors.mobileNumber.type === 'required'
              ? 'Mobile Number is required'
              : 'Mobile Number must be 10 digits'}
          </p>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default WalkIns;
