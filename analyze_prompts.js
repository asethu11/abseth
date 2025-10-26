const fs = require('fs');
const prompts = JSON.parse(fs.readFileSync('processed-prompts/unique-prompts.json', 'utf8'));

console.log('=== ANALYSIS RESULTS ===');
console.log('Total prompts:', prompts.length);

// Date pattern titles
const datePatterns = prompts.filter(p => /^\d{8}-\d+$/.test(p.title));
console.log('\nDate pattern titles:', datePatterns.length);
datePatterns.forEach(p => console.log('  -', p.title));

// Short descriptions (< 20 chars)
const shortDescriptions = prompts.filter(p => p.description && p.description.length < 20);
console.log('\nShort descriptions (< 20 chars):', shortDescriptions.length);
shortDescriptions.slice(0, 10).forEach(p => console.log('  -', p.title, ':', p.description.substring(0, 50) + '...'));

// Long prompts (> 10,000 chars)
const longPrompts = prompts.filter(p => p.fullPrompt && p.fullPrompt.length > 10000);
console.log('\nLong prompts (> 10,000 chars):', longPrompts.length);
longPrompts.forEach(p => console.log('  -', p.title, ':', p.fullPrompt.length, 'chars'));

// Poor titles (generic, non-descriptive)
const poorTitles = prompts.filter(p => 
  ['compose', 'cursor agent', 'cursor chat', 'devin'].includes(p.title.toLowerCase()) ||
  p.title.length < 5 ||
  (/^[a-z]+$/.test(p.title) && p.title.length < 10)
);
console.log('\nPoor titles:', poorTitles.length);
poorTitles.forEach(p => console.log('  -', p.title));

// API documentation prompts
const apiDocs = prompts.filter(p => 
  p.description && (
    p.description.includes('openapi') ||
    p.description.includes('API documentation') ||
    p.description.includes('"openapi":') ||
    p.description.includes('"swagger":')
  )
);
console.log('\nAPI documentation prompts:', apiDocs.length);
apiDocs.forEach(p => console.log('  -', p.title));

// Code-heavy prompts (>80% code)
const codeHeavyPrompts = prompts.filter(p => {
  if (!p.fullPrompt) return false;
  const codeBlocks = (p.fullPrompt.match(/```[\s\S]*?```/g) || []).join('');
  const codeRatio = codeBlocks.length / p.fullPrompt.length;
  return codeRatio > 0.8;
});
console.log('\nCode-heavy prompts (>80% code):', codeHeavyPrompts.length);
codeHeavyPrompts.slice(0, 10).forEach(p => {
  const codeBlocks = (p.fullPrompt.match(/```[\s\S]*?```/g) || []).join('');
  const codeRatio = codeBlocks.length / p.fullPrompt.length;
  console.log('  -', p.title, ':', Math.round(codeRatio * 100) + '% code');
});

// Incomplete prompts (containing "TODO", "FIXME", "..." at end)
const incompletePrompts = prompts.filter(p => 
  p.fullPrompt && (
    p.fullPrompt.includes('TODO') ||
    p.fullPrompt.includes('FIXME') ||
    p.fullPrompt.endsWith('...') ||
    p.fullPrompt.includes('[incomplete]') ||
    p.fullPrompt.includes('[cut off]')
  )
);
console.log('\nIncomplete prompts:', incompletePrompts.length);
incompletePrompts.slice(0, 10).forEach(p => console.log('  -', p.title));

// Docker/compose files in wrong category
const dockerComposePrompts = prompts.filter(p => 
  p.description && p.description.includes('"services":') && 
  p.description.includes('"postgres":') &&
  p.category === 'System Prompts'
);
console.log('\nDocker compose files in System Prompts:', dockerComposePrompts.length);
dockerComposePrompts.forEach(p => console.log('  -', p.title));
