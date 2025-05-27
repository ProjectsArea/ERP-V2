import React, { useEffect, useState } from 'react';
import { getAdminOrdersRoute, updateOrderStatusRoute } from '../APIRoutes';
import axios from "axios";
import '../CSS/AdminOrders.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get(getAdminOrdersRoute)
      .then(res => {
        if (res.data.status) {
          setOrders(res.data.orders);
        } else {
          console.error(res.data.msg);
        }
      });
  };

  const handleSetInProgress = async (orderId) => {
    await axios.post(updateOrderStatusRoute, {
      orderId,
      orderStatus: "In Progress"
    }).then((res) => {
      if (res.data.status) {
        fetchOrders(); // Refresh orders
      } else {
        console.error(res.data.msg);
      }
    })
  };

  const verifiedOrders = orders.filter(order => order.paymentStatus === "Verified");
  const needVerification = orders.filter(order => order.paymentStatus === "Need to be verified");
  const rejectedOrders = orders.filter(order => order.paymentStatus === "Rejected");

  const renderOrderList = (list, showInProgressBtn = false) => (
    <ul className="orders-list">
      {list.map((order, index) => (
        <li key={index} className="order-card">
          <div className="order-image">
            <img
              src={`${process.env.REACT_APP_API}/franchises/${order.product.productImage?.split("/").pop()}`}
              alt="Product"
            />
          </div>
          <div className="order-details">
            <p className="order-item"><strong>Item:</strong> {order.product.itemName}</p>
            <p className="order-quantity"><strong>Quantity:</strong> {order.product.quantity}</p>
            <p className="order-payee"><strong>Payee:</strong> {order.payeeName}</p>
            <p className="order-branch"><strong>Branch:</strong> {order.branch}</p>
            <p className="order-utr"><strong>UTR:</strong> {order.UTRnumber}</p>
            <p className="order-status">
              <strong>Payment Status:</strong> 
              <span className={`status-badge ${order.paymentStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                {order.paymentStatus}
              </span>
            </p>
          </div>
          {showInProgressBtn && (
            <button className="progress-btn" onClick={() => handleSetInProgress(order._id)}>
              Set as In Progress
            </button>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="admin-orders">
      <h2 className="page-title">Order Summary</h2>

      <div className="summary-cards">
        <div className="summary-card verified">
          <span className="count">{verifiedOrders.length}</span>
          <span className="label">Verified</span>
        </div>
        <div className="summary-card pending">
          <span className="count">{needVerification.length}</span>
          <span className="label">Need Verification</span>
        </div>
        <div className="summary-card rejected">
          <span className="count">{rejectedOrders.length}</span>
          <span className="label">Rejected</span>
        </div>
      </div>

      {verifiedOrders.length > 0 && (
        <div className="orders-section">
          <h3 className="section-title">Verified Orders</h3>
          {renderOrderList(verifiedOrders, true)}
        </div>
      )}

      {needVerification.length > 0 && (
        <div className="orders-section">
          <h3 className="section-title">Need to be Verified Orders</h3>
          {renderOrderList(needVerification)}
        </div>
      )}

      {rejectedOrders.length > 0 && (
        <div className="orders-section">
          <h3 className="section-title">Rejected Orders</h3>
          {renderOrderList(rejectedOrders)}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
