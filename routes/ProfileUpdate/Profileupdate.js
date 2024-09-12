const express = require('express');
const authenticateToken = require('../../middlewares/TokeAuthentication');
const mongoose = require('mongoose');
const userModel = require('../../models/user.model');

const profileRouter = express.Router();

// Route to update user profile
profileRouter.put('/profile', authenticateToken, async (req, res) => {
    const { username, bio, profilepicture } = req.body;
    const userId = req.user.id;

    try {
        // Update the user profile with new data
        const updateUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: { username, bio, profilepicture } },
            { new: true }  // Return the updated document
        );

        // If user not found, respond with 404
        if (!updateUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Respond with the updated user data
        return res.status(200).json({
            success: true,
            message: "Profile updated",
            data: updateUser
        });
    } catch (error) {
        // Respond with error message if something goes wrong
        return res.status(500).json({ success: false, message: "Error updating the profile", error: error.message });
    }
});

// Route to get user profile by userId
profileRouter.get('/profile/:userId', authenticateToken, async (req, res) => {
    const userId = req.params.userId;
    const ObjectId = new mongoose.Types.ObjectId(userId);

    try {
        // Retrieve user profile data from the database
        const user = await userModel.aggregate([
            { $match: { _id: ObjectId } },
            {
                $project: {
                    _id: 1,
                    bio: 1,
                    profilepicture: 1,
                    username: 1
                }
            }
        ]);

        // If user not found, respond with 404
        if (!user.length) {  // Note: `user` is an array due to aggregation
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Respond with user profile data
        res.status(200).json({
            success: true,
            data: user[0]  // Return the first (and only) document from the array
        });
    } catch (error) {
        // Respond with error message if something goes wrong
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
});

module.exports = profileRouter;
