# KaviosPix Backend

REST API for KaviosPix providing secure authentication, album management, image management, comments, and user profile services. Built with **Express.js**, **MongoDB**, and **Node.js**.

## Quick Start

```bash
git clone https://github.com/sourjyendu-barik/KavioPx_backend.git
cd kaviospix-backend
npm install
npm run dev
```

Create a `.env` file.

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Google OAuth 2.0
- Multer
- Cloudinary
- Cookie Parser
- CORS

---

## Features

### Authentication

- Google OAuth 2.0 login
- JWT authentication
- HTTP-only cookie-based sessions
- Protected routes

### Authorization

- Ownership-based resource access
- Reusable authentication middleware

### Album Management

- Create albums
- Update albums
- Delete albums
- Retrieve user albums

### Image Management

- Upload images using Multer
- Store images on Cloudinary
- Delete images from Cloudinary
- Image CRUD APIs


### User Profile

- Retrieve profile information
- Update profile details

### Reusable Services

- ObjectId validation
- Request validation
- Secure cookie configuration
- Common utility services

---

## API Modules

- Authentication
- Albums
- Images
- User
- UserDetails



## Contact

For bugs or feature requests, please reach out to **sourjyendubarik7798@gmail.com**
