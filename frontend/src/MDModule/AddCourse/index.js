import React from 'react';
import { useForm } from 'react-hook-form';
import './index.css';

const AddCourse = () => {
  const api = process.env.REACT_APP_API;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('courseName', data.courseName);
    formData.append('courseFees', data.courseFees);
    formData.append('courseDuration', data.courseDuration);
    formData.append('courseImage', data.courseImage[0]);
    formData.append('category', data.category);

    try {
      const response = await fetch(`${api}/add-course`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        alert("Failed To Add");
        throw new Error('Network response was not ok');
      }
      alert("Course Added");
      reset();
    } catch (error) {
      console.error('Error submitting course:', error);
    }
  };

  return (
    <div className="add-course-container">
      <form onSubmit={handleSubmit(onSubmit)} className="add-course-form">
        <div className="add-course-field">
          <label htmlFor="courseName" className="add-course-label">Course Name:</label>
          <input
            id="courseName"
            type="text"
            {...register('courseName', { required: true })}
            className={`add-course-input ${errors.courseName ? 'add-course-error' : ''}`}
          />
          {errors.courseName && <span className="add-course-error-message">Course Name is required</span>}
        </div>

        <div className="add-course-field">
          <label htmlFor="courseFees" className="add-course-label">Course Fees:</label>
          <input
            id="courseFees"
            type="number"
            {...register('courseFees', { required: true, valueAsNumber: true })}
            className={`add-course-input ${errors.courseFees ? 'add-course-error' : ''}`}
          />
          {errors.courseFees && <span className="add-course-error-message">Course Fees are required</span>}
        </div>

        <div className="add-course-field">
          <label htmlFor="courseDuration" className="add-course-label">Course Duration:</label>
          <input
            id="courseDuration"
            type="text"
            {...register('courseDuration', { required: true })}
            className={`add-course-input ${errors.courseDuration ? 'add-course-error' : ''}`}
          />
          {errors.courseDuration && <span className="add-course-error-message">Course Duration is required</span>}
        </div>

        <div className="add-course-field">
          <label htmlFor="courseImage" className="add-course-label">Course Image:</label>
          <input
            id="courseImage"
            type="file"
            {...register('courseImage', { required: true })}
            className={`add-course-input ${errors.courseImage ? 'add-course-error' : ''}`}
          />
          {errors.courseImage && <span className="add-course-error-message">Course Image is required</span>}
        </div>

        <div className="add-course-field">
          <label htmlFor="category" className="add-course-label">Category:</label>
          <select
            id="category"
            {...register('category', { required: true })}
            className={`add-course-input ${errors.category ? 'add-course-error' : ''}`}
          >
            <option value="">Select Category</option>
            <option value="Programming Language">Programming Language</option>
            <option value="Web Technologies">Web Technologies</option>
            <option value="Cloud & DevOps">Cloud & DevOps</option>
            <option value="Tools">Tools</option>
          </select>
          {errors.category && <span className="add-course-error-message">Category is required</span>}
        </div>

        <button type="submit" className="add-course-button">Add Course</button>
      </form>
    </div>
  );
};

export default AddCourse;
