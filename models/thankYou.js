const mongoose = require('mongoose');

const thankYouSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
      trim: true,
    },
    fromOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
    toOwner: {
      type: String,
      ref: 'User',
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('thankYou', thankYouSchema);
