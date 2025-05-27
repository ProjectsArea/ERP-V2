import React, { useState, useEffect } from 'react';
import './index.css';

const CenterCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = process.env.REACT_APP_API;
  const center = localStorage.getItem('center');

  const fetchCourses = () => {
    fetch(`${api}/get-center-courses?center=${center}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCourses(data.courses);
        console.log(data.courses)
        const uniqueCategories = Array.from(new Set(data.courses.map(course => course.category)));
        setCategories(uniqueCategories);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, [api, center]);

  const handleDeleteClick = (course) => {
    console.log(course);
    fetch(`${api}/delete-center-course`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ centerName:center,courseId:course.courseId }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete course');
        }
        return response.json();
      })
      .then(() => {
        alert("Deleted Successfully")
        fetchCourses();
      })
      .catch(error => {
        setError(error.message);
      });
  };

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || course.category === selectedCategory)
  );

  const handleEditClick = (course) => {
    console.log('Edit course:', course);
  };

  if (isLoading) {
    return <div className="all-center-courses-loading">Loading...</div>;
  }

  if (error) {
    return <div className="all-center-courses-error">Error: {error}</div>;
  }

  return (
    <div className="all-courses-container">
      <div className="all-courses-search-bar">
        <input 
          type="text" 
          placeholder="Search courses..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className="all-courses-input"
        />
      </div>
      <div className="all-courses-category-dropdown">
        <select 
          value={selectedCategory} 
          onChange={e => setSelectedCategory(e.target.value)} 
          className="all-courses-select"
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="all-center-courses-list">
        {filteredCourses.length === 0 ? (
          <div className="all-center-courses-no-courses">No courses found</div>
        ) : (
          filteredCourses.map(course => (
            <div key={course._id} className="courses-card">
              {/* <img src={`${api}uploads/${course.image}`} alt={course.courseName} className="all-center-courses-image" /> */}
              <div className="all-courses-details">
                <h3 className="all-courses-name">{course.courseName}</h3>
                <p className="all-center-courses-fees">Actual Fees: {course.courseFees} Rs</p>
                <p>Center Fees: {course.centerFees} Rs</p>
                <p className="all-center-courses-duration">Duration: {course.courseDuration}</p>
                <div className="all-center-courses-buttons">
                  <button 
                    className="all-courses-edit-button" 
                    onClick={() => handleEditClick(course)}
                  >
                    Edit
                  </button>
                  <button 
                    className="all-courses-delete-button" 
                    onClick={() => handleDeleteClick(course)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CenterCourses;
