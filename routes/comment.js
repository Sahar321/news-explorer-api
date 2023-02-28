const router = require('express').Router();
const { saveComment } = require('../controllers/comment');

router.post('/comment', saveComment);

module.exports = router;
