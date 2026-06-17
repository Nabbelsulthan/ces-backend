const { Pool } = require("pg");

const pool = new Pool({
  user: "thippusulthan",
  host: "localhost",
  database: "ces_portal",
  password: "",
  port: 5432,
});

module.exports = pool;