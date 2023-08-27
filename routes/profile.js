const router = require('express').Router();
const { updateProfile } = require('../controllers/users');
const { getAllUserComments } = require('../controllers/comment');
const { profile } = require('../middleware/validationSchema');

router.post('/profile', profile, updateProfile);
router.get('/profile/comments', getAllUserComments);
module.exports = router;
