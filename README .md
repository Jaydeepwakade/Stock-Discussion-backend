
# StockDiscussion Backend
This project is the backend service for a Stock Discussion platform where users can create posts, comment, like, and manage their profiles. It uses Node.js, Express, MongoDB, and JWT for user authentication and data management.



# Features

🔒 JWT Authentication for secure login and registration.

📝 Create, Read, Update, Delete stock discussion posts.

💬 Comment on stock discussion posts.

👍 Like and Unlike posts.

👤 User profile management: bio and profile picture
# Techstack

Backend: Node.js, Express

Database: MongoDB, Mongoose

Authentication: JWT (JSON Web Tokens)

Password Security: bcrypt.js for hashing passwords
# Installation & Setup

Prerequisites

Ensure you have the following installed:

Node.js (v14 or later)
MongoDB (Running locally or with MongoDB Atlas)
# Step by Step

## 1) Clone the repository:

## git clone https://github.com/Jaydeepwakade/Stock-Discussion-backend.git
## cd Stock-Discussion-backend

## 2) Install dependencies:
   - ## npm Install


   ## 3) Create a .env file in the root directory

   ## 4 )Run the Server :  npm start
-----------------------------------------------------------------------
#  🔍 Api documentation

#  Authenctication
-  ### POST /auth/register: Register a new user.
- ### POST /auth/login: Login and receive a JWT token.

 # Profile Update
 - ###  PUT Profileupdate/profile
 - ###   GET Profileupdate/profile/:id

# Stockposts
- ### GET /posts: Fetch all stock discussion posts.
- ###  POST /posts: Create a new stock post (requires authentication).
- ###  PUT /posts/:id: Update a stock post (requires authentication).
- ###   DELETE /posts/:id: Delete a post (requires authentication

 # Comments
 - ###  POST /posts/:postId/comments: Add a comment to a post.
 -  ### DELETE /posts/:postId/comments/:commentId: Delete a comment.

# pagination and filtering

- ### GET posts?page=1&limit=10
- ### GET /posts?stockSymbol=GOOG&sortBy=likes&page=1&limit=10

- ### GET /posts?stockSymbol=MSFT

 # likes

 - ###   post  /Stockspost/posts/id/like
  - ###   delete   /Stockspost/posts/id/like
