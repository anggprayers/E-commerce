import nodemailer from "nodemailer";
import fs from "fs";
import "dotenv/config";

export const sendEmail = async (req, res) => {
    const { name, email, message, contact, subject } = req.body;

    if (!name || !email || !message || !subject) {
        return res.status(400).json({ success: false, error: "Please fill out all required fields." });
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
        if (req.files) {
            ["frontDesign", "backDesign", "sideDesign"].forEach((field) => {
                if (req.files[field]) {
                    attachments.push({
                        filename: req.files[field][0].originalname,
                        path: req.files[field][0].path,
                    });
                }
            });
        }

        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`,
            to: "kukzsportswear@gmail.com",
            subject: `[Kukz Sportswear] ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; border-radius:8px;">
                    <div style="background:#111; padding:20px; text-align:center;">
                        <img src="https://res.cloudinary.com/djbam8qrz/image/upload/v1759135112/kukz_logo_white_swhgw6.png" 
                             alt="Kukz Sportswear" style="max-height:60px;" />
                        <h2 style="color:#fff; margin-top:10px;">Customer Contact Request</h2>
                    </div>
                    <div style="padding:20px; color:#333;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Contact:</strong> ${contact || "N/A"}</p>
                        <p><strong>Message:</strong></p>
                        <p style="background:#f9f9f9; padding:15px; border-radius:5px; white-space:pre-line;">${message}</p>
                    </div>
                    <div style="background:#f4f4f4; padding:15px; text-align:center; font-size:12px; color:#777;">
                        © ${new Date().getFullYear()} <a href="https://kukzsportswear.com" target="_blank" style="color:#777; font-weight:bold;">Kukz Sportswear</a>
                    </div>
                </div>
            `,
            attachments,
        };

        await transporter.sendMail(mailOptions);

        // Clean up temp files
        attachments.forEach((att) => {
            fs.unlink(att.path, (err) => {
                if (err) console.error("Failed to delete file:", att.path, err);
            });
        });

        res.json({ success: true, message: "Your message has been sent! We’ll get back to you shortly." });
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({
            success: false,
            error: "We couldn’t send your message. Please try again later.",
        });
    }
};
