const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  completedPercentage: { type: Number, required: true },
  supportRequired: { type: String, required: true },
  anyProblems: { type: String, required: true },
  estimatedDateToComplete: { type: Date, required: true },
  date: {
    type: Date,
    default: Date.now,
  },

}, { _id: false });

const projectStatusSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  statusList: [statusSchema],
});

const ProjectStatus = mongoose.model('ProjectStatus', projectStatusSchema);

module.exports = ProjectStatus;
