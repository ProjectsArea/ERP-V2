const storeModel = require("../model/franchise/storeData");

exports.getStoreData = async (req, res) => {
    try {
        const items = await storeModel.find({}); // Fetch all documents
        return res.json({ status: true, data: items });
    } catch (err) {
        console.error("DataFetching error:", err);
        return res.status(500).json({ status: false, msg: "Error in fetching data" });
    }
};

exports.updateStoreData = async (req, res) => {
    try {
        const { id, updates } = req.body;
        const updateQuery = {};

        // Construct nested update paths
        for (const key in updates) {
            if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
                for (const month in updates[key]) {
                    updateQuery[`${key}.${month}`] = updates[key][month];
                }
            } else {
                updateQuery[key] = updates[key];
            }
        }

        const updated = await storeModel.findByIdAndUpdate(id, { $set: updateQuery }, { new: true });
        res.json({ status: true, msg: 'Update successful', data: updated });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ status: false, msg: 'Update failed' });
    }
}
