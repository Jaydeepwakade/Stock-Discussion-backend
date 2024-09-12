stock discussion backend
Overview
This project is a web application built with Express and MongoDB, featuring user authentication, profile management, and post management with CRUD operations. It supports pagination and sorting of posts and includes authentication and authorization using JWT.

Features
User registration and login
JWT-based authentication
Profile management (update and retrieve profile details)
Post management (create, update, delete, like, and comment on posts)
Pagination and sorting of posts
Secure password storage using bcrypt
Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js (v14 or higher)
MongoDB (local or cloud instance)
npm or yarn (package manager)
Setup
Clone the Repository

bash
Copy code
git clone https://github.com/yourusername/your-repository.git
Navigate to the Project Directory

bash
Copy code
cd your-repository
Install Dependencies

bash
Copy code
npm install
Create a .env File

Create a .env file in the root directory and add the following environment variables:

env
Copy code
PORT=4400
JWT_SECRET_KEY=your_jwt_secret_key
MONGODB_URI=your_mongodb_connection_string
Running the Project
Start the Server

bash
Copy code
npm start
This will start the server on port 4400 by default. You can change the port by updating the PORT variable in the .env file.

Access the Application

Open your browser and navigate to http://localhost:4400.

API Documentation
Authentication
Register User

Endpoint: POST /auth/register

Request Body:

json
Copy code
{
"username": "exampleuser",
"email": "user@example.com",
"password": "yourpassword"
}
Response:

json
Copy code
{
"message": "User created successfully"
}
Login User

Endpoint: POST /auth/login

Request Body:

json
Copy code
{
"email": "user@example.com",
"password": "yourpassword"
}
Response:

json
Copy code
{
"token": "jwt_token",
"user": {
"id": "user_id",
"username": "exampleuser",
"email": "user@example.com"
}
}
User Profile
Update Profile

Endpoint: PUT /user/profile

Headers:

Authorization: Bearer <token>
Request Body:

json
Copy code
{
"username": "newusername",
"bio": "This is my new bio",
"profilepicture": "http://example.com/myprofilepic.jpg"
}
Response:

json
Copy code
{
"success": true,
"message": "Profile updated",
"data": {
"username": "newusername",
"bio": "This is my new bio",
"profilepicture": "http://example.com/myprofilepic.jpg"
}
}
Get Profile

Endpoint: GET /user/profile/:userId

Headers:

Authorization: Bearer <token>
Response:

json
Copy code
{
"user": {
"username": "exampleuser",
"bio": "This is my bio",
"profilepicture": "http://example.com/myprofilepic.jpg"
}
}
Posts
Create Post

Endpoint: POST /Stockspost/posts

Headers:

Authorization: Bearer <token>
Request Body:

json
Copy code
{
"stockSymbol": "AAPL",
"title": "My Apple Post",
"description": "Details about Apple stock",
"tags": ["finance", "stocks"]
}
Response:

json
Copy code
{
"success": true,
"postId": "post_id",
"message": "Post created successfully"
}
Get Post

Endpoint: GET /Stockspost/posts/:postId

Response:

json
Copy code
{
"post": {
"stockSymbol": "AAPL",
"title": "My Apple Post",
"description": "Details about Apple stock",
"tags": ["finance", "stocks"],
"comments": [],
"likesCount": 0
}
}
Add Comment

Endpoint: POST /Stockspost/posts/:postId/comment

Headers:

Authorization: Bearer <token>
Request Body:

json
Copy code
{
"comment": "Great post!"
}
Response:

json
Copy code
{
"success": true,
"post": {
"comments": [
{
"userId": "user_id",
"comment": "Great post!"
}
]
}
}
Like Post

Endpoint: POST /Stockspost/posts/:postId/like

Headers:

Authorization: Bearer <token>
Response:

json
Copy code
{
"success": true,
"message": "Post liked"
}
Unlike Post

Endpoint: DELETE /Stockspost/posts/:postId/like

Headers:

Authorization: Bearer <token>
Response:

json
Copy code
{
"success": true,
"message": "Post unliked"
}
Delete Post

Endpoint: DELETE /Stockspost/posts/:postId

Headers:

Authorization: Bearer <token>
Response:

json
Copy code
{
"success": true,
"message": "Post deleted successfully"
}
Delete Comment
Endpoint: DELETE /Stockspost/posts/:postId/comments/:commentId

Headers:

Authorization: Bearer <token>
Response:

json
Copy code
{
"success": true,
"post": {
"comments": []
}
}
