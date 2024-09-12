const jwt = require("jsonwebtoken");

// Function to generate a JWT
const generatetoken = (userid) => {
    return jwt.sign(
        { id: userid }, // Payload
        process.env.JWT_SECRET_KEY, // Secret key from environment variables
        {
            expiresIn: "1d" // Token expiration time
        }
    );
}

module.exports = generatetoken;
