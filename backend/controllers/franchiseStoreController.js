const storeModel = require("../model/franchise/storeData");

exports.getStoreData = async (req, res) => {
    try {
        const items = await storeModel.find({});
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

        // Construct dynamic update query for month-year support
        for (const key in updates) {
            if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
                for (const monthYearKey in updates[key]) {
                    updateQuery[`${key}.${monthYearKey}`] = updates[key][monthYearKey];
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
};



exports.addStoreData = async (req, res) => {
    try {
        const {
            CenterName,
            BranchHeadName,
            ContactNumber,
            FranchiseName,
            MonthlyData,
            TotalAmountDue,
        } = req.body;

        // Validate required fields
        if (!CenterName || !BranchHeadName || !ContactNumber || !FranchiseName || !MonthlyData) {
            return res.json({
                status: false,
                message: "Missing required fields",
            });
        }

        // Prepare individual mappings
        const MonthWiseRevenueGenerated = {};
        const MonthWiseAmountCollected = {};
        const RoyaltyMonthWise = {};
        const AmountReceivedMonthWise = {};
        const CertificatesIssued = {};

        for (const [key, value] of Object.entries(MonthlyData)) {
            MonthWiseRevenueGenerated[key] = value.Revenue || 0;
            MonthWiseAmountCollected[key] = value.Collected || 0;
            RoyaltyMonthWise[key] = value.Royalty || 0;
            AmountReceivedMonthWise[key] = value.Received || 0;
            CertificatesIssued[key] = value.Certificates || 0;
        }

        // Create and save new store entry
        const newStore = new storeModel({
            CenterName,
            BranchHeadName,
            ContactNumber,
            FranchiseName,
            MonthWiseRevenueGenerated,
            MonthWiseAmountCollected,
            RoyaltyMonthWise,
            AmountReceivedMonthWise,
            CertificateRequestPerMonth: CertificatesIssued,
            TotalAmountDue: TotalAmountDue || 0,
        });

        await newStore.save();

        return res.json({
            status: true,
            message: "Store data added successfully",
        });
    } catch (err) {
        console.error("Error adding store data:", err);
        return res.json({
            status: false,
            message: "Server error while adding store data",
        });
    }
};