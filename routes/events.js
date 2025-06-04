const express = require('express');
const router = express.Router();
const pool = require('../db');


// GET all events
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET events by category (debe ir antes que :id)
router.get('/category/:category_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE category_id = $1 ORDER BY date DESC', [req.params.category_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET event by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE event (protegido)
const authenticateToken = require('../middleware/auth');
router.post('/', authenticateToken, async (req, res) => {
  const { title, date, speaker, category_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO events (title, date, speaker, category_id) VALUES ($1, $2, $3, $4)',
      [title, date, speaker, category_id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE event (protegido)
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, date, speaker, category_id } = req.body;
  try {
    await pool.query(
      'UPDATE events SET title=$1, date=$2, speaker=$3, category_id=$4 WHERE id=$5',
      [title, date, speaker, category_id, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE event (protegido)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
