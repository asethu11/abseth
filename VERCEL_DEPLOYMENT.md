# Vercel Deployment Instructions for Abseth

## Project Overview
This is a **Vite + React** application (not Next.js) built in the root directory. The app is a prompt library with 1,767 unique AI prompts.

## Automatic Fix Applied
The `vercel.json` file has been configured to properly deploy the Vite application.

## Configuration Details

### What Changed:
- **Build Command**: `npm run build` (builds the Vite app in the root)
- **Output Directory**: `dist` (Vite's default output folder)
- **Install Command**: `npm install`
- **Framework**: None (static site)
- **SPA Routing**: Configured to serve `index.html` for all routes

### Rewrites Configuration:
All routes are rewritten to `/index.html` to support client-side routing in a Single Page Application (SPA).

## Build Process
When you deploy to Vercel:

1. **Install**: `npm install` - Installs all dependencies from root `package.json`
2. **Build**: `npm run build` - Builds the React app with Vite
3. **Output**: Serves files from the `dist` directory
4. **Routing**: All requests are routed to `index.html` for SPA support

## Key Dependencies
- **React** 18.2.0
- **TypeScript** 5.2.2
- **Vite** 5.0.8
- **better-sqlite3** 9.2.2 (for database operations)

## Testing Locally

### Development:
```bash
npm run dev
# Opens at http://localhost:3000 or http://localhost:3001
```

### Production Build:
```bash
npm run build
npm run preview
# Previews the production build
```

## Deployment Steps

### Option 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the configuration
4. Deploy!

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

## Environment Variables
If you need any environment variables, add them in:
- Vercel Dashboard → Settings → Environment Variables

## Build Output
After a successful build, Vercel will serve:
- `index.html` - Main entry point
- `assets/` - JavaScript and CSS bundles
- Other static assets

## Troubleshooting

### Issue: Build fails
**Solution**: Make sure all dependencies are in `package.json` and there are no TypeScript errors.

### Issue: 404 on routes
**Solution**: The rewrites in `vercel.json` handle this. Make sure the configuration is correct.

### Issue: Large bundle size
**Solution**: The app uses lazy loading for the full dataset (1,767 prompts). The initial bundle is optimized.

## Performance
- **Initial Bundle**: ~50-60KB gzipped
- **Lazy Load**: Full dataset loads on demand (18.3 MB)
- **Build Time**: ~1-2 seconds
- **Deployment**: ~30-60 seconds

## Support
If you encounter any issues:
1. Check Vercel deployment logs
2. Verify build succeeds locally: `npm run build`
3. Ensure all environment variables are set
