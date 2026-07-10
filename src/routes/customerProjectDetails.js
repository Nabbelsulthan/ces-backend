// customer portal routes

const express = require("express");
const router = express.Router();

const pool = require("../config/db");

router.get("/:id", async (req, res) => {

    try {

        const projectId = req.params.id;

        const result =
            await pool.query(
                `
                SELECT
                    projects.*,
                    customers.company_name
                FROM projects
                LEFT JOIN customers
                ON customers.id = projects.customer_id
                WHERE projects.id = $1
                `,
                [projectId]
            );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Project not found"
            });

        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

module.exports = router;