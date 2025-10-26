import Database from 'better-sqlite3';

const db = new Database('prompts.db');

// Model keywords to look for in prompts
const modelKeywords = [
  // GPT models
  { pattern: /\bGPT-4\b/gi, model: 'GPT-4' },
  { pattern: /\bGPT-3\.5\b/gi, model: 'GPT-3.5' },
  { pattern: /\bGPT-4o\b/gi, model: 'GPT-4o' },
  { pattern: /\bGPT-4 Turbo\b/gi, model: 'GPT-4 Turbo' },
  { pattern: /\bGPT\b/gi, model: 'GPT-4' }, // Generic GPT
  
  // Claude models
  { pattern: /\bClaude\b/gi, model: 'Claude-3' },
  { pattern: /\bClaude-3/gi, model: 'Claude-3' },
  { pattern: /\bSonnet\b/gi, model: 'Claude-3.5 Sonnet' },
  { pattern: /\bOpus\b/gi, model: 'Claude-3 Opus' },
  { pattern: /\bHaiku\b/gi, model: 'Claude-3 Haiku' },
  
  // Gemini models
  { pattern: /\bGemini\b/gi, model: 'Gemini' },
  { pattern: /\bGemini Pro\b/gi, model: 'Gemini Pro' },
  { pattern: /\bGemini Ultra\b/gi, model: 'Gemini Ultra' },
  
  // Llama models
  { pattern: /\bLlama\b/gi, model: 'Llama 3' },
  { pattern: /\bLlama 2\b/gi, model: 'Llama 2' },
  { pattern: /\bLlama 3\b/gi, model: 'Llama 3' },
  { pattern: /\bLlama 3\.1\b/gi, model: 'Llama 3.1' },
  
  // Mistral models
  { pattern: /\bMistral\b/gi, model: 'Mistral' },
  { pattern: /\bMistral 7B\b/gi, model: 'Mistral 7B' },
  
  // Other models
  { pattern: /\bPi\b/gi, model: 'Pi' },
  { pattern: /\bCopilot\b/gi, model: 'Copilot' },
  { pattern: /\bOllama\b/gi, model: 'Ollama' },
  { pattern: /\bCode Llama\b/gi, model: 'Code Llama' },
  { pattern: /\bPaLM\b/gi, model: 'PaLM' },
  { pattern: /\bJurassic\b/gi, model: 'Jurassic' },
  { pattern: /\bChatGPT\b/gi, model: 'GPT-4' },
  { pattern: /\bChat-GPT\b/gi, model: 'GPT-4' },
];

function extractModels(text) {
  const foundModels = new Set();
  
  // Check each keyword pattern
  for (const { pattern, model } of modelKeywords) {
    if (pattern.test(text)) {
      foundModels.add(model);
    }
  }
  
  return Array.from(foundModels);
}

// Get all prompts
const prompts = db.prepare('SELECT id, title, description, fullPrompt, compatibleModels FROM prompts').all();

console.log(`Analyzing ${prompts.length} prompts...`);

let updated = 0;
let modelAgnostic = 0;

const updateStmt = db.prepare('UPDATE prompts SET compatibleModels = ? WHERE id = ?');

db.transaction(() => {
  for (const prompt of prompts) {
    const searchText = `${prompt.title} ${prompt.description} ${prompt.fullPrompt}`;
    const foundModels = extractModels(searchText);
    
    let newModels;
    if (foundModels.length > 0) {
      newModels = foundModels;
      updated++;
    } else {
      newModels = ['Model Agnostic'];
      modelAgnostic++;
    }
    
    updateStmt.run(JSON.stringify(newModels), prompt.id);
  }
})();

console.log(`\n✓ Analysis complete!`);
console.log(`- Updated prompts with specific models: ${updated}`);
console.log(`- Model agnostic prompts: ${modelAgnostic}`);
console.log(`- Total prompts analyzed: ${prompts.length}`);

// Show some examples
console.log('\nSample results:');
const samples = db.prepare('SELECT id, title, compatibleModels FROM prompts LIMIT 5').all();
samples.forEach(p => {
  console.log(`\n"${p.title}"`);
  console.log(`  Models: ${JSON.parse(p.compatibleModels).join(', ')}`);
});

db.close();
