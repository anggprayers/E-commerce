import express from "express";
import { sendEmail } from "../controllers/emailController.js";
import upload from "../middleware/multer.js";

const emailRouter = express.Router();

// POST /api/email/send
emailRouter.post(
    "/send",
    upload.fields([
        { name: "frontDesign", maxCount: 1 },
        { name: "backDesign", maxCount: 1 },
        { name: "sideDesign", maxCount: 1 },
    ]),
    sendEmail
);

export default emailRouter;
