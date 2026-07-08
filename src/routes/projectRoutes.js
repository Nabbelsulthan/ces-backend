const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const authenticateCustomer = require("../middleware/authenticateCustomer");

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
            panel_type,
            project_engineer,
            completion_percentage,
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
  project_value,
  panel_type,
  project_engineer,
  completion_percentage
)
VALUES
($1,$2,$3,$4,$5,$6,$7,$8,$9)
RETURNING *
        `,
                [
                    project_name,
                    customer_id,
                    status,
                    dispatch_status,
                    po_number,
                    project_value,
                    panel_type,
                    project_engineer,
                    completion_percentage,
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
            project_name,
            po_number,
            project_value,
            start_date,
            expected_delivery,
            status,
            dispatch_status,
            transporter,
            lr_number,
            vehicle_number,
            dispatch_date,
            delivery_date,
            panel_type,
            project_engineer,
            completion_percentage,
        } = req.body;

        const result =
            await pool.query(
                `
                UPDATE projects
                SET
                    project_name = $1,
                    po_number = $2,
                    project_value = $3,
                    start_date = $4,
                    expected_delivery = $5,
                    status = $6,
                    dispatch_status = $7,
                    transporter = $8,
                    lr_number = $9,
                    vehicle_number = $10,
                    dispatch_date = $11,
                    delivery_date = $12,
                    panel_type = $13,
                    project_engineer = $14,
                    completion_percentage = $15
                WHERE id = $16
                RETURNING *
                `,
                [
                    project_name,
                    po_number,
                    project_value,
                    start_date,
                    expected_delivery,
                    status,
                    dispatch_status,
                    transporter,
                    lr_number,
                    vehicle_number,
                    dispatch_date,
                    delivery_date,
                    panel_type,
                    project_engineer,
                    completion_percentage,
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


router.get("/:id", authenticateCustomer, async (req, res) => {
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