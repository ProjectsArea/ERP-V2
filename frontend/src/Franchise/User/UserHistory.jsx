import axios from "axios";
import React, { useEffect, useState } from "react";
import { orderHistoryRoute } from "../APIRoutes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/UserHistory.css"; // Import the styles here

function UserHistory() {
  const [orders, setOrders] = useState([]);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const userData = JSON.parse(localStorage.getItem("currentUser"));
  const currentUser = userData?.username;

  useEffect(() => {
    if (!currentUser) return;

    axios.post(orderHistoryRoute, { currentUser }).then((res) => {
      if (res.data.status) {
        setOrders(res.data.orders);
      } else {
        console.error(res.data.msg);
        toast.error(res.data.msg, toastOptions);
      }
    });
  }, []);

  return (
    <div className="history-container">
      <h2 className="history-title">Your Order History</h2>
      {orders.length === 0 ? (
        <p className="empty-msg">No orders found.</p>
      ) : (
        <ul className="history-grid">
          {orders.map((order, index) => (
            <li key={index} className="order-card">
              <img
                src={`${process.env.REACT_APP_API}/franchises/${order.product.productImage?.split("/").pop()}`}
                alt="product"
                className="order-image"
              />
              <h4 className="order-title">{order.product.itemName}</h4>
              <p>Quantity: {order.product.quantity}</p>
              <p>Payment Status: <span className={`status ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></p>
              <p>Order Status: <span className={`status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></p>
              <p>Branch: {order.branch}</p>
              <p>Paid by: {order.payeeName}</p>
              <p>UTR Number: {order.UTRnumber}</p>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
}

export default UserHistory;
