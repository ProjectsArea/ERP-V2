import React from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/FranchiseRole.css";

function FranchiseRole() {
  const navigate = useNavigate();
  const handleClick = (role) => {
    navigate("/franchiseLogin", { state: { role: role } });
  };
  return (
    <div className="franchise-role-container">
      <div className="franchise-role-title">Franchise Role</div>
      <div className="role-options">
        <div className="role-card" onClick={() => handleClick("ADMIN")}>
          <span className="role-text">Franchise Admin</span>
        </div>
        <div className="role-card" onClick={() => handleClick("ACCOUNTANT")}>
          <span className="role-text">Franchise Accountant</span>
        </div>
        <div className="role-card" onClick={() => handleClick("USER")}>
          <span className="role-text">Franchise User</span>
        </div>
        <div className="role-card" onClick={() => handleClick("STORE")}>
          <span className="role-text">Franchise Store</span>
        </div>
      </div>
    </div>
  );
}

export default FranchiseRole;
