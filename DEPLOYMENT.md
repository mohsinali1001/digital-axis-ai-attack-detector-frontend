# Production Deployment Guide

## Environment Variables

This project uses environment variables for configuration. The `.env` file contains production settings and should **NOT** be committed to version control.

### Required Environment Variables

- `REACT_APP_API_BASE_URL`: Base URL for the API (e.g., `https://your-backend.com/api`)
- `REACT_APP_SOCKET_URL`: WebSocket/Socket.IO server URL (e.g., `https://your-backend.com`)
- `NODE_ENV`: Set to `production` for production builds

### Setting Up Environment Variables

1. **Local Development**: Copy `.env.example` to `.env` and update with your local backend URL
2. **Production**: Set environment variables in your deployment platform:
   - **Vercel**: Add in Project Settings → Environment Variables
   - **Netlify**: Add in Site Settings → Build & Deploy → Environment Variables
   - **Railway**: Add in Project Settings → Variables
   - **Heroku**: Use `heroku config:set REACT_APP_API_BASE_URL=...`

## Building for Production

1. Ensure your `.env` file has the correct production API URL
2. Run the build command:
   ```bash
   npm run build
   ```
3. The optimized production build will be in the `build/` folder

## Deployment Platforms

### Vercel
1. Connect your repository to Vercel
2. Set environment variables in Project Settings
3. Vercel will automatically build and deploy

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Site Settings

### Railway
1. Connect your repository
2. Set environment variables in Project Settings
3. Set build command: `npm run build`
4. Set start command: `npx serve -s build`

### Static Hosting (GitHub Pages, S3, etc.)
1. Build the project: `npm run build`
2. Upload the contents of the `build/` folder to your hosting provider
3. Ensure your hosting provider supports client-side routing (SPA)

## Important Notes

- Environment variables are embedded at **build time**, not runtime
- You must rebuild the application after changing environment variables
- The `.env` file is gitignored for security
- Always use HTTPS in production
- Test your production build locally before deploying:
  ```bash
  npm install -g serve
  serve -s build
  ```

## Current Production Configuration

- **API Base URL**: `https://smartwebsecurity-main-backend-production-33df.up.railway.app/api`
- **Socket URL**: `https://smartwebsecurity-main-backend-production-33df.up.railway.app`

## Troubleshooting

- **API calls failing**: Verify environment variables are set correctly and rebuild
- **Socket.IO not connecting**: Check CORS settings on backend and verify `REACT_APP_SOCKET_URL`
- **Build fails**: Check Node.js version (requires Node 14+)
- **Environment variables not working**: Ensure they start with `REACT_APP_` prefix
