const fetch = require('cross-fetch');

const fetchNewsArticles = (req, res, next) => {
  const { q, pageSize } = req.query;
  const apiKey = 'c03fb549f9c1431b9166d7004ef0d5c3'; //todo: process.env.NEWS_API_KEY;
  const baseUrl = 'https://newsapi.org/v2/everything';

  fetch(
    `${baseUrl}?q=${q}&apiKey=${apiKey}&pageSize=${pageSize}&sortBy=popularity`
  )
    .then((response) => response.json())
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  fetchNewsArticles,
};
