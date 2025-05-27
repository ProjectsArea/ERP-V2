import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import './index.css'; // Import your CSS file for styling

const RevenueChart = () => {
  const api = process.env.REACT_APP_API;
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total Revenue',
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.8)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: []
      },
      {
        label: 'Collected Revenue',
        backgroundColor: 'rgba(153,102,255,0.6)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(153,102,255,0.8)',
        hoverBorderColor: 'rgba(153,102,255,1)',
        data: []
      }
    ]
  });

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const admissionsResponse = await fetch(`${api}/admissions`);
        const feesResponse = await fetch(`${api}/fees`);

        if (!admissionsResponse.ok || !feesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const admissionsData = await admissionsResponse.json();
        const feesData = await feesResponse.json();

        const revenueByCenter = admissionsData.reduce((acc, admission) => {
          acc[admission.centerName] = acc[admission.centerName] || { totalRevenue: 0, collectedRevenue: 0 };
          acc[admission.centerName].totalRevenue += admission.totalFees;
          return acc;
        }, {});

        feesData.forEach(fee => {
          fee.terms.forEach(term => {
            if (revenueByCenter[fee.center]) {
              revenueByCenter[fee.center].collectedRevenue += term.amountPaid;
            }
          });
        });

        const centers = Object.keys(revenueByCenter);
        const totalRevenue = centers.map(center => revenueByCenter[center].totalRevenue);
        const collectedRevenue = centers.map(center => revenueByCenter[center].collectedRevenue || 0); // Ensure collectedRevenue is defined

        setRevenueData({
          labels: centers,
          datasets: [
            {
              ...revenueData.datasets[0],
              data: totalRevenue
            },
            {
              ...revenueData.datasets[1],
              data: collectedRevenue
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  return (
    <div className="revenue-chart-container">
      <h2 className="revenue-chart-title">Center Revenue</h2>
      <Bar
        data={revenueData}
        options={{
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return `${(value / 1000).toFixed(0)}K`; // Convert to 10,000s
                }
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          layout: {
            padding: {
              left: 50,
              right: 10,
              top: 0,
              bottom: 10
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutBounce'
          }
        }}
        className="revenue-chart"
      />
    </div>
  );
};

export default RevenueChart;
