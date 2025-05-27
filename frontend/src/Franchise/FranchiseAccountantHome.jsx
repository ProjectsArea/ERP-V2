import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AccountsItems from './Accountant/AccountsItems';
import Verified from './Accountant/Verified';
import Rejected from './Accountant/Rejected';
import './CSS/FranchiseAccountantHome.css';

function FranchiseAccountantHome() {
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/franchise");
    }
  }, []);

  const [content, setContent] = useState(<AccountsItems />);
  const navigate = useNavigate();

  const handleClick = (page) => {
    if (page === "all") {
      setContent(<AccountsItems />);
    }
    else if (page === "verified") {
      setContent(<Verified />);
    }
    else if (page === "rejected") {
      setContent(<Rejected />);
    } 
    else if (page === "out") {
      localStorage.removeItem("currentUser");
      navigate("/");
    }
  };
  return (
    <div className="accountant-dashboard">
      <div className="sidebar">
        <div className="menu-item" onClick={() => handleClick("all")}>
          <span className="menu-icon">📊</span>
          <span className="menu-text">All Orders</span>
        </div>
        <div className="menu-item" onClick={() => handleClick("verified")}>
          <span className="menu-icon">✅</span>
          <span className="menu-text">Verified</span>
        </div>
        <div className="menu-item" onClick={() => handleClick("rejected")}>
          <span className="menu-icon">❌</span>
          <span className="menu-text">Rejected</span>
        </div>
        <div className="menu-item logout" onClick={() => handleClick("out")}>
          <span className="menu-icon">🚪</span>
          <span className="menu-text">Logout</span>
        </div>
      </div>
      <div className="content-area">
        {content}
      </div>
    </div>
  )
}

export default FranchiseAccountantHome
