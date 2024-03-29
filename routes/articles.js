const router = require('express').Router();
const { article } = require('../middleware/validationSchema');
const {
  getSavedArticles,
  createNewArticle,
  deleteArticleById,
} = require('../controllers/article');

router.get('/articles', getSavedArticles);
router.post('/articles', article.createNewArticle, createNewArticle);
router.delete('/articles/:articleId', article.articleId, deleteArticleById);

module.exports = router;
