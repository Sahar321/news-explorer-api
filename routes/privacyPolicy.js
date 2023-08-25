/*eslint-disable*/
const router = require('express').Router();
const fs = require('fs');
const privacyPolicy = (req, res, next) => {
  // read file
  fs.readFile('./privacy-policy.txt', 'utf8', (err, data) => {
    if (err) {
   next(err);
    }
    // send file
    res.send(data);
  });
};

router.get('/privacy-policy*', privacyPolicy);
module.exports = router;
