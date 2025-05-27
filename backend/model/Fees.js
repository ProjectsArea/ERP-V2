const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const termSchema = new Schema({
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
  },
  termNumber: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  datePaid: {
    type: Date,
    required: true,
    default: Date.now
  },
  modeOfPayment: {
    type: String,
    required: true,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online Payment'] // Add more payment methods as needed
  }
}, {
  _id: false
});

const feesSchema = new Schema({
  IdNo: {
    type: String,
    required: true,
    trim: true
  },
  terms: [termSchema],
  nextTermDate: {
    type: Date,
    required: true
  },
  totalStatus: {
    type: String,
    enum: ['completed', 'pending']
  },
  center:{
    type: String,
    required:true
  }
}, {
  timestamps: true
});

const Fees = mongoose.model('Fees', feesSchema);

module.exports = Fees;
