const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const signin = require('./signin');
const signup = require('./signup');

router.all('/signin*', signin);
router.all('/signup*', signup);
router.all('/users*', users);
router.all('/articles*', articles);

router.all('*', (req, res, next) => {
  res.send('page not found');
});
module.exports = router;
