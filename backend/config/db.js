const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'jules',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bitm_erp',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
