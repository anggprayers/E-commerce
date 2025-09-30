import express from "express";
import { sendEmail } from "../controllers/emailController.js";
import upload from "../middleware/multer.js";

const emailRouter = express.Router();

// POST /api/email/send
emailRouter.post("/send", upload.single("file"), sendEmail);

export default emailRouter;
