const express = require('express');
const router = express.Router();
const pool = require('../db');


// GET all books
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET book by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET books by category
router.get('/category/:category_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books WHERE category_id = $1 ORDER BY id DESC', [req.params.category_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE book (protegido)
const authenticateToken = require('../middleware/auth');
router.post('/', authenticateToken, async (req, res) => {
  const { title, author, image, description, category_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO books (title, author, image, description, category_id) VALUES ($1, $2, $3, $4, $5)',
      [title, author, image, description, category_id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE book (protegido)
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, author, image, description, category_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE books SET title=$1, author=$2, image=$3, description=$4, category_id=$5 WHERE id=$6',
      [title, author, image, description, category_id, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE book (protegido)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
