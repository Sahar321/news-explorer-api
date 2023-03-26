/* eslint-disable*/
const NotFoundError = require('../constant/errors/NotFoundError');
const ForbiddenError = require('../constant/errors/ForbiddenError');
const Comment = require('../models/comment');
const saveComment = (req, res, next) => {
  const { link, text } = req.body;

  const owner = req.user._id;

  Comment.create({
    owner,
    text,
    link,
  })
    .then((savedComment) => {
      const { _id, date, link, owner, rating, text } = savedComment;
      const comment = {
        id: _id,
        date,
        link,
        owner,
        rating,
        text,
      };
      res.status(201).send(comment);
    })
    .catch((err) => next(err));
};


module.exports = {
  saveComment,
};
