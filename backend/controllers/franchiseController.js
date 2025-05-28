const ItemModel = require("../model/franchise/franchiseItem");
const userModel = require("../model/franchise/franchiseUser");
const OrderModel = require("../model/franchise/orderItem");
const bcrypt = require("bcryptjs");


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




// adjust path as needed

exports.addUser = async (req, res) => {
  const { role, username, password, confirmPassword } = req.body;

  try {
    if (!role || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existingUser = await userModel.findOne({ username, role });
    if (existingUser) {
      return res.status(409).json({ status: false, message: 'This username already exists for the selected role.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({ role, username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ status: true, message: 'User created successfully.' });
  } catch (error) {
    console.error('Error in addUser:', error);
    return res.status(500).json({ status: false, message: 'Server error. Please try again later.' });
  }
};





exports.changePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;


  try {
    // Validate input
    if (!username || !currentPassword || !newPassword) {
      return res.json({ status: false, message: 'All fields are required.' });
    }

    // Find the user
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.json({ status: false, message: 'User not found.' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({ status: false, message: 'Current password is incorrect.' });
    }

    // Prevent reuse of the same password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.json({ status: false, message: 'New password must be different from the current password.' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ status: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    return res.status(500).json({ status: false, message: 'Server error. Please try again later.' });
  }
};


exports.allUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, '-password -__v'); // exclude password and __v fields
    return res.json({ status: true, users });
  } catch (error) {
    console.error('Error in allUsers:', error);
    return res.json({ status: false, message: 'Server error. Please try again later.' });
  }
};



exports.deleteUser = async (req, res) => {
  const { actorId } = req.params;

  try {
    const deletedUser = await userModel.findByIdAndDelete(actorId);

    if (!deletedUser) {
      return res.json({ status: false, message: 'User not found.' });
    }

    return res.json({ status: true, message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return res.status(500).json({ status: false, message: 'Server error while deleting user.' });
  }
};





exports.loginCheck = async(req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await userModel.findOne({ username, role });
    if (!user) {
      return res.json({ status: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ status: false, message: "Invalid credentials" });
    }

    return res.json({
      status: true,
      message: "Login successful",
      user: { username: user.username, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
}