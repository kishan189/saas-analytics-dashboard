# Deployment Guide - Netlify

This guide will help you deploy the frontend to Netlify.

## Prerequisites

- Backend deployed on Render: `https://saas-analytics-dashboard-zz9w.onrender.com`
- Netlify account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Environment Variable

The frontend needs to know where the backend API is located.

### Option A: Netlify Dashboard (Recommended)

1. Go to your Netlify site settings
2. Navigate to **Environment variables**
3. Add a new variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://saas-analytics-dashboard-zz9w.onrender.com/api`

### Option B: netlify.toml (Alternative)

You can also add it to `netlify.toml`:

```toml
[build.environment]
  VITE_API_BASE_URL = "https://saas-analytics-dashboard-zz9w.onrender.com/api"
```

## Step 2: Deploy to Netlify

### Method 1: Git Integration (Recommended)

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository

2. **Configure Build Settings**
   - **Base directory**: `frontend` (if your repo has both frontend and backend)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: Add `VITE_API_BASE_URL` (see Step 1)

3. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy

### Method 2: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

4. **Initialize and deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

### Method 3: Drag & Drop

1. **Build locally**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy**
   - Go to Netlify Dashboard
   - Drag and drop the `dist` folder

## Step 3: Verify Deployment

1. Visit your Netlify site URL
2. Test the login functionality
3. Verify API calls are working (check browser console)

## Step 4: Update Backend CORS (If Needed)

Make sure your Render backend allows requests from your Netlify domain:

In `backend/server.js`, the CORS configuration should include your Netlify URL:

```javascript
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://your-netlify-site.netlify.app', // Add your Netlify URL
    ],
    credentials: true,
  })
);
```

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Netlify uses Node 18 by default)

### API Calls Fail
- Verify `VITE_API_BASE_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend CORS allows your Netlify domain

### Routing Issues (404 on refresh)
- The `netlify.toml` file handles this automatically
- If issues persist, check the redirect rules

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://saas-analytics-dashboard-zz9w.onrender.com/api` |

## Notes

- Netlify automatically provides HTTPS
- The `netlify.toml` file configures SPA routing
- Environment variables are available at build time (Vite requirement)
- Changes to environment variables require a new deployment

