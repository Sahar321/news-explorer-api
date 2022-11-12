const router = require('express').Router();
const { registerNewUser } = require('../controllers/users');

router.post('/signup', registerNewUser);
module.exports = router;
