import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  getAllOrdersRoute,
  updatePaymentStatusRoute,
  rejectOrderRoute,
} from "../APIRoutes";
import "../CSS/AccountsItems.css";

function AccountsItems() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get(getAllOrdersRoute).then((res) => {
      if (res.data.status) {
        setOrders(res.data.orders);
      } else {
        console.error(res.data.msg);
      }
    });
  };

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

  return (
    <div className="accountsItems">
      <h2 className="main-title">Payment Verification</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={index}>
              <img
                src={`${
                  process.env.REACT_APP_API
                }/franchises/${order.product.productImage?.split("/").pop()}`}
                alt="Product"
              />
              <div className="info">
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
                <p className="status">
                  <strong>Status:</strong>{" "}
                  <span className="status-pill">{order.paymentStatus}</span>
                </p>
              </div>
              <div className="actions">
                <button onClick={() => handleModify(order._id, "Verified")}>
                  Mark as Verified
                </button>
                <button onClick={() => handleModify(order._id, "Rejected")}>
                  Rejected
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AccountsItems;
