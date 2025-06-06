
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET all admins
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM admins ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET admin by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM admins WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Admin not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE admin (registro)
router.post('/', async (req, res) => {
  const { first_name, last_name, username, password } = req.body;
  try {
    // Verifica si ya existe un admin con ese username
    const exists = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO admins (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, username, hashedPassword]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN admin
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE admin (requiere autenticación)
const authenticateToken = require('../middleware/auth');
router.put('/:id', authenticateToken, async (req, res) => {
  const { first_name, last_name, username, password } = req.body;
  try {
    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await pool.query(
      'UPDATE admins SET first_name=$1, last_name=$2, username=$3, password=$4 WHERE id=$5',
      [first_name, last_name, username, hashedPassword, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;