const mongoose = require('mongoose');

const walkinSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  collegeName: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: false,
  },
  councillorName: {
    type: String,
    required: true,
  },
  projectTitle: {
    type: String,
    required: false,
  },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit mobile number!`
    },
  },
  status:{
    type: String,
    default:"not joined"
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Walkin = mongoose.model('Walkin', walkinSchema);

module.exports = Walkin;
