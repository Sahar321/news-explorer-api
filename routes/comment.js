const router = require('express').Router();
const { saveComment } = require('../controllers/comment');
const { thankYou } = require('../controllers/thankYou');

router.post('/comment', saveComment);
router.post('/comment/thank-you', thankYou);

module.exports = router;
