const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const getUserId = (req, res) => {
    try {
        const token = req.cookies?.token || '';
        if (!token) throw new Error("No token provided");

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decodedToken.id;
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return null;
    }
};

module.exports = getUserId;