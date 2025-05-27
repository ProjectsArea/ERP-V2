import axios from "axios";
import React, { useEffect, useState } from "react";
import { getVerificationsRoute, updatePaymentStatusRoute } from "../APIRoutes";
import "../CSS/Verified.css";

function Verified() {
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
    axios.get(getVerificationsRoute).then((res) => {
      if (res.data.status) {
        setOrders(res.data.orders);
      } else {
        console.error(res.data.msg);
      }
    });
  };

  return (
    <div className="verified-container">
      <h2 className="verified-heading">Verified Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No verified orders found.</p>
      ) : (
        <div className="verified-grid">
          {orders.map((order, index) => (
            <div key={index} className="verified-card">
              <img
                src={`${
                  process.env.REACT_APP_API
                }/franchises/${order.product.productImage?.split("/").pop()}`}
                alt="Product"
              />
              <div className="card-details">
                <p>
                  <strong>Item:</strong> {order.product.itemName}
                </p>
                <p>
                  <strong>Quantity:</strong> {order.product.quantity}
                </p>
                <p>
                  <strong>Payee:</strong> {order.payeeName}
                </p>
                <p>
                  <strong>Branch:</strong> {order.branch}
                </p>
                <p>
                  <strong>UTR:</strong> {order.UTRnumber}
                </p>
                <p>
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </p>
              </div>
              <button
                onClick={() => handleModify(order._id, "Need to be verified")}
              >
                Mark as Not Verified
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Verified;
