const router = require('express').Router();
const { addArticleReaction } = require('../controllers/reaction');

// todo: addArticleReaction validation
router.post('/reaction', addArticleReaction);
module.exports = router;
