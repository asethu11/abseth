# Vercel Deployment Instructions

## Automatic Fix Applied
The `vercel.json` file has been updated in the root to properly configure deployment for the Next.js app in the `prompt-marketplace` subdirectory.

## Manual Configuration (Alternative)

If you still encounter issues, you can configure Vercel through the dashboard:

### Option 1: Set Root Directory (Recommended)
1. Go to your Vercel project settings
2. Navigate to **Settings** → **General**
3. Find the **Root Directory** section
4. Set it to: `prompt-marketplace`
5. Save the changes
6. Redeploy your project

### Option 2: Use the Root vercel.json
The current `vercel.json` in the root should automatically handle the subdirectory build.

## What Was Fixed
- Added `buildCommand` to build from the `prompt-marketplace` directory
- Added `outputDirectory` pointing to `prompt-marketplace/.next`
- Added `installCommand` to install dependencies from the subdirectory
- Added `framework: "nextjs"` to explicitly tell Vercel this is a Next.js project

## Build Process
When you push to your repository, Vercel will:
1. Install dependencies from `prompt-marketplace/package.json`
2. Run the build command in the `prompt-marketplace` directory
3. Use the `.next` folder in `prompt-marketplace/.next` as the output

## Testing Locally
To test the build locally:
```bash
cd prompt-marketplace
npm install
npm run build
npm run start
```

The app should be available at `http://localhost:3000` (or the port Next.js assigns).
