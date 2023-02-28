/*eslint-disable*/
const Reaction = require('../models/reaction');
const ConflictError = require('../constant/errors/ConflictError');
const addArticleReaction = (req, res, next) => {
  const { reactionId, date, link } = req.body;
  const owner = req.user._id;
  Reaction.findOneAndUpdate(
    { owner, link },
    { reactionId,  link },
    { new: true,upsert: true }
  )
    .then((db) => {
      res.send(db);
    })
    .catch((err) => next(err));
};

/*   Reaction.findOne({ owner, link })
    .then((db) => {
      if (db) {
        Reaction.deleteOne({ owner, link })
          .then(() => {
            Reaction.create({
              reactionId,
              date,
              articleId,
              owner,
            })
              .then((db) => {
                res.send({ db });
              })
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
}; */

module.exports = {
  addArticleReaction,
};
