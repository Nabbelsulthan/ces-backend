const express = require("express");
const jwt = require("jsonwebtoken");

const authenticateCustomer =
    require("../middleware/authenticateCustomer");

const router = express.Router();


/*
=========================================================
GENERATE SUPABASE REALTIME TOKEN
=========================================================
*/

router.get(
    "/token",
    authenticateCustomer,
    async (req, res) => {

        try {

            const customerId =
                req.customer.customerId;


            if (!customerId) {

                return res.status(401).json({
                    message:
                        "Customer identity missing",
                });

            }


            /*
            IMPORTANT:
            This must be the SUPABASE JWT signing secret,
            NOT your Render JWT_SECRET.
            */

            const token =
                jwt.sign(
                    {
                        role: "authenticated",

                        customerId:
                            Number(customerId),

                        username:
                            req.customer.username,

                    },

                    process.env.SUPABASE_JWT_SECRET,

                    {
                        expiresIn: "15m",
                    }
                );


            return res.json({
                success: true,
                token,
            });


        } catch (error) {

            console.error(
                "Supabase realtime token error:",
                error
            );


            return res.status(500).json({
                message:
                    "Failed to generate realtime token",
            });

        }

    }
);


module.exports = router;