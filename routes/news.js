const express = require('express');
const router = express.Router();
const axios = require('axios');
const { NEWS_API_KEY } = require('../newsapi.config');


// GET all news (dinámico desde NewsAPI)
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'dinámica de sistemas OR system dynamics OR tecnología OR technology',
        language: 'es',
        sortBy: 'publishedAt',
        pageSize: 10,
        apiKey: NEWS_API_KEY
      }
    });
    // Formatear solo los campos necesarios
    const news = response.data.articles.map(article => ({
      title: article.title,
      date: article.publishedAt,
      description: article.description,
      url: article.url,
      image: article.urlToImage,
      source: article.source.name
    }));
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
