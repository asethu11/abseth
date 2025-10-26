import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Configuration
const DB_PATH = './prompts.db';
const OUTPUT_DIR = './src/data';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'prompts.json');

async function exportDatabaseToJson() {
  try {
    console.log('🔄 Exporting database to JSON...');
    
    // Check if database exists
    if (!fs.existsSync(DB_PATH)) {
      console.log('⚠️  Database not found. Run "npm run load-data" first.');
      return;
    }
    
    // Initialize database
    const db = new Database(DB_PATH);
    
    // Get all prompts
    const prompts = db.prepare('SELECT * FROM prompts ORDER BY createdAt DESC').all();
    
    console.log(`📊 Found ${prompts.length} prompts in database`);
    
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Process prompts for frontend
    const processedPrompts = prompts.map(prompt => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      fullPrompt: prompt.fullPrompt,
      category: prompt.category,
      tags: JSON.parse(prompt.tags || '[]'),
      compatibleModels: JSON.parse(prompt.compatibleModels || '["Model Agnostic"]'),
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt
    }));
    
    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processedPrompts, null, 2));
    
    // Generate statistics
    const stats = {
      totalPrompts: prompts.length,
      categories: [...new Set(prompts.map(p => p.category))].length,
      lastUpdated: new Date().toISOString(),
      fileSize: (fs.statSync(OUTPUT_FILE).size / (1024 * 1024)).toFixed(2) + ' MB'
    };
    
    const statsFile = path.join(OUTPUT_DIR, 'stats.json');
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    
    console.log('✅ Database exported successfully!');
    console.log(`📁 Output: ${OUTPUT_FILE}`);
    console.log(`📊 Stats: ${stats.totalPrompts} prompts, ${stats.categories} categories`);
    console.log(`💾 File size: ${stats.fileSize}`);
    
    db.close();
    
  } catch (error) {
    console.error('❌ Error exporting database:', error.message);
    process.exit(1);
  }
}

// Run the exporter
exportDatabaseToJson();
