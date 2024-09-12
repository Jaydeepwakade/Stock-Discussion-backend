const express = require("express");
const userModel = require("../../models/user.model");
const authRouter = express.Router();
const bcrypt = require('bcryptjs');
const generatetoken = require("../../utils/Jwt");

// Route to register a new user
authRouter.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user with the given email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the user's password
        const hash = await bcrypt.hash(password, 10);
        
        // Create a new user with the hashed password
        const newuser = new userModel({
            username,
            email,
            password: hash
        });

        // Save the new user to the database
        await newuser.save();
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        // Handle errors that occur while creating the user
        res.status(500).json({ message: "Error while creating the user" });
    }
});

// Route to log in an existing user
authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user with the given email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found. Please register." });
        }

        // Check if the provided password matches the hashed password
        const Usermatch = await bcrypt.compare(password, user.password);
        if (!Usermatch) {
            return res.status(401).json({ message: "Invalid password or email" });
        }

        // Generate a JWT token for the user
        const token = generatetoken(user.id);

        // Send the token and user details in the response
        res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });

    } catch (error) {
        // Handle errors that occur while logging in
        res.status(401).json({ message: "Error while logging in" });
    }
});

module.exports = authRouter;
