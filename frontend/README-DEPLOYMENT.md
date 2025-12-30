# Netlify Deployment Guide

## Quick Start

### 1. Set Environment Variable in Netlify

**Important**: You must set the `VITE_API_BASE_URL` environment variable in Netlify.

1. Go to your Netlify site → **Site settings** → **Environment variables**
2. Click **Add variable**
3. Add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://saas-analytics-dashboard-zz9w.onrender.com/api`

### 2. Deploy Options

#### Option A: Git Integration (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com)
3. Click **Add new site** → **Import an existing project**
4. Connect your repository
5. Configure:
   - **Base directory**: `frontend` (if repo has both frontend/backend)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variable (see Step 1)
7. Click **Deploy site**

#### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Navigate to frontend
cd frontend

# Deploy
netlify deploy --prod
```

#### Option C: Drag & Drop

```bash
cd frontend
npm install
npm run build
# Then drag the 'dist' folder to Netlify dashboard
```

### 3. Update Backend CORS (Important!)

After deploying, update your Render backend environment variable:

1. Go to Render dashboard → Your service → **Environment**
2. Add/Update:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-netlify-site.netlify.app`

Or update `FRONTEND_URL` to include both local and production:
```
http://localhost:5173,https://your-netlify-site.netlify.app
```

The backend code has been updated to support multiple origins.

## Configuration Files

- `netlify.toml` - Netlify configuration (SPA routing, headers)
- `.env.example` - Example environment variables

## Troubleshooting

### Build Fails
- Check Node.js version (Netlify uses Node 18 by default)
- Verify all dependencies are in `package.json`
- Check build logs in Netlify dashboard

### API Calls Fail (CORS Error)
- Verify `VITE_API_BASE_URL` is set in Netlify
- Check backend CORS allows your Netlify domain
- Ensure backend `FRONTEND_URL` includes your Netlify URL

### 404 on Page Refresh
- The `netlify.toml` handles this automatically
- Verify redirect rules are working

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_BASE_URL` | Yes | Backend API URL | `https://saas-analytics-dashboard-zz9w.onrender.com/api` |

## Notes

- Environment variables must start with `VITE_` to be available in the frontend
- Changes to environment variables require a new deployment
- Netlify provides HTTPS automatically
- The `netlify.toml` configures SPA routing automatically

