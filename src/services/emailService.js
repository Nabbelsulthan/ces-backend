const { Resend } = require("resend");


/* =========================================================
   RESEND
   ========================================================= */

const resend = new Resend(
    process.env.RESEND_API_KEY
);


/* =========================================================
   HTML ESCAPE
   Prevent customer-entered text from becoming HTML.
   ========================================================= */

const escapeHtml = (value) => {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};


/* =========================================================
   SEND ENQUIRY EMAIL
   ========================================================= */

const sendEnquiryEmail = async (enquiry) => {

    const isQuote =
        enquiry.enquiry_type === "quote";


    const enquiryType =
        isQuote
            ? "Quote Request"
            : "Contact Enquiry";


    const subject =
        isQuote
            ? `New Quote Request — ${enquiry.name}`
            : `New Contact Enquiry — ${enquiry.name}`;


    /* =====================================================
       CUSTOMER DATA
       ===================================================== */

    const name =
        escapeHtml(enquiry.name);

    const company =
        escapeHtml(
            enquiry.company || "Not provided"
        );

    const email =
        escapeHtml(enquiry.email);

    const phone =
        escapeHtml(enquiry.phone);

    const location =
        escapeHtml(
            enquiry.location || "Not provided"
        );

    const panelType =
        escapeHtml(
            enquiry.panel_type || "Not specified"
        );

    const quantity =
        escapeHtml(
            enquiry.quantity || "Not specified"
        );

    const timeline =
        escapeHtml(
            enquiry.timeline || "Not specified"
        );

    const message =
        escapeHtml(enquiry.message);


    /* =====================================================
       QUOTE DETAILS
       ===================================================== */

    const quoteDetails = isQuote
        ? `

            <div style="
                margin-top: 28px;
                padding-top: 24px;
                border-top: 1px solid #e6ece8;
            ">

                <h3 style="
                    margin: 0 0 18px;
                    color: #162537;
                    font-size: 18px;
                ">
                    Project Details
                </h3>


                <table style="
                    width: 100%;
                    border-collapse: collapse;
                ">

                    <tr>

                        <td style="
                            padding: 9px 0;
                            color: #62748a;
                            width: 42%;
                        ">
                            Panel / Solution
                        </td>

                        <td style="
                            padding: 9px 0;
                            color: #162537;
                            font-weight: 600;
                        ">
                            ${panelType}
                        </td>

                    </tr>


                    <tr>

                        <td style="
                            padding: 9px 0;
                            color: #62748a;
                        ">
                            Quantity
                        </td>

                        <td style="
                            padding: 9px 0;
                            color: #162537;
                            font-weight: 600;
                        ">
                            ${quantity}
                        </td>

                    </tr>


                    <tr>

                        <td style="
                            padding: 9px 0;
                            color: #62748a;
                        ">
                            Timeline
                        </td>

                        <td style="
                            padding: 9px 0;
                            color: #162537;
                            font-weight: 600;
                        ">
                            ${timeline}
                        </td>

                    </tr>

                </table>

            </div>

        `
        : "";


    /* =====================================================
       EMAIL HTML
       ===================================================== */

    const html = `

<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>
        ${enquiryType}
    </title>

</head>


<body style="
    margin: 0;
    padding: 30px 15px;
    background: #f5f8f6;
    font-family:
        Arial,
        Helvetica,
        sans-serif;
    color: #162537;
">


<div style="
    max-width: 700px;
    margin: 0 auto;
">


    <!-- =================================================
         HEADER
         ================================================= -->

    <div style="
        background: #58b947;
        padding: 30px;
        border-radius: 18px 18px 0 0;
        color: #ffffff;
    ">

        <div style="
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
        ">
            Circuits Energy System
        </div>


        <div style="
            font-size: 14px;
            opacity: 0.95;
        ">
            ${enquiryType}
        </div>

    </div>


    <!-- =================================================
         MAIN
         ================================================= -->

    <div style="
        background: #ffffff;
        padding: 32px;
        border: 1px solid #e6ece8;
        border-top: none;
    ">


        <div style="
            display: inline-block;
            padding: 7px 12px;
            background: #eaf8e7;
            color: #469a39;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 22px;
        ">

            NEW WEBSITE ENQUIRY

        </div>


        <h2 style="
            margin: 0 0 24px;
            color: #162537;
            font-size: 24px;
        ">

            ${name} has submitted
            ${isQuote ? "a quote request" : "an enquiry"}.

        </h2>


        <!-- =================================================
             CUSTOMER INFORMATION
             ================================================= -->

        <h3 style="
            margin: 0 0 16px;
            color: #162537;
            font-size: 18px;
        ">

            Customer Information

        </h3>


        <table style="
            width: 100%;
            border-collapse: collapse;
            background: #f7faf8;
            border-radius: 12px;
        ">


            <tr>

                <td style="
                    padding: 12px 15px;
                    color: #62748a;
                    width: 35%;
                ">
                    Name
                </td>

                <td style="
                    padding: 12px 15px;
                    font-weight: 600;
                    color: #162537;
                ">
                    ${name}
                </td>

            </tr>


            <tr>

                <td style="
                    padding: 12px 15px;
                    color: #62748a;
                ">
                    Company
                </td>

                <td style="
                    padding: 12px 15px;
                    font-weight: 600;
                    color: #162537;
                ">
                    ${company}
                </td>

            </tr>


            <tr>

                <td style="
                    padding: 12px 15px;
                    color: #62748a;
                ">
                    Email
                </td>

                <td style="
                    padding: 12px 15px;
                    font-weight: 600;
                    color: #162537;
                ">
                    ${email}
                </td>

            </tr>


            <tr>

                <td style="
                    padding: 12px 15px;
                    color: #62748a;
                ">
                    Phone
                </td>

                <td style="
                    padding: 12px 15px;
                    font-weight: 600;
                    color: #162537;
                ">
                    ${phone}
                </td>

            </tr>


            <tr>

                <td style="
                    padding: 12px 15px;
                    color: #62748a;
                ">
                    Location
                </td>

                <td style="
                    padding: 12px 15px;
                    font-weight: 600;
                    color: #162537;
                ">
                    ${location}
                </td>

            </tr>


        </table>


        ${quoteDetails}


        <!-- =================================================
             REQUIREMENT
             ================================================= -->

        <div style="
            margin-top: 28px;
            padding-top: 24px;
            border-top: 1px solid #e6ece8;
        ">

            <h3 style="
                margin: 0 0 14px;
                color: #162537;
                font-size: 18px;
            ">

                Customer Requirement

            </h3>


            <div style="
                padding: 18px;
                background: #f7faf8;
                border-left: 4px solid #58b947;
                border-radius: 8px;
                color: #62748a;
                font-size: 15px;
                line-height: 1.7;
                white-space: pre-wrap;
            ">

                ${message}

            </div>

        </div>


        <!-- =================================================
             ACTION
             ================================================= -->

        <div style="
            margin-top: 28px;
            padding: 18px;
            background: #f5fbf4;
            border: 1px solid #cfe8c9;
            border-radius: 12px;
        ">

            <strong style="
                color: #347d2b;
            ">

                Action Required

            </strong>


            <p style="
                margin: 7px 0 0;
                color: #62748a;
                line-height: 1.6;
            ">

                Please review this enquiry and contact
                the customer as soon as possible.

            </p>

        </div>


    </div>


    <!-- =================================================
         FOOTER
         ================================================= -->

    <div style="
        padding: 22px 30px;
        background: #162537;
        border-radius: 0 0 18px 18px;
        color: #ffffff;
        text-align: center;
    ">

        <div style="
            font-size: 13px;
            opacity: 0.9;
        ">

            Circuits Energy System Pvt. Ltd.

        </div>


        <div style="
            margin-top: 6px;
            font-size: 12px;
            opacity: 0.65;
        ">

            Website Enquiry Notification

        </div>

    </div>


</div>


</body>

</html>

`;


    /* =====================================================
       SEND THROUGH RESEND
       ===================================================== */

    console.log(
        "Sending enquiry email through Resend..."
    );


    const { data, error } =
        await resend.emails.send({

            from:
                "CES Website <design@circuitses.com>",

            to: [
                process.env.ENQUIRY_EMAIL
            ],

            replyTo:
                enquiry.email,

            subject,

            html,

        });


    /* =====================================================
       RESEND ERROR
       ===================================================== */

    if (error) {

        console.error(
            "Resend enquiry email error:",
            error
        );

        throw new Error(
            error.message ||
            "Failed to send enquiry email."
        );

    }


    /* =====================================================
       SUCCESS
       ===================================================== */

    console.log(
        "Enquiry email sent successfully:",
        data?.id
    );


    return data;

};


/* =========================================================
   EXPORT
   ========================================================= */

module.exports = {
    sendEnquiryEmail,
};