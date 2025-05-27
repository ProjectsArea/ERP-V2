const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
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
  },
}, { timestamps: true });


const itemModel = mongoose.model("Items", ItemSchema);

module.exports = itemModel;
