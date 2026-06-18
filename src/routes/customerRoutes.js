const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const bcrypt =
  require("bcrypt");

router.get("/", async (req, res) => {
  try {

    const result =
      await pool.query(
        `
        SELECT
          id,
          company_name,
          contact_person,
          email,
          phone,
          username
        FROM customers
        `
      );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
});
router.post("/", async (req, res) => {
  try {
    const {
      company_name,
      contact_person,
      email,
      phone,
      username,
      password,
    } = req.body;
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );
    const result =
      await pool.query(
        `
        INSERT INTO customers
        (
          company_name,
          contact_person,
          email,
          phone,
          username,
          password
        )
        VALUES
        ($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,
        [
          company_name,
          contact_person,
          email,
          phone,
          username,
          hashedPassword,
        ]
      );

    res.status(201).json(
      result.rows[0]
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const result =
      await pool.query(
        `
               SELECT
  id,
  company_name,
  contact_person,
  email,
phone,
  username
FROM customers
WHERE id = $1
                `,
        [id]
      );

    res.json(
      result.rows[0]
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


router.get("/:id/projects", async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM projects
      WHERE customer_id = $1
      `,
      [id]
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      company_name,
      contact_person,
      email,
      phone,
      username,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE customers
      SET
        company_name = $1,
        contact_person = $2,
        email = $3,
        phone = $4,
        username = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        company_name,
        contact_person,
        email,
        phone,
        username,
        id,
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;