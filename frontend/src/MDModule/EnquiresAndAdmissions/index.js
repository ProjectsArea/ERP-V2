// PieChart.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './index.css';

const EnquiresAndAdmissions = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const api = process.env.REACT_APP_API
  console.log(api)
  useEffect(() => {
    const fetchEnquiries = async () => {
      const response = await fetch(`${api}/enquiries`);
      const data = await response.json();
      console.log("E", data);
      setEnquiries(data);
    };

    const fetchAdmissions = async () => {
      const response = await fetch(`${api}/admissions`);
      const data = await response.json();
      console.log("A", data)
      setAdmissions(data);
    };

    fetchEnquiries();
    fetchAdmissions();
  }, []);

  const getCountsByCenter = (data, center) => {
    return data.filter(item => item.centerName === center).length;
  };

  const centers = ['DWK', 'MVP', 'GWK'];

  const generateChartData = (center) => {
    return {
      labels: ['Enquiries', 'Admissions'],
      datasets: [
        {
          data: [getCountsByCenter(enquiries, center), getCountsByCenter(admissions, center)],
          backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
          borderWidth: 1,
          hoverOffset: 4,
        }
      ]
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw;
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutBounce',
    }
  };

  return (
    <div className="pie-chart-container">
      {centers.map(center => (
        <div key={center} className="pie-chart-section">
          <h2 className="pie-chart-heading">{center} Center</h2>
          <Pie data={generateChartData(center)} options={options} />
        </div>
      ))}
    </div>
  );
};

export default EnquiresAndAdmissions;
