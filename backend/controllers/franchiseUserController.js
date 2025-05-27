const ItemModel = require("../model/franchise/franchiseItem");
const OrderModel = require("../model/franchise/orderItem")

exports.getAllProducts = async (req, res) => {
  try {
    const items = await ItemModel.find().sort({ createdAt: -1 });
    if (items)
      res.json({ status: true, items: items });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
}



exports.buyNow = async (req, res) => {
  const { product, orderedBy } = req.body
  try {
    if (!product || !orderedBy) {
      return res.json({ status: false, msg: "Missing product or user details." });
    }

    const item = await ItemModel.findById(product._id);

    if (!item) {
      return res.json({ status: false, msg: "Product not found." });
    }

    if (item.quantity < product.total_quantity) {
      return res.json({ status: false, msg: "Not enough stock available." });
    }


    item.quantity -= product.total_quantity;
    await item.save();

    const newOrder = new OrderModel({
      currentUser: orderedBy.currentUser,
      payeeName: orderedBy.paymentName,
      paymentStatus: "Need to be verified",
      orderStatus: "Ordered",
      branch: orderedBy.branch,
      product: {
        item_id: product._id,
        itemName: product.itemName,
        description: product.description,
        category: product.category,
        price: product.price,
        quantity: product.total_quantity,
        productImage: product.productImage,
      },
    });

    await newOrder.save();

    return res.json({ status: true, msg: "order recorded successfully." });
  } catch (err) {
    console.error(err);
    return res.json({ status: false, msg: "Error in submitting payment." });
  }
};


exports.buyAll = async (req, res) => {
  try {
    const { cart, orderedBy } = req.body;

    if (!cart || cart.length === 0 || !orderedBy) {
      return res.json({ status: false, msg: "Missing cart or user details." });
    }

    for (let product of cart) {
      // Fetch the item from DB
      const item = await ItemModel.findById(product._id);

      if (!item) {
        return res.json({ status: false, msg: `Product ${product.itemName} not found.` });
      }

      // Check stock availability
      if (item.quantity < product.total_quantity) {
        return res.json({ status: false, msg: `Not enough stock for ${product.itemName}.` });
      }

      // Reduce stock
      item.quantity -= product.total_quantity;
      await item.save();

      // Save order
      const newOrder = new OrderModel({
        currentUser: orderedBy.currentUser,
        payeeName: orderedBy.paymentName,
        paymentStatus: "Need to be verified",
        orderStatus: "Ordered",
        branch: orderedBy.branch,
        UTRnumber: orderedBy.UTRNumber,
        product: {
          item_id: product._id,
          itemName: product.itemName,
          description: product.description,
          category: product.category,
          price: product.price,
          quantity: product.total_quantity,
          productImage: product.productImage,
        },
      });

      await newOrder.save();
    }

    return res.json({ status: true, msg: "All orders placed successfully." });

  } catch (err) {
    console.error(err);
    return res.json({ status: false, msg: "Error in Submitting payment" });
  }
};



exports.getHistory = async (req, res) => {
  try {
    const { currentUser } = req.body;
    const orders = await OrderModel.find({ currentUser }).sort({ createdAt: -1 });
    res.json({ status: true, orders });
  } catch (err) {
    console.error(err);
    res.json({ status: false, msg: "Failed to fetch order history" });
  }
};