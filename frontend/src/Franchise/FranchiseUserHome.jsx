import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserItems from "./User/UserItems";
import UserOrders from "./User/UserOrders";
import UserHistory from "./User/UserHistory";
import "./CSS/FranchiseUserHome.css";

function FranchiseUserHome() {
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/franchise");
    }
  }, []);
  const [content, setContent] = useState(<UserItems />);
  const navigate = useNavigate();

  const handleClick = (page) => {
    if (page === "all") {
      setContent(<UserItems />);
    } else if (page === "cart") {
      setContent(<UserOrders />);
    } else if (page === "history") {
      setContent(<UserHistory />);
    } else if (page === "out") {
      localStorage.removeItem("currentUser");
      navigate("/");
    }
  };
  return (
    <div>
      <div id="menuBar">
        <div onClick={() => handleClick("all")}>All Services</div>
        <div onClick={() => handleClick("cart")}>My Cart</div>
        <div onClick={() => handleClick("history")}>Orders History</div>
        <div onClick={() => handleClick("out")}>Logout</div>
      </div>
      <div className="content-wrapper">{content}</div>
    </div>
  );
}

export default FranchiseUserHome;
