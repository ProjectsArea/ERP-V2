import React, { useEffect, useState } from 'react';
import { getAdminOrdersRoute, updateOrderStatusRoute } from '../APIRoutes';
import axios from 'axios';
import '../CSS/TrackStatusOrders.css';

function TrackStatusOrders({ status }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const fetchOrders = () => {
    axios.get(getAdminOrdersRoute)
      .then(res => {
        if (res.data.status) {
          const filtered = res.data.orders.filter(order =>
            order.orderStatus === getStatusLabel(status)
          );
          const sorted = filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setOrders(sorted);
        } else {
          console.error(res.data.msg);
        }
      });
  };

  const getStatusLabel = (key) => {
    switch (key) {
      case "In Progress": return "In Progress";
      case "Shipped": return "Shipped";
      case "Delivered": return "Delivered";
      default: return "";
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "In Progress": return "Shipped";
      case "Shipped": return "Delivered";
      default: return null;
    }
  };

  const handleStatusUpdate = async (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    try {
      const res = await axios.post(updateOrderStatusRoute, {
        orderId,
        orderStatus: nextStatus
      });

      if (res.data.status) {
        fetchOrders(); // Refresh list
      } else {
        console.error(res.data.msg);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  return (
    <div className="track-orders">
      <h2 className="track-title">Orders - {getStatusLabel(status).toUpperCase()}</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders in this status.</p>
      ) : (
        <ul className="track-list">
          {orders.map((order, index) => (
            <li key={index} className="track-card">
              <div className="track-image">
                <img
                  src={`${process.env.REACT_APP_API}/franchises/${order.product.productImage?.split("/").pop()}`}
                  alt="Product"
                />
              </div>
              <div className="track-details">
                <div className="detail-row">
                  <p className="detail-item"><strong>Item:</strong> {order.product.itemName}</p>
                  <p className="detail-quantity"><strong>Quantity:</strong> {order.product.quantity}</p>
                </div>
                <div className="detail-row">
                  <p className="detail-payee"><strong>Payee:</strong> {order.payeeName}</p>
                  <p className="detail-branch"><strong>Branch:</strong> {order.branch}</p>
                </div>
                <div className="detail-row">
                  <p className="detail-utr"><strong>UTR:</strong> {order.UTRnumber}</p>
                  <p className="detail-status"><strong>Payment Status:</strong> 
                    <span className={`status-chip ${order.orderStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                      {order.orderStatus}
                    </span>
                  </p>
                </div>
              </div>
              {getNextStatus(order.orderStatus) && (
                <button 
                  className="update-btn"
                  onClick={() => handleStatusUpdate(order._id, order.orderStatus)}
                >
                  Update to {getNextStatus(order.orderStatus)}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TrackStatusOrders;
