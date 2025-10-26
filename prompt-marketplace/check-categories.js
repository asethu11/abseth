const fs = require('fs');

const prompts = JSON.parse(fs.readFileSync('data/prompts.json', 'utf8'));
const categories = {};

prompts.forEach(p => {
  categories[p.category] = (categories[p.category] || 0) + 1;
});

console.log('📊 Category Distribution:');
console.log('========================');
Object.entries(categories)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`${cat}: ${count} prompts`);
  });

console.log(`\n📈 Total prompts: ${prompts.length}`);
