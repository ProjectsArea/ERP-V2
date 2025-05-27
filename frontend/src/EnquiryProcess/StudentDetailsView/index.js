import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import "./index.css"

const StudentDetailsView = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [enteredValue, setEnteredValue] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const [view,setViewDetails] = useState("INITIAL");
  const api = process.env.REACT_APP_API


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setEnteredValue('');
    setUserDetails([]);
  };

  const handleValueChange = (event) => {
    setEnteredValue(event.target.value);
  };

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("jwt_token");
    try {
      const response = await fetch(`${api}/student-details?${selectedOption}=${enteredValue}`,{
        method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          mode: 'cors',
      });
      const data = await response.json();
      console.log(data)
      if(data.length > 0) {
        setUserDetails(data);
        setViewDetails("SUCCESS")
      }
      else{
        setViewDetails("FAILED");
      }
     
    } catch (error) {    
      console.error('Error fetching user details:', error);
    }
  };
  const deleteEnquiry = async (id) =>{
    const token = localStorage.getItem("jwt_token");
    try{
      const response = await fetch(`${api}/delete-enquiry/${id}`,{
        method:"DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        mode: 'cors',
      })
      const data = await response.json();
      console.log(data)
      if(response.ok){
        alert("Deleted Successfully");
        fetchUserDetails()
      }
      else{
        alert("Failed To Delete")
      }
    }catch(e){
      console.log(e)
    }

  }
  return (
    <div className="user-details-container">
      <div className="select-container">
        <select className="select-option" value={selectedOption} onChange={handleOptionChange}>
          <option value="">Select an option</option>
          <option value="mobile">Phone Number</option>
          <option value="aadhar">Aadhar Number</option>
        </select>
      </div>
      <div className="input-container">
        <input
          type="text"
          className="input-field"
          value={enteredValue}
          onChange={handleValueChange}
          placeholder={`Enter ${selectedOption}`}
          disabled={!selectedOption}
        />
      </div>
      <div className="button-container">
        <button
          className="fetch-button"
          onClick={fetchUserDetails}
          disabled={!enteredValue}
        >
          Fetch User Details
        </button>
      </div>
      {view === "SUCCESS" && 
          <div className="table-container">
          <table className="user-details-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {userDetails.map((item,index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.coursePreferred}</td>
                  <td>{item.mobile}</td>
                  <td><button>Edit</button><br/><button onClick = {() => deleteEnquiry(item._id)}>Delete</button></td>
                </tr>
            ))}
             </tbody>
          </table>
        </div>
        }
        {view === "INITIAL" && 
            <div className='student-details-initial-view'>
              <h1>Get Student Details using Their Phone Number And Aadhar Details</h1>
            </div>
        }
        {view === "FAILED" &&
            <div className='student-details-failed-view'>
              <h1>Data Not Found</h1>
            </div>
        }
    </div>
  );
};

export default StudentDetailsView