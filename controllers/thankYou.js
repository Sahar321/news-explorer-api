/*eslint-disable*/
const ThankYou = require('../models/thankYou');
const ConflictError = require('../constant/errors/ConflictError');

const thankYou = (req, res, next) => {
  const { username, id } = req.body;
  const ownerId = req.user._id;

  ThankYou.findOne({ fromOwner: ownerId, toOwner: username, commentId: id })
    .then((existingThankYou) => {
      if (existingThankYou) {
        ThankYou.deleteOne({ _id: existingThankYou._id })
          .then((e) => {
            res.send({ message: 'Thank you deleted' });
          })
          .catch((err) => next(err));
      } else {
        const newThankYou = new ThankYou({
          fromOwner: ownerId,
          toOwner: username,
          commentId: id,
        });
        newThankYou
          .save()
          .then((db) => {
            res.send(db);
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
};

module.exports = {
  thankYou,
};
