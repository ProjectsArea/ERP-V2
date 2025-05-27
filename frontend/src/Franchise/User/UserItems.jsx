import React, { useEffect, useState } from 'react';
import { getAllProductsRoute } from '../APIRoutes';
import axios from 'axios';
import '../CSS/UserItems.css';

function UserItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get(getAllProductsRoute);
                setItems(res.data.items);
            } catch (err) {
                console.error("Error fetching items:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();

        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const handleAddToCart = (product) => {
        const updatedCartItems = [...cartItems];
        const productExists = updatedCartItems.some(
            (item) => item._id === product._id
        );

        if (!productExists) {
            updatedCartItems.push({
                ...product,
                total_quantity: 1,
                total_price: product.price,
            });
            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
            setCartItems(updatedCartItems);
            setMessage("Item added to cart!");
        } else {
            setMessage("Item is already in the cart!");
        }

        setTimeout(() => {
            setMessage("");
        }, 2500);
    };

    if (loading) return <div className="loading">Loading services...</div>;

    return (
        <div className="user-items-wrapper">
            {message && <div className="cart-notification">{message}</div>}
            <div className="items-container">
                {items.map((item) => (
                    <div className="product-card" key={item._id}>
                        <img
                            src={`${process.env.REACT_APP_API}/franchises/${item.productImage?.split("/").pop()}`}
                            alt={item.itemName}
                            className="product-image"
                        />
                        <h4 className="product-title">{item.itemName}</h4>
                        <p className="product-desc">{item.description}</p>
                        <p className="product-price">₹{item.price}</p>
                        {item.quantity <= 0 ? (
                            <p className="stock-warning">Out of Stock</p>
                        ) : (
                            <button
                                className="add-cart-btn"
                                onClick={() => handleAddToCart(item)}
                            >
                                ADD TO CART
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserItems;
