/* eslint-disable*/
const fetch = require('cross-fetch');
const Article = require('../models/article');
const mongoose = require('mongoose');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');
const user = require('../models/user');
const fs = require('fs');
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

const enrichSourceArticles = (enrichedArticles, sourceArticle, keyword) => {
  const enrichedMap = new Map(
    enrichedArticles.map((ea) => {
      return [ea.link, ea];
    })
  );

  const processSourceArticle = (article) => ({
    title: article.title,
    date: moment(article.publishedAt).format('HH:mm D/M/YY'),
    source: article.source.name,
    keyword: keyword,
    link: article.url,
    image: article.urlToImage,
    text: removeHtmlTagsWithRegex(article.description),
  });

  return sourceArticle.map((article) => {
    const enrichedArticle = enrichedMap.get(article.url);
    if (enrichedArticle) {
      return enrichedArticle;
    }

    return processSourceArticle(article);
  });
};

const combineNewsSources = async (req, res, next) => {
  try {
    const { q } = req.query;
    // messure time:

    const newsData = await fetchNews(q);

    const links = newsData.articles.map((article) => article.url);
    const ownerId = req.user?._id;
    const ownerIdAsObjectId = mongoose.Types.ObjectId(ownerId);
    const test = await Article.getArticleMetrics(links, ownerIdAsObjectId);

    const tes = enrichSourceArticles(test, newsData.articles, q);

    res.send({
      articles: tes,
      status: 'ok',
      totalResults: newsData.totalResults,
    });

    /*     if (!ownerId) {
      res.send({
        articles: tes,
        status: 'ok',
        totalResults: newsData.totalResults,
      });
    } */
    /*     const newItem = newsData.articles.map((article) => {
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


    const articles = await Article.find({});
    const comments = await Comment.find({});
    const reactions = await Reaction.find({});

    const newArray = newsData.articles.map(async (article) => {
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
          async ({ text, date, link, rating, owner }) => {
            const { name, avatar } = await user.findById(owner);
            const isOwner = ownerId === owner.toString();
            return { name, avatar, text, date, link, rating, owner: isOwner };
          }
        );
      }

      return newArticle;
    });
    const result = await newArray;
    console.log(result);
    res.send({
      articles: result,
      status: 'ok',
      totalResults: newsData.totalResults,
    }); */
  } catch (err) {
    next(err);
  }
};

module.exports = {
  combineNewsSources,
};
