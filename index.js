require("dotenv").config();
const express = require("express");
const DatabaseConnection = require("./dbconnection");
const authRouter = require("./routes/Auth/authRoute");
const userRouter = require("./routes/ProfileUpdate/Profileupdate");
const StockpostRouter = require("./routes/postmanagement/postManagement");
const postModal = require("./models/StocksPost.modal");

const server = express();
const port = process.env.PORT || 4400;

// Middleware to parse incoming JSON requests
server.use(express.json());

// Set up route handlers for authentication, user profile updates, and stock posts
server.use("/auth", authRouter);
server.use('/user', userRouter);
server.use('/Stockspost', StockpostRouter);

// Endpoint to retrieve posts with pagination, filtering, and sorting
server.get('/posts', async (req, res) => {
   // Extract query parameters from the request
   const { stockSymbol, tags, sortBy, page = 1, limit = 10 } = req.query;

   // Convert page and limit to integers
   const pagenumber = parseInt(page);
   const limitnumber = parseInt(limit);

   try {
      // Initialize filter object for querying the posts
      let filter = {};

      // Add stockSymbol to the filter if provided
      if (stockSymbol) {
         filter.stockSymbol = stockSymbol;
      }

      // Add tags to the filter if provided
      if (tags) {
         filter.tags = { $in: tags.split(",") }; // Split tags by comma and use $in operator to match any of the tags
      }

      // Determine sorting options based on the sortBy parameter
      let sortOption = { createdAt: -1 }; // Default sorting by creation date in descending order
      if (sortBy === "likes") {
         sortOption = { likesCount: -1 }; // Sort by likes count if sortBy is 'likes'
      } else if (sortBy === "date") {
         sortOption = { createdAt: -1 }; // Sort by creation date if sortBy is 'date'
      }

      // Fetch posts with the specified filters, sorting, pagination
      const posts = await postModal.find(filter)
         .sort(sortOption)
         .skip((pagenumber - 1) * limitnumber) // Skip the number of posts based on current page
         .limit(limitnumber); // Limit the number of posts per page

      // Get the total number of posts for pagination metadata
      const totalposts = await postModal.countDocuments(filter);
      const totalpages = Math.ceil(totalposts / limitnumber); // Calculate total pages

      // Send the response with posts and pagination metadata
      res.status(200).json({
         posts,
         pagination: {
            totalposts,
            totalpages,
            currentpage: pagenumber,
            pagesize: limitnumber
         }
      });

   } catch (error) {
      // Handle any errors during the process
      res.status(401).json({ message: error.message });
   }
});

// Start the server and establish database connection
server.listen(port, async () => {
   await DatabaseConnection();
   console.log(`Server is running on port ${port}`);
});
