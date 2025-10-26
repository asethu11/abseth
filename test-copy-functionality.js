// Simple test to verify copy functionality
const fs = require('fs');

// Read a sample prompt from the JSON file
const promptsData = JSON.parse(fs.readFileSync('prompt-marketplace/data/prompts.json', 'utf8'));

if (promptsData.length > 0) {
    const samplePrompt = promptsData[0];
    
    console.log('Sample prompt data:');
    console.log(`Title: ${samplePrompt.title}`);
    console.log(`Has fullPrompt: ${!!samplePrompt.fullPrompt}`);
    console.log(`fullPrompt length: ${samplePrompt.fullPrompt ? samplePrompt.fullPrompt.length : 0}`);
    
    if (samplePrompt.fullPrompt) {
        console.log('\nFirst 200 characters of fullPrompt:');
        console.log(samplePrompt.fullPrompt.substring(0, 200) + '...');
        
        console.log('\n✅ Copy functionality should work - prompt has fullPrompt content');
    } else {
        console.log('\n❌ Copy functionality will not work - no fullPrompt content');
    }
} else {
    console.log('❌ No prompts found in the data file');
}
