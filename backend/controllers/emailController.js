import nodemailer from "nodemailer";
import "dotenv/config";

export const sendEmail = async (req, res) => {
    const { name, email, message, contact, subject } = req.body;

    if (!name || !email || !message || !subject) {
        return res.status(400).json({ success: false, error: "All fields are required." });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        const attachments = [];
        if (req.file) {
            attachments.push({
                filename: req.file.originalname,
                path: req.file.path, // since diskStorage saves file to disk
            });
        }

        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`,
            to: "sportswearkukz@gmail.com",
            subject: `[Kukz Sportswear Customer Contact Request] ${subject}`,
            text: `
                Name: ${name}
                Contact: ${contact}
                Email: ${email}

                Message:
                ${message}
            `,
            attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        res.json({ success: true, message: "Email sent successfully." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: "Failed to send email." });
    }
};
