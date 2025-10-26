import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Configuration
const DB_PATH = './prompts.db';
const JSON_FILES = [
  './processed-prompts/all-prompts.json',
  './processed-prompts/unique-prompts.json',
  './additional-prompts/additional-prompts.json'
];

async function loadJsonToDatabase() {
  try {
    console.log('🔄 Loading JSON data into database...');
    
    // Initialize database
    const db = new Database(DB_PATH);
    
    // Create table if it doesn't exist
    db.exec(`
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
    
    console.log('✅ Database table ready');
    
    // Clear existing data
    db.exec('DELETE FROM prompts');
    console.log('🗑️  Cleared existing prompts');
    
    let totalLoaded = 0;
    
    // Process each JSON file
    for (const jsonFile of JSON_FILES) {
      if (fs.existsSync(jsonFile)) {
        console.log(`📁 Processing ${jsonFile}...`);
        
        const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        const prompts = Array.isArray(jsonData) ? jsonData : [jsonData];
        
        console.log(`   Found ${prompts.length} prompts`);
        
        // Prepare insert statement
        const insertStmt = db.prepare(`
          INSERT INTO prompts (
            id, title, description, fullPrompt, category, 
            tags, compatibleModels, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        // Process each prompt
        for (const prompt of prompts) {
          try {
            // Generate ID if not present
            const id = prompt.id || generateId(prompt.title);
            
            // Ensure required fields
            const promptData = {
              id,
              title: prompt.title || 'Untitled Prompt',
              description: prompt.description || prompt.title || 'No description',
              fullPrompt: prompt.fullPrompt || prompt.prompt || prompt.content || '',
              category: prompt.category || 'General',
              tags: JSON.stringify(prompt.tags || []),
              compatibleModels: JSON.stringify(prompt.compatibleModels || ['Model Agnostic']),
              createdAt: prompt.createdAt || new Date().toISOString(),
              updatedAt: prompt.updatedAt || new Date().toISOString()
            };
            
            insertStmt.run(
              promptData.id,
              promptData.title,
              promptData.description,
              promptData.fullPrompt,
              promptData.category,
              promptData.tags,
              promptData.compatibleModels,
              promptData.createdAt,
              promptData.updatedAt
            );
            
            totalLoaded++;
          } catch (error) {
            console.log(`   ⚠️  Skipped invalid prompt: ${error.message}`);
          }
        }
        
        console.log(`   ✅ Loaded ${prompts.length} prompts from ${jsonFile}`);
      } else {
        console.log(`   ⚠️  File not found: ${jsonFile}`);
      }
    }
    
    // Final statistics
    const finalCount = db.prepare('SELECT COUNT(*) as count FROM prompts').get().count;
    const dbSize = (fs.statSync(DB_PATH).size / (1024 * 1024)).toFixed(2);
    
    console.log('\n🎉 JSON loading completed!');
    console.log(`📊 Total prompts loaded: ${finalCount}`);
    console.log(`💾 Database size: ${dbSize} MB`);
    
    db.close();
    
  } catch (error) {
    console.error('❌ Error loading JSON to database:', error.message);
    process.exit(1);
  }
}

function generateId(title) {
  // Simple ID generator based on title
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 20) + '-' + Date.now().toString(36);
}

// Run the loader
loadJsonToDatabase();
