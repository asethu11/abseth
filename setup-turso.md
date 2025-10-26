# Turso Setup Guide

## 1. Install Turso CLI

### Windows (PowerShell):
```powershell
# Download Turso CLI
Invoke-WebRequest -Uri "https://github.com/tursodatabase/turso-cli/releases/latest/download/turso-windows-x86_64.exe" -OutFile "turso.exe"

# Move to a directory in your PATH or use directly
.\turso.exe --version
```

### Alternative (using npm):
```bash
npm install -g @tursodatabase/turso
```

## 2. Create Turso Account and Database

```bash
# Login to Turso
turso auth login

# Create a new database
turso db create prompts-db

# Create a database token
turso db tokens create prompts-db

# Get the database URL
turso db show prompts-db --url
```

## 3. Load Your Data

### Option A: Direct SQLite to Turso (Recommended)
```bash
# Export your local database to SQL
sqlite3 prompts.db .dump > prompts_export.sql

# Import to Turso
turso db shell prompts-db < prompts_export.sql
```

### Option B: Using the migration script
1. Set environment variables:
```bash
export TURSO_DATABASE_URL="libsql://your-db-url"
export TURSO_AUTH_TOKEN="your-auth-token"
```

2. Install dependencies:
```bash
npm install @libsql/client
```

3. Run migration:
```bash
node migrate-to-turso.js
```

## 4. Update Your API to Use Turso

Replace your current database connection with:

```javascript
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Use client.execute() instead of db.prepare()
```

## 5. Set Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `TURSO_DATABASE_URL` | `libsql://your-db-url` |
| `TURSO_AUTH_TOKEN` | `your-auth-token` |

## Benefits of Turso:
- ✅ Serverless SQLite
- ✅ No 50MB limit
- ✅ Global edge locations
- ✅ Automatic scaling
- ✅ SQLite compatibility
