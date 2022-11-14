const router = require('express').Router();
const { signin } = require('../constant/validationSchema');
const { login } = require('../controllers/users');

router.post('/signin', signin, login);

module.exports = router;
