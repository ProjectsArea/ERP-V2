const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    currentUser: {
        type: String,
        required: true
    },
    payeeName: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    paymentStatus:{
        type: String,
        required: true,
    },
    orderStatus:{
        type: String,
        required: true,
    },
    product: {
        item_id:{
            type: String,
            required: true,
        },
        itemName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["pamplets", "books", "certificates", "materials"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        productImage: {
            type: String, // stores filename
            required: true,
        }
    },
}, { timestamps: true });


const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;
