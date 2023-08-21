/*eslint-disable */
const mongoose = require('mongoose');

const reactionSchema = mongoose.Schema({
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
});

reactionSchema.statics.getArticleReactionSummary = async function (
  linkId,
  ownerId
) {
  const ownerIdAsObjectId = mongoose.Types.ObjectId(ownerId);

  const result = await this.aggregate([
    {
      $match: {
        link: linkId,
      },
    },
    {
      $facet: {
        reactionCountByType: [
          {
            $group: {
              _id: '$type',
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: null,
              countByType: {
                $push: {
                  k: '$_id',
                  v: '$count',
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              countByType: {
                $arrayToObject: '$countByType',
              },
            },
          },
        ],
        selectedOwnerReaction: [
          {
            $match: {
              owner: ownerIdAsObjectId,
            },
          },
        ],
      },
    },
  ]);

  // Extract data from the result.
  const reactionsInfo = {
    countByType: result[0]?.reactionCountByType[0]?.countByType || {},
    ownerReactionType: result[0]?.selectedOwnerReaction[0]?.type || null,
  };

  return reactionsInfo;
};

module.exports = mongoose.model('reaction', reactionSchema);
