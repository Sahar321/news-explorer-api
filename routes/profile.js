const router = require('express').Router();
const { updateProfile } = require('../controllers/users');
const { profile } = require('../middleware/validationSchema');

router.post('/profile', profile, updateProfile);
module.exports = router;
