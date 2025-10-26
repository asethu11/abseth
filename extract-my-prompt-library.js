const fs = require('fs');
const path = require('path');

// Create output directory
const outputDir = 'extracted-prompts-library/my-prompt-library';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to recursively find all prompt files
function findPromptFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            findPromptFiles(fullPath, files);
        } else if (item.endsWith('.txt') || item.endsWith('.md')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Find all prompt files
const promptFiles = findPromptFiles('my-prompt-library/prompts');

// Process each prompt file
promptFiles.forEach((filePath, index) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative('my-prompt-library/prompts', filePath);
    const dirName = path.dirname(relativePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Determine category based on directory structure
    let category = 'General';
    let tags = ['template'];
    
    if (relativePath.includes('stock-portfolio')) {
        category = 'Finance & Investment';
        tags = ['finance', 'investment', 'portfolio', 'damodaran', 'valuation'];
    } else if (relativePath.includes('understand-academic-paper')) {
        category = 'Education & Research';
        tags = ['education', 'research', 'academic', 'feynman-technique', 'analysis'];
    }
    
    // Create markdown content
    const markdownContent = `# ${fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

## Category
${category}

## Tags
${tags.join(', ')}

## Source Path
${relativePath}

## Prompt Content
${content}

## Usage
This prompt template can be customized by replacing placeholder values with your specific inputs.

## Source
Extracted from: my-prompt-library
`;

    // Create filename
    const outputFileName = `${fileName}.md`;
    const outputPath = path.join(outputDir, outputFileName);
    
    // Write file
    fs.writeFileSync(outputPath, markdownContent);
});

console.log(`Extracted ${promptFiles.length} prompt files from my-prompt-library`);
console.log(`Saved to: ${outputDir}`);

// Create README for my-prompt-library
const readmeContent = `# My Prompt Library - Extracted

This folder contains all prompts extracted from the my-prompt-library.

## Source
- Repository: my-prompt-library
- Focus: Advanced analytical and educational prompts using proven frameworks

## Categories
- **Finance & Investment**: Stock portfolio analysis using Aswath Damodaran's framework
- **Education & Research**: Academic paper analysis using Feynman Technique

## Key Features
- **Structured Frameworks**: Uses established methodologies (Feynman Technique, Damodaran's valuation approach)
- **Step-by-Step Guidance**: Breaks down complex analysis into manageable steps
- **Multiple Perspectives**: Encourages examination from different angles
- **Template-Based**: Easy to customize with placeholder replacement

## Usage
These prompts work best with Claude 4 models but can be adapted for other LLMs. Replace placeholder values with your specific inputs.

## Files
${promptFiles.map(file => `- ${path.relative('my-prompt-library/prompts', file)}`).join('\n')}
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);
