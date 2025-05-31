const mongoose = require('mongoose');

const centerReportSchema = new mongoose.Schema({
    CenterName: {
        type: String,
        required: true
    },
    BranchHeadName: {
        type: String,
        required: true
    },
    ContactNumber: {
        type: String,
        required: true
    },
    FranchiseName: {
        type: String,
        required: true
    },
    MonthWiseRevenueGenerated: {
        type: Map,
        of: Number,
        required: true
    },
    MonthWiseAmountCollected: {
        type: Map,
        of: Number,
        required: true
    },
    RoyaltyMonthWise: {
        type: Map,
        of: Number,
        required: true
    },
    AmountReceivedMonthWise: {
        type: Map,
        of: Number,
        required: true
    },
    TotalAmountDue: {
        type: Number,
        required: true
    },
    CertificateRequestPerMonth: {
        type: Map,
        of: Number,
        required: true
    }
});

const storeModel = mongoose.model("reports", centerReportSchema);

module.exports = storeModel;
