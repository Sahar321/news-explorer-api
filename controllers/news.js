/* eslint-disable*/
const fetch = require('cross-fetch');
const Reaction = require('../models/reaction');
const fetchNewsArticles = async (req, res, next) => {
  const newArray = [];
  let reactions;
  try {
    reactions = await Reaction.find({});
  } catch (err) {
    next(err);
  }
  const { q, pageSize } = req.query;
  const apiKey = '5dac586067ad4ee7b2797a379e910521'; // todo: process.env.NEWS_API_KEY;
  const baseUrl = 'https://newsapi.org/v2/everything';
  let times = 0;
  fetch(
    `${baseUrl}?q=${q}&apiKey=${apiKey}&pageSize=${pageSize}&sortBy=popularity`
  )
    .then((response) => response.json())
    .then((data) => {
      data.articles.map((article) => {
        const reaction = reactions.find((item) => item.link === article.url);
        reaction
          ? newArray.push({ ...article, reactionId: reaction.reactionId })
          : newArray.push(article);
      });

      res.send({
        articles: newArray,
        status: 'ok',
        totalResults: data.totalResults,
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  fetchNewsArticles,
};
