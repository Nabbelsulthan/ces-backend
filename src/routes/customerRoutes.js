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
  }
  catch (error) {

    console.error(
      "CUSTOMER INSERT ERROR:",
      error
    );

    if (
      error.code === "23505"
    ) {

      return res.status(400).json({
        message:
          "Username already exists. Please choose another username."
      });

    }

    res.status(500).json({
      message: "Server Error",
    });

  }

});

router.get(
  "/check-username/:username",
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT id
          FROM customers
          WHERE username = $1
          `,
          [req.params.username]
        );

      res.json({
        exists:
          result.rows.length > 0
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  }
);

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



router.get("/:id/stats", async (req, res) => {

  try {

    const { id } = req.params;

    const documents =
      await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM documents d
        JOIN projects p
        ON d.project_id = p.id
        WHERE p.customer_id = $1
        `,
        [id]
      );

    const updates =
      await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM project_updates u
        JOIN projects p
        ON u.project_id = p.id
        WHERE p.customer_id = $1
        `,
        [id]
      );

    res.json({
      documents:
        documents.rows[0].total,

      updates:
        updates.rows[0].total,
    });

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



// reset password 

router.put("/:id/reset-password", async (req, res) => {

  try {

    const { id } = req.params;

    const { password } = req.body;

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    await pool.query(
      `
      UPDATE customers
      SET password = $1
      WHERE id = $2
      `,
      [
        hashedPassword,
        id
      ]
    );

    res.json({
      message:
        "Password reset successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

});


// delete customer 


router.delete("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const projectCheck =
      await pool.query(
        `
        SELECT id
        FROM projects
        WHERE customer_id = $1
        LIMIT 1
        `,
        [id]
      );

    if (
      projectCheck.rows.length > 0
    ) {

      return res.status(400).json({
        message:
          "Cannot delete customer with active projects"
      });

    }

    await pool.query(
      `
      DELETE FROM customers
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message:
        "Customer deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }

});
module.exports = router;