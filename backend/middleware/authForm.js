import jwt from "jsonwebtoken";

const authUserForm = async (req, res, next) => {
    try {
        // Get token from either custom header or Bearer scheme
        let token = req.headers.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, Login again!" });
        }

        // Verify and attach to req (not body, since multer will parse body later)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;

        next();
    } catch (error) {
        console.error("Auth Form Error:", error.message);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authUserForm;
