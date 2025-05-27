import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { buyAllRoute, buyNowRoute } from "../APIRoutes";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/UserPayment.css";

function UserPayment() {
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      navigate("/franchise");
    }
  }, []);
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const userData = JSON.parse(localStorage.getItem("currentUser"));
  const currentUser = userData?.username;

  const [values, setValues] = useState({
    currentUser: currentUser,
    paymentName: "",
    branch: "",
    // UTRNumber: "",
  });

  const { productId, price, setAll } = location.state || {};

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(cartItems);
  }, []);

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (setAll === false) {
      axios
        .post(buyNowRoute, {
          product: cart.find((product) => product._id === productId),
          orderedBy: values,
          paymentStatus: true,
        })
        .then((res) => {
          if (res.data.status === true) {
            toast.success(res.data.msg, toastOptions);
            handleRemoveFromCart(productId);
          } else {
            toast.error(res.data.msg, toastOptions);
          }
        });
      navigate("/franchiseUserHome");
      window.alert("payment succesfful!");
    } else {
      axios
        .post(buyAllRoute, {
          cart: cart,
          orderedBy: values,
          paymentStatus: true,
        })
        .then((res) => {
          if (res.data.status === true) {
            localStorage.removeItem("cartItems");
            toast.success(res.data.msg, toastOptions);
          } else {
            toast.error(res.data.msg, toastOptions);
          }
        });
      navigate("/franchiseUserHome");
      window.alert("order placing succesfful!");
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2>PLace Your Request</h2>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="price-details">
            <span>Total Amount:</span>
            <span className="total-price">₹{price}</span>
          </div>
        </div>
      </div>

      <form action="" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="NAME"
          name="paymentName"
          onChange={handleChange}
          required
        />
        <select name="branch" onChange={handleChange} required>
          <option value="">Select a Branch</option>{" "}
          {/* <- Placeholder option */}
          <option value="Dwarakanagar">DWARAKANAGAR</option>
          <option value="Mvp">MVP</option>
          <option value="Gajuwaka">GAJUWAKA</option>
          <option value="Karimnagar">KARIMNAGAR</option>
          <option value="Rajahmundry">RAJAHMUNDRY </option>
          <option value="Nad">NAD</option>
          <option value="Araku">ARAKU</option>
          <option value="Srikakulam">SRIKAKULAM</option>
          <option value="Rajam">RAJAM</option>
          <option value="Madhurwada">MADHURWADA</option>
          <option value="Anakapalli">ANAKAPALLI</option>
          <option value="Gunupur">GUNUPUR</option>
          <option value="Bhadrachalam">BHADHRACHALAM</option>
          <option value="Dilsukhnagar">Dilsukhnagar</option>
        </select>
        {/* <input
          type="text"
          placeholder="UTR NUMBER"
          name="UTRNumber"
          onChange={handleChange}
          required
        /> */}
        <button type="submit">PLACE ORDER</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default UserPayment;
