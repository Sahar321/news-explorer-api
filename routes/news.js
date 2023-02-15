const router = require('express').Router();
const { validateNews } = require('../middleware/validationSchema');
const { fetchNewsArticles } = require('../controllers/news');

router.get('/news*', validateNews, fetchNewsArticles);
module.exports = router;
