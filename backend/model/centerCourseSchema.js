const mongoose = require('mongoose');

const centerCourseSchema = new mongoose.Schema({
  centerName: {
    type: String,
    required: true,
  },
  courses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      },
      centerFees: {
        type: Number,
        required: true,
      }
    }
  ]
});

const CenterCourse = mongoose.model('CenterCourse', centerCourseSchema);

module.exports = CenterCourse;
