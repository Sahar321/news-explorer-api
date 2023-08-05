/* eslint-disable*/
const fetch = require('cross-fetch');
const Article = require('../models/article');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');
const moment = require('moment');
function removeHtmlTagsWithRegex(input) {
  return input.replace(/<\/?[^>]+(>|$)/g, ' ');
}
const fetchNews = async (q) => {
  try {
    const pageSize = 100;
    const apiKey = '5dac586067ad4ee7b2797a379e910521'; // todo: process.env.NEWS_API_KEY;
    const baseUrl = 'https://newsapi.org/v2/everything';
    const response = await fetch(
      `${baseUrl}?q=${q}&apiKey=${apiKey}&pageSize=${pageSize}&sortBy=popularity`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch news articles: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  } catch (err) {}
};

const combineNewsSources = async (req, res, next) => {
  try {
    const { q } = req.query;
    const newsData = await fetchNews(q);
    const ownerId = req.user?._id
    const newItem = newsData.articles.map((article) => {
      const newArticle = {
        keyword: q,
        isBookmarked: false,
        comments: [],
        reaction: [],
        title: article.title,
        date: moment(article.publishedAt).format('HH:mm D/M/YY'),
        source: article.source.name,
        link: article.url,
        image: article.urlToImage,
        description: removeHtmlTagsWithRegex(article.description),
      };
      return newArticle;
    });
    if (!ownerId) {
      res.send({
        articles: newItem,
        status: 'ok',
        totalResults: newsData.totalResults,
      });
      return;
    }

    const articles = await Article.find({});
    const comments = await Comment.find({});
    const reactions = await Reaction.find({});

    const newArray = newsData.articles.map((article) => {
      const reaction = reactions.filter((item) => item.link === article.url);
      const comment = comments.filter((item) => item.link === article.url);
      const isBookmarked = articles.some((item) => item.link === article.url);
      const newArticle = {
        keyword: q,
        isBookmarked: isBookmarked,
        comments: [],
        reaction: [],
        title: article.title,
        date: moment(article.publishedAt).format('HH:mm D/M/YY'),
        source: article.source.name,
        link: article.url,
        image: article.urlToImage,
        description: removeHtmlTagsWithRegex(article.description),
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
    const az = {
      articles: newArray,
      status: 'ok',
      totalResults: newsData.totalResults,
    };
    res.send({
      articles: newArray,
      status: 'ok',
      totalResults: newsData.totalResults,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  combineNewsSources,
};
