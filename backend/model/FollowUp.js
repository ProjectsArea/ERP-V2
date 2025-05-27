const mongoose = require('mongoose');
const { Schema } = mongoose;

const remarkSchema = new Schema({
  followUpDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  nextFollowUpDate: {
    type: Date,
    required: true
  },
  remainderStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const followUpSchema = new Schema({
  enquiryId: {
    type: Schema.Types.ObjectId,
    index: true,
    unique: true,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentContact: {
    type: String,
    required: true
  },
  courseInquired: {
    type: String,
    required: true
  },
  remarks: [remarkSchema],
  status: {
    type: String,
    enum: ['active', 'inactive', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

const FollowUp = mongoose.model('FollowUp', followUpSchema);

module.exports = {
  FollowUp
};
