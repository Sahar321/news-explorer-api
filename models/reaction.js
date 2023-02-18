const mongoose = require('mongoose');

const reactionSchema = mongoose.Schema({
  reaction: {
    type: String,
    enum: ['Love', 'Care', 'funny', 'Wow', 'Sad', 'Angry'],
    required: true,
  },
  date: {
    type: String,
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'article',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('reaction', reactionSchema);
