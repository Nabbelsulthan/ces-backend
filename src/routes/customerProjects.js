// customer portal routes




const express = require("express");
const router = express.Router();

const pool = require("../config/db");
// const authenticateCustomer = require("../middleware/authenticateCustomer");

router.get(
    "/",
    // authenticateCustomer,
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    `
                    SELECT
                        projects.*,
                        customers.company_name
                    FROM projects
                    LEFT JOIN customers
                    ON customers.id = projects.customer_id
                    WHERE projects.customer_id = $1
                    ORDER BY projects.id DESC
                    `,
                    [
                        req.customer.customerId,
                    ]
                );

            res.json(result.rows);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Server Error",
            });

        }

    }
);

module.exports = router;