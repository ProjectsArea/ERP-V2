const mongoose = require('mongoose');

const projectAdmissionSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
  },
  projectName:{
    type: String,
    required: true,
  },
  projectCategory:{
    type: String,
    required: true,
  },
  studentName1: {
    type: String,
    required: true,
  },
  studentName2: {
    type: String,
  },
  phoneNumber1: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  phoneNumber2: {
    type: String,
    match: /^[0-9]{10}$/,
  },
  totalFees: {
    type: Number,
    required: true,
  },
  feesPaid: {
    type: Number,
    required: true,
  },
  guide1: {
    type: String,
    required: true,
  },
  guide2: {
    type: String,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Ongoing', 'Completed'],
  },
  councillor: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ProjectAdmission = mongoose.model('ProjectAdmission', projectAdmissionSchema);

module.exports = ProjectAdmission;
