const router = require('express').Router();

const test = (req, res, next) => {
  res.send('hello');
};
router.get('/users', test);
module.exports = router;
