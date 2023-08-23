/*eslint-disable*/
const { isURL } = require('validator');
const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    index: true,
    validate: {
      validator: (url) => isURL(url),
      message: (props) => `${props.value} is not a valid link`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => isURL(url),
      message: (props) => `${props.value} is not a valid image link`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

articleSchema.statics.getArticleMetrics = async function getArticleMetrics(links, ownerId) {
  return await this.aggregate([
    // Stage 1: Match articles
    {
      $match: {
        link: { $in: links },
      },
    },

    // Stage 2: Lookup comments and reactions
    {
      $lookup: {
        from: 'comments',
        localField: 'link',
        foreignField: 'link',
        as: 'commentsArray',  // <-- modified here
      },
    },
    {
      $lookup: {
        from: 'reactions',
        localField: 'link',
        foreignField: 'link',
        as: 'reactionsArray',  // <-- modified here
      },
    },

    // Filter reactions to find the one that matches both link and ownerId
    {
      $addFields: {
        matchedReaction: {
          $filter: {
            input: '$reactionsArray',  // <-- modified here
            as: 'reaction',
            cond: {
              $and: [
                { $eq: [ownerId, '$$reaction.owner'] },
                { $eq: ['$link', '$$reaction.link'] }
              ]
            }
          }
        }
      }
    },

    // Stage 3: Count the number of comments and group reactions by type
    {
      $project: {
        _id: 0,
        keyword: '$keyword',
        title: '$title',
        text: '$text',
        date: '$date',
        source: '$source',
        link: '$link',
        image: '$image',
        comments: {
          count: { $size: '$commentsArray' }  // <-- modified here
        },
        reactions: {
          countByType: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: ["$reactionsArray.type"] },  // <-- modified here
                as: "rType",
                in: {
                  k: "$$rType",
                  v: {
                    $size: {
                      $filter: {
                        input: "$reactionsArray",  // <-- modified here
                        as: "r",
                        cond: { $eq: ["$$r.type", "$$rType"] }
                      }
                    }
                  }
                }
              }
            }
          },
          ownerReactionType: { $arrayElemAt: ['$matchedReaction.type', 0] }
        }
      },
    },

  ]);
};



module.exports = mongoose.model('article', articleSchema);
