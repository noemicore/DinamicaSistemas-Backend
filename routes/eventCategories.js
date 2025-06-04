const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all event categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM event_categories ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE event category (protegido)
const authenticateToken = require('../middleware/auth');
router.post('/', authenticateToken, async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query(
      'INSERT INTO event_categories (name, description) VALUES ($1, $2)',
      [name, description]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE event category (protegido)
router.put('/:id', authenticateToken, async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query(
      'UPDATE event_categories SET name=$1, description=$2 WHERE id=$3',
      [name, description, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE event category (protegido)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM event_categories WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
