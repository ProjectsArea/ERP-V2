import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/UserOrders.css'; // Make sure to import the CSS file

function UserOrders() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(cartItems);
    calculateTotal(cartItems);
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.total_quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId && item.total_quantity + 1 <= item.quantity
        ? {
          ...item,
          total_quantity: item.total_quantity + 1,
          total_price: item.price * (item.total_quantity + 1),
        }
        : item
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cart
      .map((item) =>
        item._id === productId
          ? {
            ...item,
            total_price: item.price * (item.total_quantity - 1),
            total_quantity: Math.max(0, item.total_quantity - 1),
          }
          : item
      )
      .filter((item) => item.total_quantity > 0);

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleBuyNow = (productId, price) => {
    navigate("/franchisePayments", { state: { productId, price, setAll: false } });
  };

  const handleCheckout = (price) => {
    navigate("/franchisePayments", {
      state: { price, setAll: true },
    });
  };

  return (
    <div className="user-orders-container">
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="items-container">
          {cart.map((item) => (
            <div key={item._id} className="product-card">
              <img
                src={`${process.env.REACT_APP_API}/franchises/${item.productImage?.split("/").pop()}`}
                alt={item.itemName}
                className="product-image"
              />
              <h4 className="product-title">{item.itemName}</h4>
              <p className="product-desc">{item.description}</p>
              <p className="product-price">Price: ₹{item.price}</p>
              <div className="quantity-control">
                <button onClick={() => handleDecreaseQuantity(item._id)}>-</button>
                <span>{item.total_quantity}</span>
                <button
                  onClick={() => handleIncreaseQuantity(item._id)}
                  disabled={item.total_quantity >= item.quantity}
                >
                  +
                </button>
              </div>
              <button onClick={() => handleBuyNow(item._id, item.total_price)} className="buy-now-btn">Buy Now</button>
              <button onClick={() => handleRemoveFromCart(item._id)} className="remove-btn">Remove</button>
            </div>
          ))}
        </div>
      )}
      <div className="checkout-container">
        <h3 className="total-price">Total: ₹{totalPrice}</h3>
        <button onClick={() => handleCheckout(totalPrice)} className="checkout-btn">Checkout All</button>
      </div>
    </div>
  );
}

export default UserOrders;
