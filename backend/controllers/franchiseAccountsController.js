const OrderModel = require("../model/franchise/orderItem"); // adjust path if needed

exports.getAllOrders = async (req, res) => {
    try {
        const unverifiedOrders = await OrderModel.find({ paymentStatus: "Need to be verified" }).sort({ createdAt: -1 });
        return res.json({
            status: true,
            orders: unverifiedOrders,
        });

    } catch (err) {
        console.error(err);
        return res.json({ status: false, msg: "Error fetching unverified orders." });
    }
};



exports.updatePaymentStatus = async (req, res) => {
    try {
        const { orderId, newStatus } = req.body;
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.json({ status: false, msg: "Order not found" });
        }
        order.paymentStatus = newStatus;
        if (newStatus === "Rejected") {
            order.orderStatus = "Rejected"
            const item = await ItemModel.findById(order.product.item_id);
            if (item) {
                item.quantity += order.product.quantity; 
                await item.save();
            }
        }
        await order.save();

        return res.json({ status: true, msg: "Payment status updated" });
    } catch (err) {
        return res.json({ status: false, msg: "Error updating status" });
    }
};





exports.getVerifications = async (req, res) => {
    try {
        const unverifiedOrders = await OrderModel.find({ paymentStatus: "Verified" }).sort({ createdAt: -1 });
        return res.json({
            status: true,
            orders: unverifiedOrders,
        });

    } catch (err) {
        console.error(err);
        return res.json({ status: false, msg: "Error fetching unverified orders." });
    }
};


exports.getRejections = async (req, res) => {
    try {
        const unverifiedOrders = await OrderModel.find({ paymentStatus: "Rejected" }).sort({ createdAt: -1 });
        return res.json({
            status: true,
            orders: unverifiedOrders,
        });

    } catch (err) {
        console.error(err);
        return res.json({ status: false, msg: "Error fetching unverified orders." });
    }
};