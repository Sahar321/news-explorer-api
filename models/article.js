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
    validates: {
      validator: (url) => isURL(url),
      message: 'Invalid URL',
    },
  },
  image: {
    type: String,
    required: true,
    validates: {
      validator: (url) => isURL(url),
      message: 'Invalid URL',
    },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
});

module.exports = mongoose.model('article', articleSchema);
