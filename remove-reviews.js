const fs = require('fs');
const path = require('path');

// Read current prompts.json
const promptsData = JSON.parse(fs.readFileSync('prompt-marketplace/data/prompts.json', 'utf8'));

console.log(`Processing ${promptsData.length} prompts to remove all review data...`);

// Remove all review-related data from each prompt
promptsData.forEach((prompt, index) => {
    // Remove rating and reviewCount fields
    delete prompt.rating;
    delete prompt.reviewCount;
    
    // Remove any other review-related fields
    delete prompt.reviews;
    delete prompt.userReviews;
    delete prompt.averageRating;
    delete prompt.totalReviews;
    
    if (index % 50 === 0) {
        console.log(`Processed ${index + 1}/${promptsData.length} prompts...`);
    }
});

// Write updated prompts.json
fs.writeFileSync('prompt-marketplace/data/prompts.json', JSON.stringify(promptsData, null, 2));

console.log(`\nReviews removal complete!`);
console.log(`- Total prompts processed: ${promptsData.length}`);
console.log(`- Removed rating and reviewCount from all prompts`);
console.log(`- Updated prompts.json without review data`);
