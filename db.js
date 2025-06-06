require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'postgres',
  password: process.env.PGPASSWORD || '123456',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5433,
});

module.exports = pool;
