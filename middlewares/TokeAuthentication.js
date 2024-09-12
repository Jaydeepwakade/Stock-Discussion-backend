const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    // Get the authorization header from the request
    const authHeader = req.headers['authorization'];
    
    // Extract the token from the header, if it exists
    const token = authHeader && authHeader.split(" ")[1];

    // If no token is provided, respond with 401 Unauthorized
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify the token using the JWT_SECRET_KEY from environment variables
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            // If the token is invalid or expired, respond with 403 Forbidden
            return res.status(403).json({ success: false, message: "Invalid token" });
        }

        // Attach the user object to the request for further use
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    });
};

module.exports = authenticateToken;
