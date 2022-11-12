const router = require('express').Router();
const { getAllArticles, createNewArticle, deleteArticleById } = require('../controllers/article');

router.get('/articles', getAllArticles);
router.post('/articles', createNewArticle);
router.delete('/articles/:articleId', deleteArticleById);

module.exports = router;
