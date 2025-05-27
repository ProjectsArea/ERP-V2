import React, { useState } from "react";
import axios from "axios";
import { uploadItemsRoute } from "../APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import "../CSS/AdminAddProduct.css";

function AdminAddProduct() {
  const [productData, setProductData] = useState({
    itemName: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    productImage: null,
  });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in productData) {
      formData.append(key, productData[key]);
    }

    // Example POST request
    axios
      .post(uploadItemsRoute, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.data.status === true) {
          toast.success("Uploaded Item Successfully!", toastOptions); // use success instead of error
        } else {
          toast.error(res.data.msg || "Failed to upload", toastOptions);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong!", toastOptions);
      });
  };

  return (
    <div className="add-product-container">
      <div className="form-wrapper">
        <h2 className="page-title">Add New Service</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <input
              type="text"
              name="itemName"
              placeholder="Item Name"
              value={productData.itemName}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              placeholder="Item Description"
              value={productData.description}
              onChange={handleChange}
              className="form-input description"
            />
          </div>

          <div className="form-group">
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Category</option>
              <option value="pamplets">Pamplets</option>
              <option value="books">Books</option>
              <option value="certificates">Certificates</option>
              <option value="materials">Materials</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={productData.price}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group half">
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={productData.quantity}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="file-upload">
              <input
                type="file"
                name="productImage"
                accept=".jpeg, .jpg, .png"
                onChange={handleChange}
                className="file-input"
              />
              <span className="file-label">Choose Product Image</span>
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Add Service
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminAddProduct;
