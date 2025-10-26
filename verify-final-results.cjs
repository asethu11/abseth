const fs = require('fs');

const prompts = JSON.parse(fs.readFileSync('processed-prompts/unique-prompts.json', 'utf8'));

console.log('========================================');
console.log('Model Assignment - Final Summary');
console.log('========================================');
console.log(`Total prompts: ${prompts.length}`);
console.log('');

// Count model distribution
const modelCounts = {
  'GPT-4': 0,
  'Claude-3': 0,
  'Gemini': 0,
  'Model Agnostic': 0
};

const modelCombos = {};

prompts.forEach(prompt => {
  const combo = prompt.compatibleModels.join(', ');
  modelCombos[combo] = (modelCombos[combo] || 0) + 1;
  
  prompt.compatibleModels.forEach(model => {
    modelCounts[model] = (modelCounts[model] || 0) + 1;
  });
});

console.log('Model Distribution:');
console.log(`  GPT-4: ${modelCounts['GPT-4']} (${(modelCounts['GPT-4'] / prompts.length * 100).toFixed(1)}%)`);
console.log(`  Claude-3: ${modelCounts['Claude-3']} (${(modelCounts['Claude-3'] / prompts.length * 100).toFixed(1)}%)`);
console.log(`  Gemini: ${modelCounts['Gemini']} (${(modelCounts['Gemini'] / prompts.length * 100).toFixed(1)}%)`);
console.log(`  Model Agnostic: ${modelCounts['Model Agnostic']} (${(modelCounts['Model Agnostic'] / prompts.length * 100).toFixed(1)}%)`);
console.log('');

console.log('Top Model Combinations:');
Object.entries(modelCombos)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([combo, count]) => {
    console.log(`  ${combo}: ${count} (${(count / prompts.length * 100).toFixed(1)}%)`);
  });
console.log('');

console.log('Sample prompts:');
prompts.slice(0, 5).forEach((p, i) => {
  console.log(`${i + 1}. ${p.title.substring(0, 60)}...`);
  console.log(`   Models: ${p.compatibleModels.join(', ')}`);
  console.log('');
});

console.log('========================================');
