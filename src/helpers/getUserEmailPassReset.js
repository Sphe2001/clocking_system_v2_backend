const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Extracts and decodes the user ID from the JWT token.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {string|null} The decoded user ID or null if an error occurred.
 */
const getUserEmail = (req, res) => {
    try {
        // Get the token from either the cookies or the Authorization header (Bearer token)
        const token = req.cookies?.passwordresettoken || req.headers?.authorization?.split(' ')[1] || '';

        if (!token) {
            throw new Error("No token provided");
        }

        // Verify the token and extract the decoded payload
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (!decodedToken || !decodedToken.email) {
            throw new Error("Token is invalid or does not contain user email");
        }

        return decodedToken.email;
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return null;  // You could throw an error here or return a custom message depending on your needs
    }
};

module.exports = getUserEmail;
