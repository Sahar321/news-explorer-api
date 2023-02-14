const router = require('express').Router();
const { signin } = require('../middleware/validationSchema');
const { login, loginWithGoogle } = require('../controllers/users');

router.post('/signin', signin, login);
router.post('/signin/google', loginWithGoogle);

module.exports = router;
