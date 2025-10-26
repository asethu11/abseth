import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const dbPath = path.join(__dirname, '../prompts.db');
const db = new Database(dbPath);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : null;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : 0;
    
    // Build WHERE clause
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
    
    const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
    
    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM prompts' + whereClause;
    const totalResult = db.prepare(countQuery).get(...params);
    const total = totalResult.total;
    
    // Get paginated results
    let query = 'SELECT * FROM prompts' + whereClause + ' ORDER BY createdAt DESC';
    
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
      total: total,
      hasMore: limit ? (offset + formattedPrompts.length) < total : false
    });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return Response.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, fullPrompt, category, tags, compatibleModels } = body;

    // Validate required fields
    if (!title || !description || !fullPrompt || !category) {
      return Response.json(
        { error: 'Missing required fields: title, description, fullPrompt, category' },
        { status: 400 }
      );
    }

    // Generate ID and timestamps
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Prepare data
    const promptData = {
      id,
      title: title.trim(),
      description: description.trim(),
      fullPrompt: fullPrompt.trim(),
      category: category.trim(),
      tags: tags && Array.isArray(tags) ? tags : [],
      compatibleModels: compatibleModels && Array.isArray(compatibleModels) ? compatibleModels : ['Model Agnostic'],
      createdAt: now,
      updatedAt: now
    };

    // Insert into database
    const insertStmt = db.prepare(`
      INSERT INTO prompts (
        id, title, description, fullPrompt, category, 
        tags, compatibleModels, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      promptData.id,
      promptData.title,
      promptData.description,
      promptData.fullPrompt,
      promptData.category,
      JSON.stringify(promptData.tags),
      JSON.stringify(promptData.compatibleModels),
      promptData.createdAt,
      promptData.updatedAt
    );

    return Response.json({
      success: true,
      prompt: promptData
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating prompt:', error);
    
    // Check if it's a database constraint error
    if (error.code === 'SQLITE_CONSTRAINT') {
      return Response.json(
        { error: 'A prompt with this title already exists' },
        { status: 409 }
      );
    }

    return Response.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}
