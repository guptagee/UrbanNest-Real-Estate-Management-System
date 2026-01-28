# UrbanNest Deployment Guide

## Quick Deployment to Netlify

### Prerequisites
- Netlify account
- Domain: urbannest.mukeshgupta.co.in
- Backend deployed at: https://urbannest-backend.mukeshgupta.co.in

### Steps

1. **Prepare Frontend**
```bash
cd frontend
npm install
npm run build
```

2. **Deploy via Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize new site
netlify init

# Deploy to production
netlify deploy --prod --dir=dist
```

3. **Configure in Netlify Dashboard**
- Go to Site settings > Domain management
- Add custom domain: `urbannest.mukeshgupta.co.in`
- Set up DNS records as instructed by Netlify

4. **Set Environment Variables**
In Netlify dashboard > Site settings > Environment variables:
```
VITE_API_URL = https://urbannest-backend.mukeshgupta.co.in
```

### Automatic Deploys (Optional)

1. **Connect to Git Repository**
- Push code to GitHub/GitLab
- In Netlify, click "New site from Git"
- Connect your repository
- Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Node version: 18

2. **Set Environment Variables**
Add the same environment variables in site settings

### Verification

After deployment:
1. Visit `https://urbannest.mukeshgupta.co.in`
2. Test login/registration functionality
3. Verify API calls are working
4. Check all pages load correctly

### Troubleshooting

- **CORS Issues**: Ensure backend allows requests from your domain
- **API Errors**: Verify backend URL is correct and accessible
- **Build Failures**: Check all dependencies are installed
- **Domain Issues**: Verify DNS configuration

### Backend Deployment

Deploy backend separately to:
- Vercel (recommended)
- Railway
- DigitalOcean
- AWS

Make sure to set all required environment variables in your backend hosting service.
