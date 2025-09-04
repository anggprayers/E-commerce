import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        // Get token either from custom header or from "Authorization: Bearer <token>"
        let token = req.headers.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: 'Not authorized, Login again!' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;

        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;
