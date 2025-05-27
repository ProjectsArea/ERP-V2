import React, { useState, useEffect } from 'react';
import './index.css'

const Centers = () => {
  const [centers, setCenters] = useState([]);
  const api = process.env.REACT_APP_API
  console.log(api)
  
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch(`${api}/enquiries`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data)
        const centersMap = new Map();
        data.forEach((enquiry) => {
          const { centerName } = enquiry;
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
    <div className="enquiry-centers-container">
      {centers.map(([center, totalEnquiries], index) => (
    <a href = {`/center/${center}`} style = {{textDecoration:"none"}}>
        <div className="enquiry-center-card" key={index}>
          <h3 className="center-name">{center}</h3>
          <p className="total-enquiries">{`Total Enquiries: ${totalEnquiries}`}</p>
        </div>
    </a>
      ))}
    </div>
  );
};

export default Centers;
