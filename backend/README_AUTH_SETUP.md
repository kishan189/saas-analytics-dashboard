# Authentication Setup Guide

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_atlas_connection_string

# JWT Secrets (generate strong random strings)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Generate JWT Secrets

You can generate secure random strings using:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Create Test User

You'll need to create a test user in MongoDB. You can do this by:

1. Connecting to your MongoDB database
2. Inserting a user document (password will be hashed automatically on save)

Or create a seed script to add a test user.

## API Endpoints

- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (clears refresh token cookie)
- `GET /api/auth/me` - Get current user (protected)

## Security Features

- ✅ HTTP-only cookies for refresh tokens (XSS protection)
- ✅ Secure cookies in production (HTTPS only)
- ✅ SameSite strict (CSRF protection)
- ✅ Password hashing with bcrypt
- ✅ JWT token expiration (15min access, 7days refresh)
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Helmet security headers
- ✅ CORS configuration

