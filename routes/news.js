const express = require('express');
const router = express.Router();
const axios = require('axios');
const { NEWS_API_KEY } = require('../newsapi.config');


// GET all news (dinámico desde NewsAPI)
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'tecnología OR avances tecnológicos OR innovación tecnológica OR inteligencia artificial OR ciencia de datos OR computación OR software OR hardware OR robótica OR internet OR informática OR tecnología médica OR tecnología educativa OR tecnología ambiental OR blockchain OR ciberseguridad OR big data OR cloud computing OR realidad virtual OR realidad aumentada OR IoT OR impresión 3D OR machine learning OR deep learning OR simulación OR simulation',
        language: 'es',
        sortBy: 'publishedAt',
        pageSize: 5,
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
