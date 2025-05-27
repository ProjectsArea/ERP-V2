import React, { useState, useEffect } from 'react';
import './index.css';

const AllCenterCourses = () => {
  const [courses, setCourses] = useState([]);
  const [centerCourses, setCenterCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = process.env.REACT_APP_API;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${api}/get-courses`).then(response => response.json()),
      fetch(`${api}/get-all-center-courses`).then(response => response.json())
    ])
      .then(([coursesData, centerCoursesData]) => {
        setCourses(coursesData);
        setCenterCourses(centerCoursesData);

        const uniqueCategories = Array.from(new Set(coursesData.map(course => course.category)));
        setCategories(uniqueCategories);

        const uniqueCenters = Array.from(new Set(centerCoursesData.map(centerCourse => centerCourse.centerName)));
        setCenters(uniqueCenters);

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      });
  }, [api]);

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || course.category === selectedCategory)
  );

  const centerSpecificCourses = selectedCenter
    ? centerCourses.find(centerCourse => centerCourse.centerName === selectedCenter)?.courses.map(centerCourse => ({
        ...centerCourse,
        centerFees: centerCourse.centerFees
      })) || []
    : filteredCourses;

  return (
    <div className="all-center-courses-container">
      <div className="all-center-courses-search-bar">
        <input 
          type="text" 
          placeholder="Search courses..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className="all-center-courses-input"
        />
      </div>
      <div className="all-center-courses-dropdowns">
        <select 
          value={selectedCategory} 
          onChange={e => setSelectedCategory(e.target.value)} 
          className="all-center-courses-select"
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <select 
          value={selectedCenter} 
          onChange={e => setSelectedCenter(e.target.value)} 
          className="all-center-courses-select"
        >
          <option value="">All Centers</option>
          {centers.map((center, index) => (
            <option key={index} value={center}>{center}</option>
          ))}
        </select>
      </div>
      {loading && <div className="loading-view">Loading...</div>}
      {error && !loading && <div className="error-view">{error}</div>}
      {!loading && !error && centerSpecificCourses.length === 0 && (
        <div className="no-data-view">No courses found.</div>
      )}
      {!loading && !error && centerSpecificCourses.length > 0 && (
        <div className="all-center-courses-list">
          {centerSpecificCourses.map(course => (
            <div key={course._id} className="all-center-courses-card">
              {/* <img src={`${api}/uploads/${course.image}`} alt={course.courseName} className="all-center-courses-image" /> */}
              <div className="all-center-courses-details">
                <h3 className="all-center-courses-name">{course.courseName}</h3>
                <p className="all-center-courses-category">Category: {course.category}</p>
                <p className="all-center-courses-fees">Fees: {course.centerFees || course.courseFees} Rs</p>
                <p className="all-center-courses-duration">Duration: {course.courseDuration} days</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCenterCourses;
