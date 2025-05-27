import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminAddProduct from "./Admin/AdminAddProduct";
import AdminOrders from "./Admin/AdminOrders";
import AdminAllItems from "./Admin/AdminAllItems";
import TrackStatusOrders from "./Admin/TrackStatusOrders";
import "./CSS/FranchiseAdminHome.css";

function FranchiseAdminHome() {
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/franchise");
    }
  }, []);

  const [content, setContent] = useState(<AdminOrders />);
  const [showTrackMenu, setShowTrackMenu] = useState(false);
  const navigate = useNavigate();

  const handleClick = (page) => {
    if (page === "add") {
      setContent(<AdminAddProduct />);
    } else if (page === "all") {
      setContent(<AdminAllItems />);
    } else if (page === "orders") {
      setContent(<AdminOrders />);
    } else if (page === "out") {
      localStorage.removeItem("currentUser");
      navigate("/");
    } else if (["Shipped", "In Progress", "Delivered"].includes(page)) {
      setContent(<TrackStatusOrders status={page} />);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="menu-item" onClick={() => handleClick("orders")}>
          <span className="menu-text">Orders</span>
        </div>
        <div className="menu-item" onClick={() => setShowTrackMenu(!showTrackMenu)}>
          <span className="menu-text">Track Items</span>
        </div>
        {showTrackMenu && (
          <div className="submenu">
            <div className="submenu-item" onClick={() => handleClick("In Progress")}>In Progress</div>
            <div className="submenu-item" onClick={() => handleClick("Shipped")}>Shipped</div>
            <div className="submenu-item" onClick={() => handleClick("Delivered")}>Delivered</div>
          </div>
        )}
        <div className="menu-item" onClick={() => handleClick("all")}>
          <span className="menu-text">All Items</span>
        </div>
        <div className="menu-item" onClick={() => handleClick("add")}>
          <span className="menu-text">Upload Product</span>
        </div>
        <div className="menu-item logout" onClick={() => handleClick("out")}>
          <span className="menu-text">Logout</span>
        </div>
      </div>
      <div className="content-area">
        {content}
      </div>
    </div>
  );
}

export default FranchiseAdminHome;
