const mongoose = require('mongoose');

const reactionSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['LOL', 'WOW', 'LIKE', 'SAD', 'LOVE'],
      required: true,
    },
    date: {
      type: String,
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
  },

);

module.exports = mongoose.model('reaction', reactionSchema);
