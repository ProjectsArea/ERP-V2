import React, { useState } from 'react';
import './index.css';

const PayFees = () => {
  const [studentID, setStudentID] = useState('');
  const [student, setStudent] = useState(null);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paidFees,setPaidFees] = useState(null);
  const [remainingFees,setRemainingFees] = useState(null);
  const [receiptNumber, setReceiptNumber] = useState("")
  const [amount, setAmount] = useState('');
  const [nextTermDate, setNextTermDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [loading, setLoading] = useState(false);
  const api = process.env.REACT_APP_API;

  const handleInputChange = (e) => {
    setStudentID(e.target.value);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} at ${formattedTime}`;
  };

  const center = localStorage.getItem("center");
  const token = localStorage.getItem("jwt_token");

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/student/${studentID}`);
      if (!response.ok) {
        alert("Student not found");
        throw new Error('Student not found');
      }
      const data = await response.json();
      console.log(data);
      if (data.admission.centerName !== center) {
        alert("This Student Is Not From Your Center");
        throw new Error('Student not found');
      }
      setStudent(data.admission);
      if(data.feesDetails !== null)
        setPayment(data.feesDetails);
      const paid =  data.feesDetails !== null ?(data.feesDetails.terms.reduce((pre, curr) => pre + curr.amountPaid, 0)):0
      const remaining = data.admission.totalFees - paid;

      setPaidFees(paid);
      setRemainingFees(remaining);

      setError(null);
    } catch (error) {
      setStudent(null);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptNumberChange = (e) =>{
    setReceiptNumber(e.target.value);
  }

  const handlePayFeesClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAmountChange = (e) => {
    if(e.target.value > remainingFees){
      alert("High Amount")
      return
    }
    setAmount(e.target.value);
  };

  const handleNextTermDateChange = (e) => {
    setNextTermDate(e.target.value);
  };

  const handlePaymentModeChange = (e) => {
    setPaymentMode(e.target.value);
  };


  const handlePayButtonClick = async () => {
    const paymentDetails = {
      IdNo: studentID,
      receiptNumber:receiptNumber,
      amountPaid: amount,
      nextTermDate,
      modeOfPayment: paymentMode,
      center,
    };

    try {
      const response = await fetch(`${api}/pay-fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(paymentDetails),
      });
      console.log(paymentDetails);

      if (!response.ok) {
        throw new Error('Failed to process payment');
      }
      alert('Payment successful');
      setReceiptNumber("")
      setAmount("")
      setNextTermDate("")
      setPaymentMode("")
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };



  return (
    <div className="student-details-container">
      <div className="input-container">
        <input
          type="text"
          value={studentID}
          onChange={handleInputChange}
          placeholder="Enter Student ID"
          className="student-input"
        />
        <button onClick={handleButtonClick} className="search-button">Get Details</button>
      </div>
      {loading && <p className="loading-view">Loading...</p>}
      {error && !loading && <p className="error-message">{error}</p>}
      {!student && !loading && !error && <p className="initial-view">Enter the Student ID to get details</p>}
      {student && !loading && (
        <div className="student-card">
          {/* <img src={`${api}/uploads/${student.image}`} alt={student.name} className="student-pic" /> */}
          <div className="student-info">
            <h2 className="student-name">{student.name}</h2>
            <p className="student-course"><strong>Course:</strong> {student.courseEnrolled}</p>
            <p className="student-timings"><strong>Timings:</strong> {student.timings}</p>
            <p className="student-start-date"><strong>Start Date:</strong> {formatDate(student.dateOfJoining)}</p>
            <p className='paid-fees'>
              <strong>Paid Fees:</strong> {paidFees}
            </p>
            <p className='paid-fees'>
              <strong> Remaining Fees:</strong>
              {remainingFees}
            </p>
            <p className="student-total-fees"><strong>Total Fees:</strong> {student.totalFees}</p>
            {
              payment ? payment.totalStatus === "completed" ? (<h1 style={{ color: "green", fontFamily: "Roboto" }}>Fees Paid</h1>) : (<button onClick={handlePayFeesClick} className="pay-fees-button">Pay</button>) : (<button onClick={handlePayFeesClick} className="pay-fees-button">Pay</button>)
            }
          </div>
        
        </div>
      )}
      {showModal && (
        <div className="pay-fee-modal-overlay">
          <div className="modal-content">
            <span className="close-modal" onClick={closeModal}>&times;</span>
            <h2>Pay Fees</h2>
            <div className="modal-input-container">
              <label className="modal-label">Receipt Number</label>
              <input
                type="text"
                className="modal-input"
                value={receiptNumber}
                onChange={handleReceiptNumberChange}
              />
            </div>
            <div className="modal-input-container">
              <label className="modal-label">Amount</label>
              <input
                type="number"
                className="modal-input"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <div className="modal-input-container">
              <label className="modal-label">Next Term Date</label>
              <input
                type="date"
                className="modal-input"
                value={nextTermDate}
                onChange={handleNextTermDateChange}
              />
            </div>
            <div className="modal-input-container">
              <label className="modal-label">Mode of Payment</label>
              <select
                className="modal-input"
                value={paymentMode}
                onChange={handlePaymentModeChange}
              >
                <option value = "">Select</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Online Payment">Online Payment</option>
              </select>
            </div>
            <button
              onClick={handlePayButtonClick}
              className="modal-pay-button"
            >
              Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayFees;
