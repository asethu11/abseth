import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const dbPath = path.join(__dirname, '../prompts.db');
const db = new Database(dbPath);

export async function GET(request) {
  try {
    const categories = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM prompts 
      GROUP BY category 
      ORDER BY count DESC
    `).all();
    
    return Response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
