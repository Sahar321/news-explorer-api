const router = require('express').Router();
const {
  addReactionToArticle,
  removeReaction,
} = require('../controllers/reaction');

// todo: addArticleReaction validation
router.post('/reaction', addReactionToArticle);
router.delete('/reaction', removeReaction);
module.exports = router;
