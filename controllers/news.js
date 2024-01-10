/* eslint-disable*/
require('dotenv').config();
const fetch = require('cross-fetch');
const Article = require('../models/article');
const mongoose = require('mongoose');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');
const user = require('../models/user');
const fs = require('fs');
const moment = require('moment');
const handleMainError = require('../middleware/handleMainError');
function removeHtmlTagsWithRegex(input) {
  if (!input) return input;
  return input.replace(/<\/?[^>]+(>|$)/g, ' ');
}
const fetchNews = async (q) => {
  try {
    const baseUrl = 'https://newsApi.org/v2/top-headlines';
    const params = {
      apiKey: process.env.NEWS_API_KEY || '5dac586067ad4ee7b2797a379e910521',
      country: 'us',
      q: q,
    };
    const urlParams = new URLSearchParams(params).toString();
    const response = await fetch(`${baseUrl}?${urlParams}`);

    if (!response.ok) {
      throw new Error(
        `fetch News failed from newsApi.org is failed:${response.status} ${response.statusText}`
      );
    }
    return response.json();
  } catch (response) {
    throw new Error(response);
  }
};

const enrichSourceArticles = (enrichedArticles, sourceArticle, keyword) => {
  const enrichedMap = new Map(enrichedArticles.map((ea) => [ea.url, ea]));

  const processSourceArticle = ({
    title,
    publishedAt,
    source,
    url,
    urlToImage,
    description,
    text,
  }) => ({
    title,
    date: moment(publishedAt).format('HH:mm D/M/YY'),
    source: source.name,
    keyword,
    link: url,
    image: urlToImage,
    text: removeHtmlTagsWithRegex(description),
  });

  const processedArticles = sourceArticle.map((article) => {
    const enrichedArticle = enrichedMap.get(article.url);
    return enrichedArticle || processSourceArticle(article);
  });

  return processedArticles;
};

const combineNewsSources = async (req, res, next) => {
  try {
    const { q } = req.query;

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
