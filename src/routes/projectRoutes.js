const express = require("express");
const router = express.Router();

const pool = require("../config/db");

router.get("/", async (req, res) => {
    try {
        const result =
            await pool.query(`
    SELECT
      projects.*,
      customers.company_name
    FROM projects
    LEFT JOIN customers
    ON projects.customer_id =
       customers.id
  `);

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
            project_name,
            customer_id,
            status,
            dispatch_status,
            po_number,
            project_value,
        } = req.body;

        const result =
            await pool.query(
                `
        INSERT INTO projects
        (
          project_name,
          customer_id,
          status,
          dispatch_status,
          po_number,
          project_value
        )
        VALUES
        ($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,
                [
                    project_name,
                    customer_id,
                    status,
                    dispatch_status,
                    po_number,
                    project_value,
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


router.put("/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const {
            status,
            dispatch_status,
        } = req.body;

        const result =
            await pool.query(
                `
                UPDATE projects
                SET
                    status = $1,
                    dispatch_status = $2
                WHERE id = $3
                RETURNING *
                `,
                [
                    status,
                    dispatch_status,
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



router.get("/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const result =
            await pool.query(
                `
                SELECT
                    projects.*,
                    customers.company_name
                FROM projects
                LEFT JOIN customers
                ON projects.customer_id =
                   customers.id
                WHERE projects.id = $1
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


router.delete("/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM projects
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message:
        "Project Deleted",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error",
    });

  }
});

module.exports = router;