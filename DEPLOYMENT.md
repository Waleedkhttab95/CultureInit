# 🚀 Netlify Deployment Guide

This guide will help you deploy your Cultural Initiative website to Netlify.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Netlify Account** - Sign up at [netlify.com](https://netlify.com)
3. **Node.js 18+** - For local testing

## 🛠️ Deployment Steps

### Method 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "New site from Git"
   - Choose "GitHub" and authorize
   - Select your repository

3. **Configure Build Settings**
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `dist/public`
   - **Node version**: 18

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Method 2: Deploy from Local Files

1. **Build the project**
   ```bash
   npm install
   npm run build:netlify
   ```

2. **Deploy to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag and drop the `dist/public` folder
   - Your site will be live immediately

## ⚙️ Configuration Files

The project includes these deployment files:

- **`netlify.toml`** - Netlify configuration
- **`package.json`** - Build scripts
- **`vite.config.ts`** - Vite build configuration

## 🔧 Environment Variables

If you need environment variables:

1. Go to Site Settings → Environment Variables
2. Add any required variables
3. Redeploy the site

## 📁 File Structure

```
dist/public/
├── index.html
├── assets/
│   ├── *.js
│   └── *.css
└── attached_assets/
    └── *.png, *.pdf
```

## 🚀 Custom Domain (Optional)

1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Configure DNS settings
4. Enable HTTPS (automatic)

## 🔄 Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Pull requests can create preview deployments
- Build logs are available in Netlify dashboard

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Netlify dashboard

### Assets Not Loading
- Ensure `attached_assets` folder is in `dist/public`
- Check file paths in your code
- Verify `netlify.toml` redirects

### Routing Issues
- The `netlify.toml` includes SPA redirect rules
- All routes redirect to `index.html` for client-side routing

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify local build works: `npm run build:netlify`
3. Check file paths and imports
4. Ensure all assets are included in build

## 🎉 Success!

Your Cultural Initiative website should now be live on Netlify with:
- ✅ Fast loading times
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Continuous deployment
- ✅ Custom domain support (optional)
