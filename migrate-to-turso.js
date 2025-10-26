import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';

// Configuration
const LOCAL_DB_PATH = './prompts.db';
const TURSO_DB_URL = process.env.TURSO_DATABASE_URL; // You'll set this
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN; // You'll set this

async function migrateToTurso() {
  try {
    console.log('Starting migration to Turso...');
    
    // Connect to local SQLite database
    const localDb = new Database(LOCAL_DB_PATH);
    console.log('✅ Connected to local SQLite database');
    
    // Connect to Turso
    const tursoClient = createClient({
      url: TURSO_DB_URL,
      authToken: TURSO_AUTH_TOKEN
    });
    console.log('✅ Connected to Turso database');
    
    // Create table in Turso
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS prompts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        fullPrompt TEXT NOT NULL,
        category TEXT NOT NULL,
        tags TEXT NOT NULL,
        compatibleModels TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    console.log('✅ Created prompts table in Turso');
    
    // Get all prompts from local database
    const prompts = localDb.prepare('SELECT * FROM prompts').all();
    console.log(`📊 Found ${prompts.length} prompts to migrate`);
    
    // Insert prompts in batches
    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < prompts.length; i += batchSize) {
      const batch = prompts.slice(i, i + batchSize);
      
      // Prepare batch insert
      const values = batch.map(prompt => 
        `('${prompt.id}', '${prompt.title.replace(/'/g, "''")}', '${prompt.description.replace(/'/g, "''")}', '${prompt.fullPrompt.replace(/'/g, "''")}', '${prompt.category.replace(/'/g, "''")}', '${prompt.tags}', '${prompt.compatibleModels}', '${prompt.createdAt}', '${prompt.updatedAt}')`
      ).join(',');
      
      const insertQuery = `
        INSERT OR REPLACE INTO prompts (id, title, description, fullPrompt, category, tags, compatibleModels, createdAt, updatedAt)
        VALUES ${values}
      `;
      
      await tursoClient.execute(insertQuery);
      inserted += batch.length;
      
      console.log(`📤 Migrated ${inserted}/${prompts.length} prompts (${Math.round(inserted/prompts.length*100)}%)`);
    }
    
    // Verify migration
    const result = await tursoClient.execute('SELECT COUNT(*) as count FROM prompts');
    const tursoCount = result.rows[0].count;
    
    console.log('\n✅ Migration completed!');
    console.log(`📊 Local database: ${prompts.length} prompts`);
    console.log(`📊 Turso database: ${tursoCount} prompts`);
    
    if (prompts.length === tursoCount) {
      console.log('🎉 All prompts migrated successfully!');
    } else {
      console.log('⚠️  Count mismatch - please check the migration');
    }
    
    localDb.close();
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

// Run migration
migrateToTurso();
