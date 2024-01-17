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

    const jsonResponse = await response.json();

    const filteredArticles = jsonResponse.articles.filter(
      (article) => article.title !== '[Removed]'
    );
    jsonResponse.articles = filteredArticles;

    return jsonResponse;
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
  } catch (err) {
    next(err);
  }
};

module.exports = {
  combineNewsSources,
};
