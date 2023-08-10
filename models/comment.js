const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  rating: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: false,
      },
    },
  ],
});

module.exports = mongoose.model('comment', commentSchema);
