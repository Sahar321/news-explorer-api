const router = require('express').Router();
const { updateAvatar } = require('../controllers/users');

router.post('/profile/avatar', updateAvatar);
module.exports = router;
