import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAllItemsRoute } from "../APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import "../CSS/AdminAllItems.css";

function AdminAllItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get(getAllItemsRoute);
                setItems(res.data.items);
            } catch (err) {
                console.error("Error fetching items:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleModify = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        await axios.delete(`${getAllItemsRoute}/${itemId}`).then((res) => {
            if (res.data.status === true) {
                setItems(items.filter((item) => item._id !== itemId));
                toast.success(res.data.msg, toastOptions)
            }
            else {
                toast.error(res.data.msg, toastOptions)
            }
        })
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await axios.put(
            `${getAllItemsRoute}/${selectedItem._id}`,
            selectedItem
        ).then((res) => {
            if (res.data.status === true) {
                const updatedItems = items.map((item) =>
                    item._id === selectedItem._id ? res.data.item : item
                );
                setItems(updatedItems);
                toast.success(res.data.msg, toastOptions);
                setModalOpen(false);
            }
            else {
                toast.error(res.data.msg, toastOptions);
            }
        })
    };


    const handleChange = (e) => {
        setSelectedItem({ ...selectedItem, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="loading-state">Loading items...</div>;

    return (
        <div className="admin-items">
            <h2 className="page-title">All Items</h2>
            <div className="items-grid">
                {items.map((item) => (
                    <div key={item._id} className="item-card">
                        <div className="item-image">
                            <img
                                src={`${process.env.REACT_APP_API}/franchises/${item.productImage.split("/").pop()}`}
                                alt={item.itemName}
                            />
                        </div>
                        <div className="item-content">
                            <h4 className="item-name">{item.itemName}</h4>
                            <p className="item-description">{item.description}</p>
                            <p className="item-category">Category: {item.category}</p>
                            <div className="item-details">
                                <p className="item-price">₹{item.price}</p>
                                <p className="item-quantity">Qty: {item.quantity}</p>
                            </div>
                            <div className="item-actions">
                                <button className="modify-btn" onClick={() => handleModify(item)}>Modify</button>
                                <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && selectedItem && (
                <div className="modal-overlay">
                    <form onSubmit={handleUpdate} className="modal-form">
                        <h3 className="modal-title">Edit Item</h3>
                        <input
                            type="text"
                            name="itemName"
                            value={selectedItem.itemName}
                            onChange={handleChange}
                            placeholder="Item Name"
                            className="modal-input"
                            required
                        />
                        <input
                            type="number"
                            name="price"
                            value={selectedItem.price}
                            onChange={handleChange}
                            placeholder="Price"
                            className="modal-input"
                            required
                        />
                        <input
                            type="number"
                            name="quantity"
                            value={selectedItem.quantity}
                            onChange={handleChange}
                            placeholder="Quantity"
                            className="modal-input"
                            required
                        />
                        <textarea
                            name="description"
                            value={selectedItem.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="modal-textarea"
                        />
                        <div className="modal-actions">
                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default AdminAllItems;
