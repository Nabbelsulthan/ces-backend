const nodemailer = require("nodemailer");


/* =========================================================
   ZOHO SMTP TRANSPORTER
   ========================================================= */

const transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,

    port:
        Number(process.env.EMAIL_PORT) || 465,

    secure:
        process.env.EMAIL_SECURE === "true",

    auth: {

        user:
            process.env.EMAIL_USER,

        pass:
            process.env.EMAIL_PASSWORD,

    },

    /*
     * Prevent SMTP from hanging indefinitely.
     */

    connectionTimeout: 10000,

    greetingTimeout: 10000,

    socketTimeout: 15000,

});


/* =========================================================
   SEND ENQUIRY EMAIL
   ========================================================= */

const sendEnquiryEmail = async (enquiry) => {

    const isQuote =
        enquiry.enquiry_type === "quote";


    const enquiryTitle =
        isQuote
            ? "Engineering Quote Enquiry"
            : "Website Contact Enquiry";


    const subject =
        `CES — ${enquiryTitle} — ${enquiry.name}`;


    const html = `

        <div style="
            font-family:
                Arial,
                Helvetica,
                sans-serif;

            max-width: 700px;

            margin: 0 auto;

            color: #162537;

            background: #ffffff;
        ">

            <!-- HEADER -->

            <div style="
                background: #58B947;

                padding:
                    28px 30px;

                border-radius:
                    14px 14px 0 0;

                color: #ffffff;
            ">

                <h2 style="
                    margin: 0;

                    font-size: 24px;
                ">

                    Circuits Energy System

                </h2>


                <p style="
                    margin:
                        8px 0 0;

                    font-size: 14px;
                ">

                    ${enquiryTitle}

                </p>

            </div>


            <!-- CONTENT -->

            <div style="
                background: #f7faf8;

                padding: 30px;
            ">


                <h3 style="
                    margin-top: 0;
                ">

                    Customer Details

                </h3>


                <p>

                    <strong>
                        Name:
                    </strong>

                    ${enquiry.name}

                </p>


                <p>

                    <strong>
                        Company:
                    </strong>

                    ${enquiry.company || "Not provided"}

                </p>


                <p>

                    <strong>
                        Email:
                    </strong>

                    ${enquiry.email}

                </p>


                <p>

                    <strong>
                        Phone:
                    </strong>

                    ${enquiry.phone}

                </p>


                <p>

                    <strong>
                        Location:
                    </strong>

                    ${enquiry.location || "Not provided"}

                </p>


                ${
                    isQuote
                        ? `

                            <hr style="
                                border: none;

                                border-top:
                                    1px solid #dfe8e2;

                                margin:
                                    25px 0;
                            ">


                            <h3>
                                Project Details
                            </h3>


                            <p>

                                <strong>
                                    Panel / Solution:
                                </strong>

                                ${
                                    enquiry.panel_type ||
                                    "Not specified"
                                }

                            </p>


                            <p>

                                <strong>
                                    Quantity:
                                </strong>

                                ${
                                    enquiry.quantity ||
                                    "Not specified"
                                }

                            </p>


                            <p>

                                <strong>
                                    Timeline:
                                </strong>

                                ${
                                    enquiry.timeline ||
                                    "Not specified"
                                }

                            </p>

                        `
                        : ""
                }


                <hr style="
                    border: none;

                    border-top:
                        1px solid #dfe8e2;

                    margin:
                        25px 0;
                ">


                <h3>
                    Customer Requirement
                </h3>


                <div style="
                    background: #ffffff;

                    border:
                        1px solid #e6ece8;

                    border-radius: 10px;

                    padding: 20px;

                    line-height: 1.7;

                    white-space: pre-wrap;
                ">

                    ${enquiry.message}

                </div>


                <p style="
                    margin-top: 25px;

                    color: #62748a;

                    font-size: 13px;
                ">

                    Submitted through:
                    ${enquiry.source || "CES Website"}

                </p>

            </div>


            <!-- FOOTER -->

            <div style="
                padding:
                    18px 30px;

                background:
                    #162537;

                color:
                    #ffffff;

                font-size:
                    12px;
            ">

                CES Website Enquiry System

            </div>

        </div>

    `;


    const mailOptions = {

        from:
            `"CES Website" <${process.env.EMAIL_USER}>`,

        to:
            process.env.ENQUIRY_EMAIL,

        replyTo:
            enquiry.email,

        subject,

        html,

    };


    console.log(
        "Connecting to Zoho SMTP..."
    );


    const info =
        await transporter.sendMail(
            mailOptions
        );


    console.log(
        "Zoho email sent:",
        info.messageId
    );


    return info;

};


/* =========================================================
   EXPORT
   ========================================================= */

module.exports = {

    sendEnquiryEmail,

};