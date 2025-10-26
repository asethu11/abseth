const fs = require('fs');
const path = require('path');

// Create output directory
const outputDir = 'extracted-prompts-library/prompt-library';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to recursively find all prompt directories
function findPromptDirs(dir, dirs = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Check if this directory contains prompt files
            const promptFile = path.join(fullPath, 'prompt.md');
            if (fs.existsSync(promptFile)) {
                dirs.push(fullPath);
            }
        }
    }
    
    return dirs;
}

// Find all prompt directories
const promptDirs = findPromptDirs('prompt-library/prompts');

// Process each prompt directory
promptDirs.forEach((dirPath, index) => {
    const dirName = path.basename(dirPath);
    
    // Read prompt.md
    const promptFile = path.join(dirPath, 'prompt.md');
    const promptContent = fs.readFileSync(promptFile, 'utf8');
    
    // Read metadata.yml
    const metadataFile = path.join(dirPath, 'metadata.yml');
    let metadata = {};
    if (fs.existsSync(metadataFile)) {
        const metadataContent = fs.readFileSync(metadataFile, 'utf8');
        // Simple YAML parsing for basic fields
        metadata = parseSimpleYaml(metadataContent);
    }
    
    // Read README.md if exists
    const readmeFile = path.join(dirPath, 'README.md');
    let readmeContent = '';
    if (fs.existsSync(readmeFile)) {
        readmeContent = fs.readFileSync(readmeFile, 'utf8');
    }
    
    // Create markdown content
    const markdownContent = `# ${metadata.title || dirName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

## Category
${metadata.primary_category || 'General'}

## Subcategories
${(metadata.subcategories || []).join(', ')}

## Tags
${(metadata.tags || []).join(', ')}

## Description
${metadata.description || 'No description available'}

## One Line Description
${metadata.one_line_description || 'No one-line description available'}

## Variables
${metadata.variables ? metadata.variables.map(v => `- **${v.name}**: ${v.role} ${v.optional_for_user ? '(Optional)' : '(Required)'}`).join('\n') : 'No variables defined'}

## Fragments
${metadata.fragments ? metadata.fragments.map(f => `- **${f.name}** (${f.category}): ${f.variable}`).join('\n') : 'No fragments defined'}

## Prompt Content
${promptContent}

## README
${readmeContent}

## Metadata
\`\`\`yaml
${fs.existsSync(metadataFile) ? fs.readFileSync(metadataFile, 'utf8') : 'No metadata file found'}
\`\`\`

## Usage
This prompt can be used with the prompt-library-cli or adapted for other AI models.

## Source
Extracted from: prompt-library
`;

    // Create filename
    const outputFileName = `${dirName}.md`;
    const outputPath = path.join(outputDir, outputFileName);
    
    // Write file
    fs.writeFileSync(outputPath, markdownContent);
});

// Simple YAML parser for basic fields
function parseSimpleYaml(content) {
    const result = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
        const match = line.match(/^(\w+):\s*(.*)$/);
        if (match) {
            const [, key, value] = match;
            result[key] = value.trim();
        }
    }
    
    // Handle arrays (simple implementation)
    if (result.tags && result.tags.startsWith('[')) {
        result.tags = result.tags.slice(1, -1).split(',').map(tag => tag.trim().replace(/^- /, ''));
    }
    
    if (result.subcategories && result.subcategories.startsWith('[')) {
        result.subcategories = result.subcategories.slice(1, -1).split(',').map(sub => sub.trim().replace(/^- /, ''));
    }
    
    return result;
}

console.log(`Extracted ${promptDirs.length} prompts from prompt-library`);
console.log(`Saved to: ${outputDir}`);

// Create README for prompt-library
const readmeContent = `# Prompt Library - Extracted

This folder contains all prompts extracted from the prompt-library.

## Source
- Repository: prompt-library
- Focus: Professional prompt templates with metadata and fragment support

## Key Features
- **Structured Metadata**: Each prompt includes detailed metadata with tags, categories, and variables
- **Fragment Support**: Prompts can use reusable text fragments
- **Variable System**: Support for customizable variables and placeholders
- **Professional Quality**: High-quality prompts designed for various professional use cases

## Categories
- **Prompt Engineering**: Tools for creating and optimizing prompts
- **Coding**: Development-focused prompts and tools
- **Content Creation**: Writing and documentation prompts
- **Healthcare**: Medical and wellness-related prompts
- **Problem Solving**: Analytical and problem-solving frameworks
- **Translation**: Language translation and communication

## Files
${promptDirs.map(dir => `- ${path.basename(dir)}`).join('\n')}

## Usage
These prompts are designed to work with the prompt-library-cli but can be adapted for other AI models. Each prompt includes variable placeholders that can be customized for specific use cases.
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);
