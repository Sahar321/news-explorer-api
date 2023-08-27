const router = require('express').Router();
const { signin } = require('../middleware/validationSchema');
const { login, loginWithGoogle, loginWithFacebook } = require('../controllers/users');

router.post('/signin', signin, login);
router.post('/signin/google', loginWithGoogle);
router.post('/signin/facebook', loginWithFacebook);

module.exports = router;
