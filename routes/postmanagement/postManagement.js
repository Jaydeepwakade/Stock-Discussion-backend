const express = require("express");
const authenticateToken = require("../../middlewares/TokeAuthentication");
const postModal = require("../../models/StocksPost.modal");
const { default: mongoose } = require("mongoose");

const StockpostRouter = express.Router();

// Route to create a new post
StockpostRouter.post("/posts", authenticateToken, async (req, res) => {
    const { stockSymbol, title, description, tags } = req.body;
    const userId = req.user.id;

    try {
        // Create a new post with the provided data
        const newpost = new postModal({
            userId,
            stockSymbol,
            title,
            description,
            tags: tags // Make sure tags is handled correctly
        });

        // Save the new post to the database
        await newpost.save();
        res.status(201).json({ success: true, postId: newpost._id, message: "Post created successfully" });

    } catch (error) {
        // Handle errors that occur while creating the post
        res.status(401).json({ message: "Something went wrong while adding the post", error: error.message });
    }
});

// Route to add a comment to a post
StockpostRouter.post('/posts/:postId/comment', authenticateToken, async (req, res) => {
    const postId = req.params.postId;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment || comment.trim() === "") {
        return res.status(400).json({ message: "Comment cannot be empty" });
    }

    try {
        const post = await postModal.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Add the comment to the post's comments array
        post.comments.push({ userId, comment });
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        // Handle errors that occur while adding the comment
        res.status(500).json({ message: "Error while adding the comment", error: error.message });
    }
});

// Route to get a specific post by its ID
StockpostRouter.get('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
    const ObjectId = new mongoose.Types.ObjectId(postId);

    try {
        // Retrieve the post using aggregation
        const post = await postModal.aggregate([
            { $match: { _id: ObjectId } },
            {
                $project: {
                    _id: 1,
                    stockSymbol: 1,
                    title: 1,
                    description: 1,
                    likesCount: 1,
                    comments: 1,
                    createdAt: 1
                }
            }
        ]);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        // Handle errors that occur while retrieving the post
        res.status(500).json({ message: "Error while loading the post", error: error.message });
    }
});

// Route to delete a post
StockpostRouter.delete("/posts/:postId", authenticateToken, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;

    try {
        const post = await postModal.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is authorized to delete the post
        if (post.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized user' });
        }

        // Delete the post from the database
        await post.deleteOne();
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        // Handle errors that occur while deleting the post
        res.status(500).json({ message: "Error while deleting the post", error: error.message });
    }
});

// Route to delete a specific comment from a post
StockpostRouter.delete("/posts/:postId/comments/:commentId", authenticateToken, async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.user.id;

    try {
        const post = await postModal.findOne({ _id: postId });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the comment to be deleted
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user is authorized to delete the comment
        if (comment.userId.toString() !== userId && post.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        // Remove the comment from the post's comments array
        post.comments.pull(commentId);
        await post.save();

        res.status(200).json({ success: true, post });
    } catch (error) {
        // Handle errors that occur while deleting the comment
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

// Route to like a post
StockpostRouter.post("/posts/:postId/like", authenticateToken, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;

    try {
        const post = await postModal.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Ensure likes is an array
        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }

        // Check if the post is already liked by the user
        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "Post already liked" });
        }

        // Add the user to the list of likes and update the like count
        post.likes.push(userId);
        post.likesCount = post.likes.length;
        await post.save();

        res.status(200).json({ success: true, message: 'Post liked' });
    } catch (error) {
        // Handle errors that occur while liking the post
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

// Route to unlike a post
StockpostRouter.delete("/posts/:postId/like", authenticateToken, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;

    try {
        const post = await postModal.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Ensure likes is an array
        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }

        // Find the index of the user in the likes array
        const userIndex = post.likes.indexOf(userId);
        if (userIndex === -1) {
            return res.status(400).json({ message: "Post not liked by this user" });
        }

        // Remove the user from the likes array and update the like count
        post.likes.splice(userIndex, 1);
        post.likesCount = post.likes.length;
        await post.save();

        res.status(200).json({ success: true, message: 'Post unliked' });
    } catch (error) {
        // Handle errors that occur while unliking the post
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

module.exports = StockpostRouter;
