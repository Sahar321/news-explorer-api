const mongoose = require('mongoose');

const reportedPost = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  link: {
    type: String,
    required: true,
    index: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('reportedPost', reportedPost);
