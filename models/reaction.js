const mongoose = require('mongoose');

const reactionSchema = mongoose.Schema(
  {
    reactionId: {
      type: String,
      enum: ['Love', 'Care', 'funny', 'Wow', 'Sad', 'Angry'],
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
/*   {
    // make owner and linkId a compound unique index
    unique: true,
    index: true,
    sparse: true,
  }, */
);

module.exports = mongoose.model('reaction', reactionSchema);
