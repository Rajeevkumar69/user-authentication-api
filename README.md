# User Authentication API

A secure Node.js + Express.js + MongoDB based authentication service with email verification, built for scalability and future extensions like JWT authentication, login sessions, and role-based access.

---

## Features

* User Registration with form validation
* Profile image upload with Multer
* Email verification using Nodemailer + Gmail SMTP
* Secure password hashing with Bcrypt
* Validation middleware with Express-Validator
* Database integration with Mongoose
* API & UI-based verification flow
* Configurable environment variables with dotenv

---

## Project Structure

* **index.js** → App entry, DB connection, server setup
* **routes/** → API route definitions (`/user`, `/auth`)
* **controllers/** → Core business logic for users & mail verification
* **helpers/** → Mailer and validation helpers
* **models/** → User model with Mongoose schema
* **schemas/** → Centralized schema definitions
* **public/** → Uploaded profile images
* **views/** → EJS templates for verification & error pages

---

## API Endpoints

* `POST /api/user/register` → Register a new user
* `GET /verify-mail?id=USER_ID&action=verify` → Verify email via link
* `POST /verify-mail` → Trigger verification mail API

---

## Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB, Mongoose
* **Security**: Helmet, Bcrypt, Cors
* **Validation**: Express-Validator
* **Mailer**: Nodemailer with Gmail SMTP
* **Templating**: EJS

---

## Upcoming Enhancements

* User login & session handling
* Password reset via secure email link
* Role-based access control (Admin, User)
* API rate limiting & request logging
* Swagger/OpenAPI documentation

---

## Setup

1. Clone repository & install dependencies
2. Add `.env` file with database URL, name, email credentials, port
3. Run `nodemon index.js 4800` or `nodemon index.js <PORT>`
4. Access app via `http://localhost:<PORT>`

------------------------------------------
