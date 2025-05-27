import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import StoreData from './Store/StoreData';
import StoreAnalysis from './Store/StoreAnalysis';

function FranchiseStoreHome() {
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/franchise");
    }
  }, []);
  const [content, setContent] = useState(<StoreAnalysis />);
  const navigate = useNavigate();

  const handleClick = (page) => {
    if (page === "all") {
      setContent(<StoreData />);
    } else if (page === "anlys") {
      setContent(<StoreAnalysis />);
    } else if (page === "out") {
      localStorage.removeItem("currentUser");
      navigate("/");
    }
  };
  return (
    <div>
      <div id="menuBar">
        <div onClick={() => handleClick("all")}>All Stores</div>
        <div onClick={() => handleClick("anlys")}>Store Analysis</div>
        <div onClick={() => handleClick("out")}>Logout</div>
      </div>
      <div className="content-wrapper">{content}</div>
    </div>
  )
}

export default FranchiseStoreHome