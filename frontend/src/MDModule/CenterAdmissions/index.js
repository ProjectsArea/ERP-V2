import React, { useState, useEffect } from 'react';
import './index.css'

const CenterAdmissions = () => {
  const [centers, setCenters] = useState([]);
  const api = process.env.REACT_APP_API
  console.log(api)
  
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch(`${api}/admissions`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data)
        const centersMap = new Map();
        data.forEach((admission) => {
          const { centerName } = admission;
          centersMap.set(centerName, (centersMap.get(centerName) || 0) + 1);
        });
        const centersArray = Array.from(centersMap.entries());
        setCenters(centersArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCenters();
  }, []);

  return (
    <div className="admission-centers-container">
      {centers.map(([center, totalAdmissions], index) => (
    <a href = {`/admissions/${center}`} style = {{textDecoration:"none"}} key={index}>
        <div className="admission-center-card">
          <h3 className="center-name">{center}</h3>
          <p className="total-admissions">{`Total Admissions: ${totalAdmissions}`}</p>
        </div>
    </a>
      ))}
    </div>
  );
};

export default CenterAdmissions;
