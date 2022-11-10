const router = require('express').Router();

const getUserSavedArticles = () => {

};
const createArticle = () => {

};

const deleteUserArticle = () => {

};

router.get('/articles', getUserSavedArticles);
router.post('/articles', createArticle);
router.delete('/articles/:articleId', deleteUserArticle);

module.exports = router;
