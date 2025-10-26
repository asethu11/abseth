import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database
const db = new Database('prompts.db');

// Create prompts table
db.exec(`
  CREATE TABLE IF NOT EXISTS prompts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    fullPrompt TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT NOT NULL, -- JSON string
    compatibleModels TEXT NOT NULL, -- JSON string
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    source TEXT
  )
`);

// Create indexes for better performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_category ON prompts(category);
  CREATE INDEX IF NOT EXISTS idx_title ON prompts(title);
  CREATE INDEX IF NOT EXISTS idx_tags ON prompts(tags);
`);

// Load prompts from JSON
const promptsPath = path.join(__dirname, '../processed-prompts/unique-prompts.json');
const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

console.log(`📊 Loading ${prompts.length} prompts into SQLite database...`);

// Clear existing data
db.exec('DELETE FROM prompts');

// Insert prompts
const insertStmt = db.prepare(`
  INSERT INTO prompts (
    id, title, description, fullPrompt, category, 
    tags, compatibleModels, createdAt, updatedAt, source
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let inserted = 0;
for (const prompt of prompts) {
  try {
    insertStmt.run(
      prompt.id,
      prompt.title,
      prompt.description,
      prompt.fullPrompt,
      prompt.category,
      JSON.stringify(prompt.tags),
      JSON.stringify(prompt.compatibleModels),
      prompt.createdAt,
      prompt.updatedAt,
      prompt.source || null
    );
    inserted++;
  } catch (error) {
    console.error(`Error inserting prompt ${prompt.id}:`, error.message);
  }
}

console.log(`✅ Successfully inserted ${inserted} prompts`);

// Get statistics
const stats = db.prepare(`
  SELECT 
    category,
    COUNT(*) as count
  FROM prompts 
  GROUP BY category 
  ORDER BY count DESC
`).all();

console.log('\n📈 Category breakdown:');
stats.forEach(stat => {
  console.log(`  ${stat.category}: ${stat.count} prompts`);
});

const totalCount = db.prepare('SELECT COUNT(*) as count FROM prompts').get();
console.log(`\n🎯 Total prompts: ${totalCount.count}`);

db.close();
console.log('✅ Database setup complete!');
