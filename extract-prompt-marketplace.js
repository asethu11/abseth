const fs = require('fs');
const path = require('path');

// Create output directory
const outputDir = 'extracted-prompts-library/prompt-marketplace';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read the prompts.json file
const promptsFile = 'prompt-marketplace/data/prompts.json';
if (!fs.existsSync(promptsFile)) {
    console.log('prompts.json file not found');
    return;
}

const promptsData = JSON.parse(fs.readFileSync(promptsFile, 'utf8'));

// Process each prompt
promptsData.forEach((prompt, index) => {
    // Create markdown content
    const markdownContent = `# ${prompt.title}

## Category
${prompt.category || 'General'}

## Tags
${(prompt.tags || []).join(', ')}

## Description
${prompt.description || 'No description available'}

## Full Prompt
${prompt.fullPrompt || 'No prompt content available'}

## Source
Extracted from: prompt-marketplace

## Usage
This prompt was designed for the prompt marketplace and can be used with various AI models.

## Original Data
\`\`\`json
${JSON.stringify(prompt, null, 2)}
\`\`\`
`;

    // Create filename (sanitize title)
    const filename = prompt.title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
    const outputFileName = `${filename}.md`;
    const outputPath = path.join(outputDir, outputFileName);
    
    // Write file
    fs.writeFileSync(outputPath, markdownContent);
});

console.log(`Extracted ${promptsData.length} prompts from prompt-marketplace`);
console.log(`Saved to: ${outputDir}`);

// Create README for prompt-marketplace
const readmeContent = `# Prompt Marketplace - Extracted

This folder contains all prompts extracted from the prompt-marketplace.

## Source
- Repository: prompt-marketplace
- Focus: Marketplace-style prompt collection with categories and tags

## Key Features
- **Categorized Prompts**: Organized by categories like Data Analysis, Communication, etc.
- **Tagged Content**: Each prompt includes relevant tags for easy discovery
- **Marketplace Format**: Designed for a prompt marketplace platform
- **Diverse Collection**: Various types of prompts for different use cases

## Categories
${[...new Set(promptsData.map(p => p.category).filter(Boolean))].map(cat => `- **${cat}**`).join('\n')}

## Total Prompts
${promptsData.length} prompts extracted

## Files
${promptsData.map((prompt, index) => `- ${prompt.title}`).join('\n')}

## Usage
These prompts were designed for a marketplace platform and can be used with various AI models. Each prompt includes categorization and tagging for easy organization and discovery.
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);
