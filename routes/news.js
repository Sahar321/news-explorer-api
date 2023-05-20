const router = require('express').Router();
const { validateNews } = require('../middleware/validationSchema');
const { combineNewsSources } = require('../controllers/news');

router.get('/news*', validateNews, combineNewsSources);
module.exports = router;
