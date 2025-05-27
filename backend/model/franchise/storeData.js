const mongoose = require('mongoose');

const storeDataSchema = new mongoose.Schema({
    Jan: Number,
    Feb: Number,
    Mar: Number
}, { _id: false });

const centerReportSchema = new mongoose.Schema({
    CenterName: {
        type: String,
        required: true
    },
    MonthWiseRevenueGenerated: {
        type: storeDataSchema,
        required: true
    },
    MonthWiseAmountCollected: {
        type: storeDataSchema,
        required: true
    },
    RoyaltyMonthWise: {
        type: storeDataSchema,
        required: true
    },
    AmountReceivedMonthWise: {
        type: storeDataSchema,
        required: true
    },
    TotalAmountDue: {
        type: Number,
        required: true
    },
    CertificateRequestPerMonth: {
        type: storeDataSchema,
        required: true
    }
});


const storeModel = mongoose.model("reports", centerReportSchema);

module.exports = storeModel;