const express = require("express");
const router = express.Router();

const pool =
    require("../config/db");

const bcrypt =
    require("bcrypt");


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
          FROM admins
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

            const admin =
                result.rows[0];

            const isMatch =
                await bcrypt.compare(
                    password,
                    admin.password
                );

            if (!isMatch) {

                return res
                    .status(401)
                    .json({
                        message:
                            "Invalid Credentials",
                    });

            }

            res.json({
                success: true,
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