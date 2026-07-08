const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                username,
                password,
            } = req.body;

            const result =
                await pool.query(
                    `
          SELECT *
          FROM customers
          WHERE username = $1
          `,
                    [username]
                );

            if (
                result.rows.length === 0
            ) {

                return res
                    .status(401)
                    .json({
                        message:
                            "Invalid Credentials",
                    });

            }

            const customer =
                result.rows[0];

            const isMatch =
                await bcrypt.compare(
                    password,
                    customer.password
                );

            if (!isMatch) {

                return res
                    .status(401)
                    .json({
                        message:
                            "Invalid Credentials",
                    });

            }

            const token = jwt.sign(
                {
                    customerId: customer.id,
                    username: customer.username,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d",
                }
            );

            res.json({
                success: true,
                token,
                customerId: customer.id,
                companyName: customer.company_name,
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Server Error",
            });

        }

    }
);

module.exports = router;