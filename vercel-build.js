#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Starting Vercel build process...');

try {
  // Step 1: Load JSON data into database
  console.log('📊 Loading JSON data into database...');
  execSync('node scripts/load-json-to-db.js', { stdio: 'inherit' });
  
  // Step 2: Build the application
  console.log('🔨 Building application...');
  execSync('npm run build:no-data', { stdio: 'inherit' });
  
  console.log('✅ Vercel build completed successfully!');
  
} catch (error) {
  console.error('❌ Vercel build failed:', error.message);
  process.exit(1);
}
