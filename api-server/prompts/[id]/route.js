import { getPromptById } from '../../prompts.js';

export async function GET(request, { params }) {
  try {
    const prompt = await getPromptById(params.id);
    
    if (!prompt) {
      return Response.json({ error: 'Prompt not found' }, { status: 404 });
    }
    
    return Response.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return Response.json({ error: 'Failed to fetch prompt' }, { status: 500 });
  }
}
