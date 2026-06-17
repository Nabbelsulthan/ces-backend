const express = require("express");
const router = express.Router();

const pool = require("../config/db");

router.get("/stats", async (req, res) => {
    try {

        const customers =
            await pool.query(
                "SELECT COUNT(*) FROM customers"
            );

        const projects =
            await pool.query(
                "SELECT COUNT(*) FROM projects"
            );

        const inProgress =
            await pool.query(
                `
        SELECT COUNT(*)
        FROM projects
        WHERE status != 'Delivered'
        `
            );

        const delivered =
            await pool.query(
                `
        SELECT COUNT(*)
        FROM projects
        WHERE status = 'Delivered'
        `
            );

        const dispatchPending =
            await pool.query(
                `
    SELECT COUNT(*)
    FROM projects
    WHERE dispatch_status != 'Delivered'
    `
            );

        res.json({
            customers:
                customers.rows[0].count,

            projects:
                projects.rows[0].count,

            inProgress:
                inProgress.rows[0].count,

            delivered:
                delivered.rows[0].count,

            dispatchPending:
                dispatchPending.rows[0].count,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });

    }
});

module.exports = router;