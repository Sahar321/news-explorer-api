/* eslint-disable*/
const fetch = require('cross-fetch');
const Article = require('../models/article');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');

const fetchNewsArticles = async (req, res, next) => {
  try {
    const { q, pageSize } = req.query;
    const apiKey = '5dac586067ad4ee7b2797a379e910521'; // todo: process.env.NEWS_API_KEY;
    const baseUrl = 'https://newsapi.org/v2/everything';

    const articles = await Article.find({});
    const comments = await Comment.find({});
    const reactions = await Reaction.find({});

    const response = await fetch(
      `${baseUrl}?q=${q}&apiKey=${apiKey}&pageSize=${pageSize}&sortBy=popularity`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch news articles: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const ownerId = req.user._id || null;
    const newArray = data.articles.map((article) => {
      const reaction = reactions.filter((item) => item.link === article.url);
      const comment = comments.filter((item) => item.link === article.url);
      const isBookmarked = articles.some((item) => item.link === article.url);
      const newArticle = {
        keyword: q,
        isBookmarked: isBookmarked,
        comments: [],
        reaction: [],
        title: article.title,
        text: article.content,
        date: article.publishedAt,
        source: article.source.name,
        link: article.url,
        image: article.urlToImage,
        description: article.description,
      };

      if (reaction.length > 0) {
        newArticle.reaction = reaction.map(
          ({ reactionId, date, link, owner }) => {
            const isOwner = ownerId === owner.toString();
            return { reactionId, date, link, isOwner: isOwner };
          }
        );
      }

      if (comment.length > 0) {
        newArticle.comments = comment.map(
          ({ text, date, link, rating, owner }) => {
            const isOwner = ownerId === owner.toString();
            return { text, date, link, rating, owner: isOwner };
          }
        );
      }

      return newArticle;
    });


    res.send({
      articles: newArray,
      status: 'ok',
      totalResults: data.totalResults,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  fetchNewsArticles,
};

/* const fetchNewsArticles = async (req, res, next) => {

  try {
    const { q, pageSize } = req.query;
    const apiKey = '5dac586067ad4ee7b2797a379e910521'; // todo: process.env.NEWS_API_KEY;
    const baseUrl = 'https://newsapi.org/v2/everything';

    const dataDb = await Article.findALL()/* .orFail(() => {
      throw new NotFoundError('Not found Articles');
    });

    const { articles=[], comments=[], reactions=[] } = dataDb;

    const response = await fetch(`${baseUrl}?q=${q}&apiKey=${apiKey}&pageSize=${pageSize}&sortBy=popularity`);

    if (!response.ok) {
      throw new Error(`Failed to fetch news articles: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const newArray = data.articles.map((article) => {
      const reaction = reactions.filter((item) => item.link === article.url);
      const comment = comments.filter((item) => item.link === article.url);
      const newArticle = { ...article };
      if (reaction.length > 0) {
        newArticle.reaction = reaction;
        const ownerId = req.user._id || null;
        if (ownerId === reaction.owner){
          console.log(yes);
        }
      }
      if (comment) {
        newArticle.comments = comment;
      }
      return newArticle;
    });
    console.log(newArray);
    res.send({
      articles: newArray,
      status: 'ok',
      totalResults: data.totalResults,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  fetchNewsArticles,
}; */

/* eslint-disable*/
/* const fetch = require('cross-fetch');
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
}; */
