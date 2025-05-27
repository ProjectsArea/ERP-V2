import React from 'react';
import "./index.css"

const DownloadFees = () => {
  const api = process.env.REACT_APP_API;

  const handleDownloadClick = async () => {
    const token = localStorage.getItem("jwt_token");

    try {
      const response = await fetch(`${api}/download-fees-today`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fees-today.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <button onClick={handleDownloadClick} className="download-button">
        Download Fees Data
      </button>
    </div>
  );
};

export default DownloadFees;

