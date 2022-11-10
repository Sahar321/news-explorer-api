const router = require('express').Router();

const getUserInfo = (req, res, next) => {
};
router.get('/users/me', getUserInfo);
module.exports = router;
