// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "thippusulthan",
//   host: "localhost",
//   database: "ces_portal",
//   password: "",
//   port: 5432,
// });

// module.exports = pool;



const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;