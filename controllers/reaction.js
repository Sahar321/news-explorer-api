/*eslint-disable*/
const Reaction = require('../models/reaction');
const ConflictError = require('../constant/errors/ConflictError');
const removeReaction = (req, res, next) => {
  const ownerId = req.user._id;
  const { link } = req.body;
  Reaction.findOneAndDelete({ owner: ownerId, link })
    .then(async (db) => {
      const rx = await getReactionsByArticleId(link, ownerId);
      res.send(rx);
    })
}

const addArticleReaction = (req, res, next) => {
  const { type, date, link } = req.body;
  const ownerId = req.user._id;
  Reaction.findOneAndUpdate(
    { owner: ownerId, link },
    { type, link },
    { new: true, upsert: true }
  )
    .then(async (db) => {
  /*     console.log(db); */
      const { link, owner, type } = db;
      const isOwner = ownerId === owner.toString();
      const rx = await getReactionsByArticleId(link, ownerId);
/*       console.log(rx); */
      res.send(rx);
    })
    .catch((err) => next(err));
};
const getReactionsByArticleId = async (id, ownerId) => {
  try {
    const result = [];
    const arr = await Reaction.find({
      link: id,
    }).lean();

    arr.forEach((item) => {
      result.push({
        type: item.type,
        link: item.link,
        isOwner: item.owner.toString() === ownerId,
      });
    });

    return result;
  } catch (error) {
    return { error: error + 'getReactionsByArticleId' };
  }
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
  removeReaction,
};
