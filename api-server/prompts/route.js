import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const dbPath = path.join(__dirname, '../../prompts.db');
const db = new Database(dbPath);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : null;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : 0;
    
    let query = 'SELECT * FROM prompts';
    const params = [];
    const conditions = [];
    
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    
    if (search) {
      conditions.push(`(
        title LIKE ? OR 
        description LIKE ? OR 
        fullPrompt LIKE ? OR 
        tags LIKE ? OR 
        category LIKE ?
      )`);
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY createdAt DESC';
    
    if (limit) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }
    
    const prompts = db.prepare(query).all(...params);
    
    // Parse JSON fields
    const formattedPrompts = prompts.map(prompt => ({
      ...prompt,
      tags: JSON.parse(prompt.tags),
      compatibleModels: JSON.parse(prompt.compatibleModels)
    }));
    
    return Response.json({
      prompts: formattedPrompts,
      total: formattedPrompts.length,
      hasMore: limit ? formattedPrompts.length === limit : false
    });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return Response.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}
