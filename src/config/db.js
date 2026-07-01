// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "thippusulthan",
//   host: "localhost",
//   database: "ces_portal",
//   password: "",
//   port: 5432,
// });

// module.exports = pool;



// const { Pool } = require("pg");

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// module.exports = pool;


const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", async (client) => {
  await client.query("SET search_path TO public");
});

module.exports = pool;