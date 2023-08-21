/* eslint-disable*/
const Reaction = require('../models/reaction');

async function sendReactionSummary(req, res, next, link, ownerId) {
  try {
    const articleReactionSummary = await Reaction.getArticleReactionSummary(
      link,
      ownerId
    );
    res.status(200).send(articleReactionSummary);
  } catch (error) {
    next(error);
  }
}

const removeReaction = async (req, res, next) => {
  const ownerId = req.user._id;
  const { link } = req.body;

  try {
    await Reaction.findOneAndDelete({ owner: ownerId, link });
    sendReactionSummary(req, res, next, link, ownerId);
  } catch (err) {
    next(err);
  }
};

const addReactionToArticle = async (req, res, next) => {
  const { type, link } = req.body;
  const ownerId = req.user._id;

  try {
    await Reaction.findOneAndUpdate(
      { owner: ownerId, link },
      { type, link },
      { new: true, upsert: true }
    );
    sendReactionSummary(req, res, next, link, ownerId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addReactionToArticle,
  removeReaction,
};
