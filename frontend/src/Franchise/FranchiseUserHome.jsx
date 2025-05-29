import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserItems from "./User/UserItems";
import UserOrders from "./User/UserOrders";
import UserHistory from "./User/UserHistory";
import "./CSS/FranchiseUserHome.css";

function FranchiseUserHome() {
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
      localStorage.removeItem("cartItems");
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
