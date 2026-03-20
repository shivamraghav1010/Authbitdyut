# Auth Project with JWT and Vanilla Frontend

A secure, full-stack authentication system built with Node.js, Express, MongoDB, and a clean HTML/CSS/JS frontend.

## Overview
This project demonstrates a production-ready authentication flow using JSON Web Tokens (JWT). It features secure user registration, login, password hashing, and role-based access control (Admin, Student, Visitor).

## Live Demo
Check out the live application here: **(https://authbitdyut.onrender.com)**

## Approach & Architecture

### 1. Backend Architecture (Node.js + Express)
- **Separation of Concerns**: The backend is organized into Models, Controllers, Routes, and Middlewares.

- **Security**: 
  - User passwords are cryptographically hashed using `bcrypt` before being saved to the MongoDB database.
  - Authentication relies on `jsonwebtoken` (JWT). Upon successful login, a token is issued to the client in the response payload and also set as a secure cookie.

- **Protected Routes & Middleware**: 
  - `auth.js` middleware parses the request (checking cookies, body, and the `Authorization` header) to verify the JWT token.
  - Additional role-based middlewares (`isAdmin` and `isStudent`) restrict access to specific routes based on the user's role defined at registration.



## How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
3. **Start the Server**:
   ```bash
   npm run dev
   # or
   node index.js
   ```
4. **Access the App**:
   Open your browser and navigate to `http://localhost:4000`.
