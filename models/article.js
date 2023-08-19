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

articleSchema.statics.getArticleMetrics = async function getArticleMetrics(links) {
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
        as: 'comments',
      },
    },
    {
      $lookup: {
        from: 'reactions',
        localField: 'link',
        foreignField: 'link',
        as: 'reactions',
      },
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
        commentsLength: { $size: '$comments' },
        reactionsCountByType: {
          $arrayToObject: {
            $map: {
              input: { $setUnion: ["$reactions.type"] },
              as: "rType",
              in: {
                k: "$$rType",
                v: {
                  $size: {
                    $filter: {
                      input: "$reactions",
                      as: "r",
                      cond: { $eq: ["$$r.type", "$$rType"] }
                    }
                  }
                }
              }
            }
          }
        }
      },
    },
  ]);
};

articleSchema.statics.findAllArticleDataByLink = async function findAllArticleDataByLink(
  linkId,
  ownerId
) {
  return await this.aggregate([
    // Stage 1: Match articles
    {
      $match: {
        link: linkId,
      },
    },

    // Stage 2: Lookup comments and reactions
    {
      $lookup: {
        from: 'comments',
        localField: 'link',
        foreignField: 'link',
        as: 'comments',
      },
    },
    {
      $lookup: {
        from: 'reactions',
        localField: 'link',
        foreignField: 'link',
        as: 'reactions',
      },
    },

    // Stage 3: Lookup users
    {
      $lookup: {
        from: 'users',
        localField: 'comments.owner',
        foreignField: '_id',
        as: 'comments_user',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'reactions.owner',
        foreignField: '_id',
        as: 'reactions_user',
      },
    },

    // Stage 4: Project fields
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
        isOwner: { $eq: ['$owner', ownerId] },

        comments: {
          $map: {
            input: { $slice: ['$comments', 50] }, // Limit to the first 200 comments
            as: 'c',
            in: {
              id: '$$c._id',
              text: '$$c.text',
              link: '$$c.link',
              date: '$$c.date',
              isOwner: { $eq: ['$$c.owner', ownerId] },
              rating: '$$c.rating',
              user: {
                $let: {
                  vars: {
                    userInfo: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$comments_user',
                            as: 'cu',
                            cond: { $eq: ['$$cu._id', '$$c.owner'] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    userId: '$$userInfo._id',
                    name: '$$userInfo.name',
                    avatar: '$$userInfo.avatar',
                  },
                },
              },
            },
          },
        },

        reactions: {
          $map: {
            input: { $slice: ['$reactions', 1000] }, // Limit to the first 200 reactions
            as: 'r',
            in: {
              id: '$$r._id',
              link: '$$r.link',
              type: '$$r.type',
              isOwner: { $eq: ['$$r.owner', ownerId] },
              user: {
                $let: {
                  vars: {
                    userInfo: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$reactions_user',
                            as: 'ru',
                            cond: { $eq: ['$$ru._id', '$$r.owner'] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    id: '$$userInfo._id',
                    name: '$$userInfo.name',
                    avatar: '$$userInfo.avatar',
                  },
                },
              },
            },
          },
        },
      },
    },
  ]);
};

/* articleSchema.statics.findALL = async function findALL() {
  try {
    const results = await this.aggregate([
      {
        $lookup: {
          from: 'articles',
          localField: 'link',
          foreignField: 'link',
          as: 'articles2',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'link',
          foreignField: 'link',
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'reactions',
          localField: 'link',
          foreignField: 'link',
          as: 'reactions',
        },
      },
    ]);

    if (results.length === 0) return [];
    const data = {
      articles: results,
      comments: results[0].comments,
      reactions: results[0].reactions,
    };
    return data;
  } catch (err) {
    console.log(err);
  }
}; */

module.exports = mongoose.model('article', articleSchema);
