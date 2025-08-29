# Deployment Guide for Uniconnect

This guide will help you deploy your Uniconnect application with the frontend on Vercel and backend on Render.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- MongoDB Atlas account (for database)

## Backend Deployment on Render

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub with all the configuration files created.

### 2. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `uniconnect-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Set Environment Variables

In your Render service settings, add these environment variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_generated_jwt_secret
CLIENT_URL=https://your-app-name.vercel.app
```

**To generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Deploy

Render will automatically deploy your backend. Note the URL (e.g., `https://uniconnect-backend.onrender.com`).

## Frontend Deployment on Vercel

### 1. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2. Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3. Set Environment Variables

In your Vercel project settings, add:

```
REACT_APP_API_URL=https://your-backend-app.onrender.com
```

### 4. Deploy

Vercel will automatically deploy your frontend and provide a URL.

## Post-Deployment Steps

### 1. Update CORS Settings

Update the `CLIENT_URL` environment variable in your Render backend service with your actual Vercel URL.

### 2. Test the Application

1. Visit your Vercel frontend URL
2. Test user registration and login
3. Verify API calls are working
4. Check browser console for any errors

### 3. Custom Domain (Optional)

- **Vercel**: Add custom domain in project settings
- **Render**: Add custom domain in service settings

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_URL` is set correctly in backend
   - Check that frontend is making requests to correct backend URL

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Ensure IP whitelist includes `0.0.0.0/0` for Render

3. **Build Failures**
   - Check build logs in respective platforms
   - Ensure all dependencies are in `package.json`

4. **Environment Variables**
   - Double-check all required variables are set
   - Restart services after changing environment variables

### Logs and Monitoring

- **Render**: View logs in service dashboard
- **Vercel**: Check function logs and build logs
- **MongoDB Atlas**: Monitor database performance

## Automatic Deployments

Both platforms support automatic deployments:

- **Render**: Deploys on every push to main branch
- **Vercel**: Deploys on every push, with preview deployments for PRs

## Cost Considerations

- **Render Free Tier**: 750 hours/month, sleeps after 15 minutes of inactivity
- **Vercel Free Tier**: 100GB bandwidth, unlimited static deployments
- **MongoDB Atlas Free Tier**: 512MB storage, shared clusters

For production applications, consider upgrading to paid tiers for better performance and reliability.

## Security Best Practices

1. Use strong, unique JWT secrets
2. Keep environment variables secure
3. Regularly update dependencies
4. Monitor for security vulnerabilities
5. Use HTTPS for all communications

## Support

If you encounter issues:

1. Check the platform-specific documentation
2. Review application logs
3. Verify environment variable configuration
4. Test locally first to isolate deployment-specific issues