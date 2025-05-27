const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  courseFees: {
    type: Number,
    required: true,
  },
  courseDuration: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  category:{
    type: String,
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
