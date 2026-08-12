const supabase = require("../config/supabase");


const submitEnquiry = async (req, res) => {

    try {

        const {
            enquiry_type,
            name,
            company,
            email,
            phone,
            location,
            panel_type,
            quantity,
            timeline,
            message,
        } = req.body;


        /* ==========================================
           ENQUIRY TYPE
           ========================================== */

        if (
            !enquiry_type ||
            !["quote", "contact"].includes(enquiry_type)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid enquiry type.",
            });

        }


        /* ==========================================
           NAME
           ========================================== */

        if (
            !name ||
            name.trim().length < 2 ||
            name.trim().length > 80
        ) {

            return res.status(400).json({
                success: false,
                message: "Please provide a valid name.",
            });

        }


        /* ==========================================
           EMAIL
           ========================================== */

        if (
            !email ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            return res.status(400).json({
                success: false,
                message: "Please provide a valid email.",
            });

        }


        /* ==========================================
           PHONE
           ========================================== */

        const normalizedPhone =
            String(phone || "")
                .replace(/[\s\-().]/g, "");


        if (
            !/^(?:\+91|91)?[6-9]\d{9}$/.test(
                normalizedPhone
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid Indian mobile number.",
            });

        }


        /* ==========================================
           REQUIREMENT
           ========================================== */

        if (
            !message ||
            message.trim().length === 0 ||
            message.trim().length > 1500
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide your requirement.",
            });

        }


        /* ==========================================
           QUOTE-SPECIFIC VALIDATION
           ========================================== */

        if (
            enquiry_type === "quote" &&
            !panel_type
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please select a panel or solution.",
            });

        }


        let normalizedQuantity = null;


        if (
            enquiry_type === "quote" &&
            quantity !== undefined &&
            quantity !== null &&
            quantity !== ""
        ) {

            normalizedQuantity = Number(quantity);


            if (
                !Number.isInteger(normalizedQuantity) ||
                normalizedQuantity < 1 ||
                normalizedQuantity > 9999
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid quantity.",
                });

            }

        }


        /* ==========================================
           INSERT INTO SUPABASE
           ========================================== */

        const { data, error } = await supabase
            .from("enquiries")
            .insert({

                enquiry_type,

                status: "new",

                name: name.trim(),

                company:
                    company?.trim() || null,

                email:
                    email.trim().toLowerCase(),

                phone:
                    normalizedPhone,

                location:
                    location?.trim() || null,

                panel_type:
                    panel_type || null,

                quantity:
                    normalizedQuantity,

                timeline:
                    timeline || null,

                message:
                    message.trim(),

                source: "website",

            })
            .select()
            .single();


        if (error) {

            console.error(
                "Supabase enquiry error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to save your enquiry.",
            });

        }


        /* ==========================================
           SUCCESS
           ========================================== */

        return res.status(201).json({

            success: true,

            message:
                "Your enquiry has been received successfully.",

            data: {

                id: data.id,

                status: data.status,

            },

        });


    } catch (error) {

        console.error(
            "Submit enquiry error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to submit your enquiry right now.",

        });

    }

};


module.exports = {
    submitEnquiry,
};