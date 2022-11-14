const router = require('express').Router();
const { signup } = require('../constant/validationSchema');
const { registerNewUser } = require('../controllers/users');

router.post('/signup', signup, registerNewUser);
module.exports = router;
