const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const signin = require('./signin');
const signup = require('./signup');
const authorized = require('../middleware/auth');
const news = require('./news');

router.all('/signin*', signin);
router.all('/signup*', signup);
router.all('/users*', authorized, users);
router.all('/articles*', authorized, articles);
router.all('/news*', news);

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

router.all('*', authorized, (req, res, next) => {
  res.send('page not found');
});
module.exports = router;
