import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./CSS/FranchiseLogin.css";

function FranchiseLogin() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
    role: state?.role || "",
  });


  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!state?.role) {
      navigate("/franchise");
    }
  },[]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (values.role === "ADMIN") {
      if (values.username === "admin" && values.password === "admin@123") {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            username: values.username,
            role: values.role,
          })
        );
        navigate("/franchiseAdminHome");
      } else {
        toast.error("Invalid credentials", toastOptions);
      }
    } else if (values.role === "ACCOUNTANT") {
      if (values.username === "accountant" && values.password === "12345678") {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            username: values.username,
            role: values.role,
          })
        );
        navigate("/franchiseAccountantHome");
      } else {
        toast.error("Invalid credentials", toastOptions);
      }
    } else if (values.role === "USER") {
      if (
        (values.username === "userOne" && values.password === "12345678") ||
        (values.username === "userTwo" && values.password === "12345678")
      ) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            username: values.username,
            role: values.role,
          })
        );
        navigate("/franchiseUserHome");
      } else {
        toast.error("Invalid credentials", toastOptions);
      }
    }

    else if (values.role === "STORE") {
      if (
        (values.username === "userOne" && values.password === "12345678") ||
        (values.username === "userTwo" && values.password === "12345678")
      ) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            username: values.username,
            role: values.role,
          })
        );
        navigate("/franchiseStoreHome");
      } else {
        toast.error("Invalid credentials", toastOptions);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{values.role} Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="USERNAME"
              onChange={handleChange}
              className="login-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              onChange={handleChange}
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default FranchiseLogin;
