/* eslint-disable*/
const NotFoundError = require('../constant/errors/NotFoundError');
const ForbiddenError = require('../constant/errors/ForbiddenError');
const Comment = require('../models/comment');
const Article = require('../models/article');
const Users = require('../models/user');
const { getAllArticleComments } = require('../controllers/article');
const saveComment = (req, res, next) => {
  const { link, text } = req.body;

  const owner = req.user._id;

  Comment.create({
    owner,
    text,
    link,
  })
    .then((savedComment) => {
      getAllArticleComments(req, res, next);
    })
    .catch((err) => next(err));
};

const getAllUserComments = (req, res, next) => {
  const owner = req.user._id;

  Comment.find({
    owner,
  })
    .lean()
    .then((userComments) => {
      res.send(userComments);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
module.exports = {
  saveComment,
  getAllUserComments,
};
