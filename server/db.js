const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "ale",
  password: process.env.PASSWORD,
  host: "localhost",
  port: 5432,
  database: "todoappbrief",
});

module.exports = pool;
