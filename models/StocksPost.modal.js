const mongoose = require("mongoose");

// Define the Comment schema
const CommentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Use the function reference
    }
});

// Define the StockPost schema
const StockPostSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    stockSymbol: {
        type: String,
        required: true,
        // Add an index if queries are frequent
        index: true 
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        // Consider adding an index if tags are queried often
        index: true 
    },
    comments: [CommentSchema],
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [] // Ensure likes is initialized as an empty array
    },
    likesCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now // Use the function reference
    },
    updatedAt: {
        type: Date,
        default: Date.now // Use the function reference
    }
});

// Create and export the model
const postModal = mongoose.model("Post", StockPostSchema);
module.exports = postModal;
