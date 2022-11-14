const router = require('express').Router();
const { article } = require('../middleware/validationSchema');
const {
  getAllArticles,
  createNewArticle,
  deleteArticleById,
} = require('../controllers/article');

router.get('/articles', getAllArticles);
router.post('/articles', article.createNewArticle, createNewArticle);
router.delete('/articles/:articleId', article.articleId, deleteArticleById);

module.exports = router;
