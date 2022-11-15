const router = require('express').Router();
const { signup } = require('../middleware/validationSchema');
const { registerNewUser } = require('../controllers/users');

router.post('/signup', signup, registerNewUser);
module.exports = router;
