import fs from 'fs';
import path from 'path';

// Read the JSON file
const data = JSON.parse(fs.readFileSync('processed-prompts/unique-prompts.json', 'utf8'));

// Keywords that indicate non-prompt content
const nonPromptKeywords = [
  'README', 'readme', 'awesome_ai_tools', 'guide', 'documentation', 
  'manual', 'model', 'tools', 'agent', 'prompt.md', 'cursor agent',
  'v0', 'devin', 'anthropic', 'claude', 'gemini', 'grok', 'mistral'
];

// File extensions that are likely documentation
const docExtensions = ['.md', '.txt'];

// Analyze each entry
const nonPrompts = [];

data.forEach((entry, index) => {
  const title = entry.title?.toLowerCase() || '';
  const source = entry.source?.toLowerCase() || '';
  const description = entry.description?.toLowerCase() || '';
  const fullPrompt = entry.fullPrompt?.toLowerCase() || '';
  
  // Check if title or source contains non-prompt keywords
  const isNonPrompt = 
    nonPromptKeywords.some(keyword => 
      title.includes(keyword) || 
      source.includes(keyword)
    ) ||
    docExtensions.some(ext => source.includes(ext)) ||
    // Check if it's too long (likely documentation)
    (fullPrompt.length > 50000) ||
    // Check if it starts with specific patterns
    fullPrompt.startsWith('# awesome') ||
    fullPrompt.includes('# Awesome') ||
    fullPrompt.startsWith('You are interacting via') ||
    fullPrompt.includes('system prompt') && fullPrompt.length > 20000;
  
  if (isNonPrompt) {
    nonPrompts.push({
      index: index,
      id: entry.id,
      title: entry.title,
      source: entry.source,
      descriptionLength: entry.description?.length || 0,
      promptLength: entry.fullPrompt?.length || 0
    });
  }
});

// Save results
fs.writeFileSync('non-prompts-list.json', JSON.stringify(nonPrompts, null, 2));

console.log(`Found ${nonPrompts.length} non-prompt entries out of ${data.length} total entries`);
console.log('\nFirst 50 non-prompt entries:');
nonPrompts.slice(0, 50).forEach(item => {
  console.log(`\n${item.index}. ${item.title}`);
  console.log(`   Source: ${item.source}`);
  console.log(`   Description: ${item.descriptionLength} chars`);
  console.log(`   Prompt: ${item.promptLength} chars`);
});

console.log(`\nFull list saved to non-prompts-list.json`);
