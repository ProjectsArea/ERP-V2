const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  IdNo: {
    type: String,
    unique: true,
    required: true
  },
  centerName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  image: {
    type: String,
  },
  address: {
    type: String,
    required: true
  },
  aadhar: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  others: {
    type: String,
  },
  courseEnrolled: {
    type: String,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true,
    default: Date.now,

  },
  totalFees: {
    type: Number,
    required: true
  },
  durationOfCourse: {
    type: String,
    required: true
  },
  feeDueDate: {
    type: Date,
    required: true
  },
  trainer: {
    type: String,
    required: true
  },
  timings: {
    type: String,
    required: true
  },
  counselorName: {
    type: String,
    required: true
  },
  remarks: {
    type: String,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Admission', admissionSchema);
