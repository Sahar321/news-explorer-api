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
  description: {
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
