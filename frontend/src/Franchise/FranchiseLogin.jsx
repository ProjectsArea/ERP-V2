import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "./CSS/FranchiseLogin.css";
import { checkLoginRoute } from "./APIRoutes";

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
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (values.role === "ADMIN") {
      // Hardcoded admin login
      if (values.username === "admin" && values.password === "admin@123") {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ username: values.username, role: values.role })
        );
        navigate("/franchiseAdminHome");
      } else {
        toast.error("Invalid admin credentials", toastOptions);
      }
      return;
    }

    // For other roles, call backend
    try {
      const { data } = await axios.post(checkLoginRoute, values);

      if (data.status) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        switch (data.user.role) {
          case "ACCOUNTANT":
            navigate("/franchiseAccountantHome");
            break;
          case "USER":
            navigate("/franchiseUserHome");
            break;
          case "STORE":
            navigate("/franchiseStoreHome");
            break;
          default:
            toast.error("Unknown role", toastOptions);
        }
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Try again.", toastOptions);
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
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              onChange={handleChange}
              className="login-input"
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default FranchiseLogin;
