const router = require('express').Router();
const {
  addArticleReaction,
  removeReaction,
} = require('../controllers/reaction');

// todo: addArticleReaction validation
router.post('/reaction', addArticleReaction);
router.delete('/reaction', removeReaction);
module.exports = router;
