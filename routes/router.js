const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
// USE .ALL - POST/GET SHOULD BE INSIDE
router.all('/users*', users);
router.all('/articles*', articles);

router.all('*', (req, res, next) => {
  res.send('page not found');
});
module.exports = router;
