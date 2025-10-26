import Database from 'better-sqlite3';

const db = new Database('prompts.db');

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'help';

switch (command) {
  case 'help':
    console.log(`
📋 SQLite Database Inspector - Usage:

  node check-db.js list                    - List all categories with counts
  node check-db.js search <term>           - Search prompts by title/description
  node check-db.js category <name>         - Show prompts in a category
  node check-db.js find <id>               - Get a specific prompt by ID
  node check-db.js sample [count]          - Show sample records (default: 5)
  node check-db.js stats                   - Show database statistics
    `);
    break;

  case 'list':
    console.log('\n📂 ALL CATEGORIES:\n');
    const cats = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM prompts 
      GROUP BY category 
      ORDER BY count DESC
    `).all();
    cats.forEach(c => console.log(`  ${c.category.padEnd(30)} ${c.count} prompts`));
    console.log(`\nTotal: ${cats.reduce((sum, c) => sum + c.count, 0)} prompts`);
    break;

  case 'search':
    const term = args[1];
    if (!term) {
      console.log('❌ Please provide a search term');
      break;
    }
    console.log(`\n🔍 Searching for: "${term}"\n`);
    const results = db.prepare(`
      SELECT id, title, category 
      FROM prompts 
      WHERE title LIKE ? OR description LIKE ? 
      LIMIT 10
    `).all(`%${term}%`, `%${term}%`);
    results.forEach((r, i) => console.log(`${i + 1}. [${r.category}] ${r.title} (${r.id})`));
    break;

  case 'category':
    const category = args[1];
    if (!category) {
      console.log('❌ Please provide a category name');
      break;
    }
    console.log(`\n📁 Category: ${category}\n`);
    const prompts = db.prepare(`
      SELECT id, title, tags, compatibleModels 
      FROM prompts 
      WHERE category = ? 
      LIMIT 10
    `).all(category);
    prompts.forEach((p, i) => console.log(`${i + 1}. ${p.title}`));
    if (prompts.length === 10) console.log('\n...(showing first 10)');
    break;

  case 'find':
    const id = args[1];
    if (!id) {
      console.log('❌ Please provide a prompt ID');
      break;
    }
    const prompt = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);
    if (!prompt) {
      console.log('❌ Prompt not found');
    } else {
      console.log('\n📄 PROMPT DETAILS:\n');
      console.log(`ID: ${prompt.id}`);
      console.log(`Title: ${prompt.title}`);
      console.log(`Category: ${prompt.category}`);
      console.log(`Tags: ${prompt.tags}`);
      console.log(`Models: ${prompt.compatibleModels}`);
      console.log(`\nDescription:\n${prompt.description.substring(0, 500)}...`);
      console.log(`\nFull Prompt:\n${prompt.fullPrompt.substring(0, 1000)}...`);
    }
    break;

  case 'sample':
    const count = parseInt(args[1] || '5');
    console.log(`\n📊 SAMPLE RECORDS (${count}):\n`);
    const samples = db.prepare('SELECT * FROM prompts LIMIT ?').all(count);
    samples.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title} [${p.category}]`);
      console.log(`   ID: ${p.id}`);
      console.log(`   ${p.description.substring(0, 80)}...`);
      console.log('');
    });
    break;

  case 'stats':
    console.log('\n📊 DATABASE STATISTICS:\n');
    const stats = db.prepare('SELECT COUNT(*) as total FROM prompts').get();
    console.log(`Total Prompts: ${stats.total}`);
    
    const catStats = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM prompts 
      GROUP BY category 
      ORDER BY count DESC
    `).all();
    console.log('\nBy Category:');
    catStats.forEach(c => console.log(`  ${c.category.padEnd(30)} ${c.count}`));
    
    const oldest = db.prepare('SELECT MIN(createdAt) as date FROM prompts').get();
    const newest = db.prepare('SELECT MAX(createdAt) as date FROM prompts').get();
    console.log(`\nDate Range: ${oldest.date} to ${newest.date}`);
    break;

  default:
    console.log(`Unknown command: ${command}. Use 'node check-db.js help' for usage.`);
}

db.close();
