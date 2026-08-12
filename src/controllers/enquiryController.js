const supabase = require("../config/supabase");

const {
    sendEnquiryEmail,
} = require("../services/emailService");


/* =========================================================
   SUBMIT CUSTOMER ENQUIRY
   Quote + Contact Us
   ========================================================= */

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


        /* =====================================================
           ENQUIRY TYPE
           ===================================================== */

        if (
            !enquiry_type ||
            !["quote", "contact"].includes(enquiry_type)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid enquiry type.",

            });

        }


        /* =====================================================
           NAME
           ===================================================== */

        if (
            !name ||
            typeof name !== "string" ||
            name.trim().length < 2 ||
            name.trim().length > 80
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide a valid name.",

            });

        }


        /* =====================================================
           COMPANY
           ===================================================== */

        if (
            company &&
            (
                typeof company !== "string" ||
                company.trim().length > 120
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Company name is too long.",

            });

        }


        /* =====================================================
           EMAIL
           ===================================================== */

        if (
            !email ||
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                email.trim()
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide a valid email.",

            });

        }


        /* =====================================================
           PHONE
           ===================================================== */

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


        /* =====================================================
           LOCATION
           ===================================================== */

        if (
            location &&
            (
                typeof location !== "string" ||
                location.trim().length > 100
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Location is too long.",

            });

        }


        /* =====================================================
           CUSTOMER REQUIREMENT
           ===================================================== */

        if (
            !message ||
            typeof message !== "string" ||
            message.trim().length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide your requirement.",

            });

        }


        if (
            message.trim().length > 1500
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Your requirement must be 1500 characters or less.",

            });

        }


        /* =====================================================
           QUOTE-SPECIFIC VALIDATION
           ===================================================== */

        if (
            enquiry_type === "quote" &&
            (
                !panel_type ||
                typeof panel_type !== "string" ||
                panel_type.trim().length === 0
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please select a panel or solution.",

            });

        }


        /* =====================================================
           QUANTITY
           ===================================================== */

        let normalizedQuantity = null;


        if (
            enquiry_type === "quote" &&
            quantity !== undefined &&
            quantity !== null &&
            quantity !== ""
        ) {

            normalizedQuantity =
                Number(quantity);


            if (
                !Number.isInteger(
                    normalizedQuantity
                ) ||
                normalizedQuantity < 1 ||
                normalizedQuantity > 9999
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please provide a valid quantity.",

                });

            }

        }


        /* =====================================================
           TIMELINE
           ===================================================== */

        if (
            timeline &&
            (
                typeof timeline !== "string" ||
                timeline.trim().length > 50
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Timeline value is too long.",

            });

        }


        /* =====================================================
           PREPARE DATA
           ===================================================== */

        const enquiryData = {

            enquiry_type,

            status: "new",

            name:
                name.trim(),

            company:
                company?.trim() || null,

            email:
                email.trim().toLowerCase(),

            phone:
                normalizedPhone,

            location:
                location?.trim() || null,

            panel_type:
                panel_type?.trim() || null,

            quantity:
                normalizedQuantity,

            timeline:
                timeline?.trim() || null,

            message:
                message.trim(),

            source:
                "website",

        };


        /* =====================================================
           SAVE TO SUPABASE
           ===================================================== */

        const {
            data,
            error,
        } = await supabase

            .from("enquiries")

            .insert(enquiryData)

            .select()

            .single();


        /* =====================================================
           SUPABASE ERROR
           ===================================================== */

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


        /* =====================================================
           SEND EMAIL NOTIFICATION
           ===================================================== */

        // try {

        //     await sendEnquiryEmail(data);

        //     console.log(
        //         `Enquiry email sent successfully for ${data.id}`
        //     );

        // } catch (emailError) {

        //     /*
        //      * The enquiry is already safely stored
        //      * in Supabase.
        //      *
        //      * Therefore an email failure should NOT
        //      * make the customer's submission fail.
        //      */

        //     console.error(
        //         "Enquiry email failed:",
        //         emailError
        //     );

        // }


        sendEnquiryEmail(data)
            .then(() => {

                console.log(
                    `Enquiry email sent successfully for ${data.id}`
                );

            })
            .catch((emailError) => {

                console.error(
                    `Enquiry email failed for ${data.id}:`,
                    emailError
                );

            });

        /* =====================================================
           SUCCESS RESPONSE
           ===================================================== */

        return res.status(201).json({

            success: true,

            message:
                "Your enquiry has been received successfully.",

            data: {

                id:
                    data.id,

                status:
                    data.status,

            },

        });


    } catch (error) {

        /* =====================================================
           UNEXPECTED ERROR
           ===================================================== */

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


/* =========================================================
   EXPORT
   ========================================================= */

module.exports = {

    submitEnquiry,

};