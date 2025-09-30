import nodemailer from "nodemailer";
import fs from "fs";
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
        if (req.files) {
            if (req.files.frontDesign) {
                attachments.push({
                    filename: req.files.frontDesign[0].originalname,
                    path: req.files.frontDesign[0].path,
                });
            }
            if (req.files.backDesign) {
                attachments.push({
                    filename: req.files.backDesign[0].originalname,
                    path: req.files.backDesign[0].path,
                });
            }
            if (req.files.sideDesign) {
                attachments.push({
                    filename: req.files.sideDesign[0].originalname,
                    path: req.files.sideDesign[0].path,
                });
            }
        }

        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`,
            to: "kukzsportswear@gmail.com",
            subject: `[Kukz Sportswear Customer Contact Request] ${subject}`,
            text: `
                Name: ${name}
                Contact: ${contact}
                Email: ${email}

                Message:
                ${message}
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    
                    <!-- Header -->
                    <div style="background: #111; padding: 20px; text-align: center;">
                        <img src="https://res.cloudinary.com/djbam8qrz/image/upload/v1759135112/kukz_logo_white_swhgw6.png" alt="Kukz Sportswear" style="max-height: 60px;" />
                        <h2 style="color: #fff; margin: 10px 0 0;">Kukz Sportswear Customer Contact Request</h2>
                    </div>

                    <!-- Body -->
                    <div style="padding: 20px; color: #333;">
                        <p style="margin: 0 0 10px;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 0 0 10px;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 0 0 10px;"><strong>Contact:</strong> ${contact || "N/A"}</p>
                        <p style="margin: 20px 0 5px;"><strong>Message:</strong></p>
                        <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-line;">${message}</p>
                    </div>

                    <!-- Footer -->
                    <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                        © ${new Date().getFullYear()} 
                        <a href="https://kukzsportswear.com" target="_blank" style="color: #777; text-decoration: none; font-weight: bold;">
                            Kukz Sportswear
                        </a>. All rights reserved.
                    </div>
                </div>
            `,
            attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        // ✅ Clean up uploaded files
        if (attachments.length > 0) {
            attachments.forEach((att) => {
                fs.unlink(att.path, (err) => {
                    if (err) console.error("Failed to delete file:", att.path, err);
                    else console.log("Deleted file:", att.path);
                });
            });
        }

        res.json({ success: true, message: "Email sent successfully." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: "Failed to send email." });
    }
};
