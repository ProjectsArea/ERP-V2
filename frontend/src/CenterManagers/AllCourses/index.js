import React, { useState, useEffect } from 'react';
import './index.css';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = process.env.REACT_APP_API;

  useEffect(() => {
    fetch(`${api}/get-courses`)
      .then(response => response.json())
      .then(data => {
        setCourses(data);
        console.log(data)
        const uniqueCategories = Array.from(new Set(data.map(course => course.category)));
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses.');
        setLoading(false);
      });
  }, [api]);

  const filteredCourses = courses.filter(course => 
    // course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || course.category === selectedCategory)
  );


  const handleAddClick = (course) => {
    setSelectedCourse(course);
    setIsPopupOpen(true);
  };

  const handleAddCenterPrice = async () => {
    if (selectedCourse && newPrice) {
      try {
        const response = await fetch(`${api}/add-center-course`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            courseId: selectedCourse._id,
            centerName: localStorage.getItem('center'),
            centerFees: newPrice
          })
        });

        if (response.ok) {
          alert('Course added successfully');
          setIsPopupOpen(false);
          setNewPrice('');
        } else {
          alert('Failed to add course');
        }
      } catch (error) {
        console.error('Error adding course:', error);
      }
    } else {
      alert('Please enter a valid price');
    }
  };

  if (loading) {
    return <div className="all-courses-loading">Loading...</div>;
  }

  if (error) {
    return <div className="all-courses-error">{error}</div>;
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
      <div className="all-courses-list">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div key={course._id} className="all-courses-card">
              {/* <img src={`${api}/uploads/${course.image}`} alt={course.courseName} className="all-courses-image" /> */}
              <div className="all-courses-details">
                <h3 className="all-courses-name">{course.courseName}</h3>
                <p className="all-courses-fees">Fees: {course.courseFees} Rs</p>
                <p className="all-courses-duration">Duration: {course.courseDuration}</p>
                <button 
                  className="all-courses-add-button" 
                  onClick={() => handleAddClick(course)}
                >
                  Add Course
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="all-courses-no-data">No courses found.</div>
        )}
      </div>
      {isPopupOpen && (
        <div className="all-courses-popup-overlay">
          <div className="all-courses-popup">
            <h3 className="all-courses-popup-title">{selectedCourse.courseName}</h3>
            <p className="all-courses-popup-price">Price: {selectedCourse.courseFees} Rs</p>
            <div className="all-courses-popup-input">
              <label htmlFor="centerPrice" className="all-courses-popup-label">Enter Center Price:</label>
              <input 
                id="centerPrice"
                type="number"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                className="all-courses-popup-field"
              />
            </div>
            <button className="all-courses-popup-add-button" onClick={handleAddCenterPrice}>Add</button>
            <button className="all-courses-popup-close-button" onClick={() => setIsPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCourses;