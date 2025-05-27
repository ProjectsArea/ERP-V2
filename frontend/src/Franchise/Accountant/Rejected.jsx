import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getRejectionsRoute, updatePaymentStatusRoute } from '../APIRoutes';
import '../CSS/Rejected.css';

function Rejected() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleModify = async (orderId, currentStatus) => {
    const newStatus = currentStatus;
    try {
      const res = await axios.post(updatePaymentStatusRoute, {
        orderId,
        newStatus,
      });

      if (res.data.status) {
        fetchOrders();
      } else {
        console.error(res.data.msg);
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
    }
  };

  const fetchOrders = () => {
    axios.get(getRejectionsRoute)
      .then(res => {
        if (res.data.status) {
          setOrders(res.data.orders);
        } else {
          console.error(res.data.msg);
        }
      });
  };

  return (
    <div className="rejected-glass-container">
      <h2 className="rejected-heading">Rejected Orders</h2>
      {orders.length === 0 ? (
        <p className="empty-state">No rejected orders found.</p>
      ) : (
        <ul className="rejected-grid">
          {orders.map((order, index) => (
            <li key={index} className="rejected-card">
              <div className="image-wrapper">
                <img
                  src={`${process.env.REACT_APP_API}/franchises/${order.product.productImage?.split("/").pop()}`}
                  alt="Product"
                />
              </div>
              <div className="details">
                <p><strong>Item:</strong> {order.product.itemName}</p>
                <p><strong>Quantity:</strong> {order.product.quantity}</p>
                <p><strong>Payee:</strong> {order.payeeName}</p>
                <p><strong>Branch:</strong> {order.branch}</p>
                <p><strong>UTR:</strong> {order.UTRnumber}</p>
                <p><strong>Status:</strong> 
                  <span className="status-chip rejected">{order.paymentStatus}</span>
                </p>
              </div>
              <button
                className="verify-action"
                onClick={() => handleModify(order._id, "Verified")}
              >
                ✅ Mark as Verified
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Rejected;
