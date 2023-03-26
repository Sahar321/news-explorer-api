const router = require('express').Router();
const { article } = require('../middleware/validationSchema');
const {
  getSavedArticles,
  createNewArticle,
  deleteArticleById,
  getAllArticleReaction,
  getAllArticleComments,
} = require('../controllers/article');

router.get('/articles', getSavedArticles);
router.get('/articles/:articleId/comments', getAllArticleComments);
router.get('/articles/:articleId/reactions', getAllArticleReaction);
router.post('/articles', article.createNewArticle, createNewArticle);
router.delete('/articles/:articleId', article.articleId, deleteArticleById);

module.exports = router;
