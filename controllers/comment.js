/* eslint-disable*/
const NotFoundError = require('../constant/errors/NotFoundError');
const ForbiddenError = require('../constant/errors/ForbiddenError');
const Comment = require('../models/comment');
const saveComment = (req, res, next) => {
  const { link, rating, text } = req.body;

  //const owner = req.user._id;
  const owner = '63eaacc81a60305077758ebb'; // testing

  Comment.create({
    owner,
    text,
    link,
    rating,
  })
    .then((savedComment) => {
      res.status(201).json({ message: savedComment });
    })
    .catch((err) => next(err));
};

module.exports = {
  saveComment,
};
