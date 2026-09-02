// const express = require("express");
// const router = express.Router();

// const jwt = require("jsonwebtoken");

// const pool =
//     require("../config/db");

// const bcrypt =
//     require("bcrypt");


// router.post(
//     "/login",
//     async (req, res) => {

//         try {

//             const {
//                 username,
//                 password,
//             } = req.body;

//             const result =
//                 await pool.query(
//                     `
//           SELECT *
//           FROM admins
//           WHERE username = $1
//           `,
//                     [username]
//                 );

//             if (
//                 result.rows.length === 0
//             ) {

//                 return res
//                     .status(401)
//                     .json({
//                         message:
//                             "Invalid Credentials",
//                     });

//             }

//             const admin =
//                 result.rows[0];

//             const isMatch =
//                 await bcrypt.compare(
//                     password,
//                     admin.password
//                 );

//             if (!isMatch) {

//                 return res
//                     .status(401)
//                     .json({
//                         message:
//                             "Invalid Credentials",
//                     });

//             }

//             res.json({
//                 success: true,
//             });

//         } catch (error) {

//             console.error(error);

//             res.status(500).json({
//                 message:
//                     "Server Error",
//             });

//         }

//     }
// );
// module.exports = router;


const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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

            const token = jwt.sign(
                {
                    adminId: admin.id,
                    username: admin.username,
                    role: "admin",
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d",
                }
            );

            res.json({
                success: true,
                token,
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