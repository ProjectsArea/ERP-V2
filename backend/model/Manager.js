const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const managerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  center: {
    type: String,
    required: true,
    enum: ['DWK', 'MVP'],
  },
}, {
  timestamps: true
});

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;
