import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/FranchiseRole.css";

function FranchiseRole() {
  const navigate = useNavigate();
  const handleClick = (role) => {
    navigate("/franchiseLogin", { state: { role: role } });
  };

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");

    if (!userString) {
      navigate("/franchise");
      return;
    }

    const currentUser = JSON.parse(userString);
    console.log(currentUser.role);

    if (currentUser.role !== "ADMIN") {
      if (currentUser.role === "STORE") {
        navigate("/franchiseStoreHome");
      } else if (currentUser.role === "ACCOUNTANT") {
        navigate("/franchiseAccountantHome");
      } else if (currentUser.role === "USER") {
        navigate("/franchiseUserHome");
      } else {
        navigate("/franchise");
      }
    }
  }, []);

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
