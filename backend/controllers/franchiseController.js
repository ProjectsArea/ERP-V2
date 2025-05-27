const ItemModel = require("../model/franchise/franchiseItem");
const OrderModel = require("../model/franchise/orderItem")

exports.uploadItems = async (req, res) => {
  try {
    const { itemName, description, category, price, quantity } = req.body;
    const productImage = req.file?.filename;

    if (!itemName || !description || !category || !price || !quantity || !productImage) {
      return res.json({ status: false, msg: "All fields are required" });
    }

    const newItem = new ItemModel({
      itemName,
      description,
      category,
      price,
      quantity,
      productImage: `/Franchise/${productImage}`,
    });

    await newItem.save();

    return res.json({ status: true, msg: "Item uploaded successfully", item: newItem });

  } catch (err) {
    console.error("Upload error:", err);
    return res.json({ status: false, msg: "Error in uploading Item" });
  }
};



exports.getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.find().sort({ createdAt: -1 });
    if (items)
      res.json({ status: true, items: items });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
}


exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    if (!itemId) {
      return res.status(400).json({ status: false, msg: "Item ID is required" });
    }

    const deletedItem = await ItemModel.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ status: false, msg: "Item not found" });
    }

    return res.json({ status: true, msg: "Item deleted successfully", item: deletedItem });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ status: false, msg: "Error deleting item" });
  }
};



exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { itemName, description, price, quantity } = req.body;

    if (!itemId) {
      return res.status(400).json({ status: false, msg: "Item ID is required" });
    }

    const updatedFields = {
      itemName,
      description,
      price,
      quantity,
    };

    const updatedItem = await ItemModel.findByIdAndUpdate(itemId, updatedFields, {
      new: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ status: false, msg: "Item not found" });
    }

    return res.json({ status: true, msg: "Item updated successfully", item: updatedItem });

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ status: false, msg: "Error updating item" });
  }
};





exports.allOrders = async (req, res) => {
  try {
    const allOrders = await OrderModel.find().sort({ createdAt: -1 });
    return res.json({
      status: true,
      orders: allOrders,
    });

  } catch (err) {
    console.error(err);
    return res.json({ status: false, msg: "Error fetching Orders." });
  }
}





exports.updateOrderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body;

  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.json({ status: false, msg: "Order not found" });
    }

    order.orderStatus = orderStatus;
    order.paymentStatus = "Completed";
    await order.save();

    res.json({ status: true, msg: "Order status updated successfully" });

  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};
