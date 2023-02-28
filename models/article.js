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

articleSchema.statics.findALL = async function findALL() {
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
};

module.exports = mongoose.model('article', articleSchema);
/* articleSchema.statics.findByLink = async function findByLink(LinkVal) {
  try {
    const results = await this.aggregate([
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
};

module.exports = mongoose.model('article', articleSchema);*/
/*
articleSchema.statics.findByLink = function findByLink() {
  const aggregate = [

    {
      $lookup: {
        from: 'comments', // collection to join with
        localField: 'link', // field from the 'articles' collection
        foreignField: 'link', // field from the 'posts' collection
        as: 'comments', // alias for the joined collection
      },
    },
    {
      $lookup: {
        from: 'reactions', // collection to join with
        localField: 'link', // field from the 'articles' collection
        foreignField: 'link', // field from the 'reactions' collection
        as: 'reactions', // alias for the joined collection
      },
    },
    {
      $group: {
        _id: '$_id',
        articles: {
          $addToSet: {
            id: '$_id',
            keyword: '$keyword',
            title: '$title',
            text: '$text',
            date: '$date',
            source: '$source',
            link: '$link',
            image: '$image',
            owner: '$owner',
          },
        },
        comments: {
          $addToSet: {
            id: '$comments._id',
            text: '$comments.text',
            date: '$comments.date',
            link: '$comments.link',
            owner: '$comments.owner',
            rating: '$comments.rating',
          },
        },
        reactions: {
          $addToSet: {
            id: '$reactions._id',
            reactionId: '$reactions.reactionId',
            date: '$reactions.date',
            link: '$reactions.link',
            owner: '$reactions.owner',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        articles: { $arrayElemAt: ['$articles', 0] },
        comments: 1,
        reactions: 1,
      },
    },
  ];

  return this.aggregate(aggregate)
    .exec()
    .then((result) => {
      if (result.length === 0) {
        return null;
      }
      return result[0];
    });
};*/

/* module.exports = mongoose.model('article', articleSchema);
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

articleSchema.statics.findByLink = function findByLink() {
  const aggregate = [

    {
      $lookup: {
        from: 'posts', // collection to join with
        localField: 'link', // field from the 'articles' collection
        foreignField: 'linkId', // field from the 'posts' collection
        as: 'posts', // alias for the joined collection
      },
    },
    {
      $lookup: {
        from: 'reactions', // collection to join with
        localField: 'link', // field from the 'articles' collection
        foreignField: 'linkId', // field from the 'reactions' collection
        as: 'reactions', // alias for the joined collection
      },
    },
    {
      $unwind: {
        path: '$posts', // field to unwind
        preserveNullAndEmptyArrays: true, // preserve documents that do not have a related post
      },
    },
    {
      $unwind: {
        path: '$reactions', // field to unwind
        preserveNullAndEmptyArrays: true, // preserve documents that do not have a related reaction
      },
    },
    // Sixth $group stage to group the documents by the 'link' field and aggregate related fields
    {
      $group: {
        _id: '$link', // field to group by
        articles: {
          $addToSet: { // add the article fields to the 'articles' array
            id: '$_id',
            keyword: '$keyword',
            title: '$title',
            text: '$text',
            date: '$date',
            source: '$source',
            link: '$link',
            image: '$image',
            owner: '$owner',
          },
        },
        posts: {
          $addToSet: { // add the post fields to the 'posts' array
            id: '$posts._id',
            text: '$posts.text',
            date: '$posts.date',
            linkId: '$posts.linkId',
            owner: '$posts.owner',
            rating: '$posts.rating',
          },
        },
        reactions: {
          $addToSet: { // add the reaction fields to the 'reactions' array
            id: '$reactions._id',
            reactionId: '$reactions.reactionId',
            date: '$reactions.date',
            linkId: '$reactions.linkId',
            owner: '$reactions.owner',
          },
        },
      },
    },
  ];

  return this.aggregate(aggregate).exec();
};

module.exports = mongoose.model('article', articleSchema);
*/
