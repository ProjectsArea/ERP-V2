const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  completedPercentage: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  supportRequired: { 
    type: String, 
    required: true,
    trim: true
  },
  anyProblems: { 
    type: String, 
    required: true,
    trim: true
  },
  estimatedDateToComplete: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Estimated completion date must be in the future'
    }
  },
  date: { 
    type: Date, 
    default: Date.now,
    required: true
  },
  dockerPullLink: { 
    type: String, 
    trim: true,
    default: ''
  },
  dockerRunCommand: { 
    type: String, 
    trim: true,
    default: ''
  },
  githubLink: { 
    type: String, 
    trim: true,
    default: ''
  },
  documentationLink: { 
    type: String, 
    trim: true,
    default: ''
  }
}, { 
  _id: false,
  timestamps: true 
});

const projectStatusSchema = new mongoose.Schema({
  projectId: { 
    type: String, 
    required: true,
    unique: true
  },
  statusList: {
    type: [statusSchema],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Status list cannot be empty'
    }
  }
}, {
  timestamps: true
});

// Add method to get latest status
projectStatusSchema.methods.getLatestStatus = function() {
  return this.statusList[this.statusList.length - 1];
};

// Add method to add new status
projectStatusSchema.methods.addStatus = function(status) {
  this.statusList.push(status);
  return this.save();
};

const ProjectStatus = mongoose.model('ProjectStatus', projectStatusSchema);

module.exports = ProjectStatus;
