const fs = require('fs');
const path = require('path');

// Function to parse markdown content and extract prompt information
function parseMarkdownPrompt(filePath, content) {
    const lines = content.split('\n');
    let title = '';
    let category = '';
    let tags = [];
    let description = '';
    let fullPrompt = '';
    let source = '';
    
    let currentSection = '';
    let promptContent = [];
    let inPromptSection = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('# ')) {
            title = line.substring(2).trim();
        } else if (line.startsWith('## Category')) {
            currentSection = 'category';
        } else if (line.startsWith('## Tags')) {
            currentSection = 'tags';
        } else if (line.startsWith('## Description')) {
            currentSection = 'description';
        } else if (line.startsWith('## Prompt Content') || line.startsWith('## Full Prompt')) {
            currentSection = 'prompt';
            inPromptSection = true;
            promptContent = [];
        } else if (line.startsWith('## ')) {
            currentSection = '';
            inPromptSection = false;
        } else if (inPromptSection && line !== '') {
            promptContent.push(line);
        } else if (currentSection === 'category' && line !== '' && !line.startsWith('##')) {
            category = line;
        } else if (currentSection === 'tags' && line !== '' && !line.startsWith('##')) {
            tags = line.split(',').map(tag => tag.trim()).filter(tag => tag);
        } else if (currentSection === 'description' && line !== '' && !line.startsWith('##')) {
            description = line;
        } else if (line.includes('Extracted from:')) {
            source = line.split('Extracted from:')[1].trim();
        }
    }
    
    fullPrompt = promptContent.join('\n').trim();
    
    // If no prompt content found, try to extract from the entire content
    if (!fullPrompt) {
        const promptStart = content.indexOf('## Prompt Content');
        if (promptStart === -1) {
            const promptStart2 = content.indexOf('## Full Prompt');
            if (promptStart2 !== -1) {
                fullPrompt = content.substring(promptStart2 + 14).trim();
            } else {
                // Try to find the main content after headers
                const headerEnd = content.indexOf('\n\n', content.indexOf('# '));
                if (headerEnd !== -1) {
                    fullPrompt = content.substring(headerEnd).trim();
                }
            }
        } else {
            fullPrompt = content.substring(promptStart + 17).trim();
        }
    }
    
    // Generate unique ID
    const id = generateId(title, source, filePath);
    
    // Generate rating and review count (random but realistic)
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0
    const reviewCount = Math.floor(Math.random() * 200) + 10; // 10 to 210
    
    // Determine compatible models based on source
    const compatibleModels = getCompatibleModels(source, category);
    
    // Generate creation date
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
    
    // Determine if featured (top 10% by rating)
    const featured = parseFloat(rating) > 4.5 && reviewCount > 50;
    
    return {
        id,
        title: title || path.basename(filePath, '.md').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: description || `A ${category.toLowerCase()} prompt from ${source}`,
        fullPrompt: fullPrompt || content,
        category: category || 'General',
        tags: tags.length > 0 ? tags : ['general'],
        rating: parseFloat(rating),
        reviewCount,
        compatibleModels,
        createdAt,
        featured,
        source: source || 'extracted'
    };
}

// Generate unique ID based on title, source, and file path
function generateId(title, source, filePath) {
    const baseId = (title || path.basename(filePath, '.md'))
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    const sourcePrefix = (source || 'extracted').toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 3);
    return `${sourcePrefix}-${baseId}-${Math.random().toString(36).substr(2, 6)}`;
}

// Determine compatible models based on source and category
function getCompatibleModels(source, category) {
    const allModels = ['GPT-4', 'GPT-3.5', 'Claude-3', 'Gemini Pro'];
    
    if (source.includes('awesome-chatgpt')) {
        return ['GPT-4', 'GPT-3.5', 'Claude-3'];
    } else if (source.includes('priompt')) {
        return ['GPT-4', 'Claude-3']; // Advanced prompting
    } else if (source.includes('my-prompt-library')) {
        return ['Claude-3', 'GPT-4']; // Analytical frameworks
    } else if (source.includes('prompt-library')) {
        return ['GPT-4', 'Claude-3', 'Gemini Pro']; // Professional templates
    } else {
        return allModels;
    }
}

// Function to recursively find all markdown files (including README files)
function findMarkdownFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && item !== 'node_modules' && item !== '.git') {
            findMarkdownFiles(fullPath, files);
        } else if (item.endsWith('.md')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Find all markdown files in extracted-prompts-library
const extractedDir = 'extracted-prompts-library';
const markdownFiles = findMarkdownFiles(extractedDir);

console.log(`Found ${markdownFiles.length} markdown files to convert`);

// Convert all markdown files to JSON format
const convertedPrompts = [];
const skippedFiles = [];

markdownFiles.forEach((filePath, index) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Skip README files and files that are too short
        if (path.basename(filePath).includes('README') || content.length < 100) {
            skippedFiles.push(filePath);
            return;
        }
        
        const promptData = parseMarkdownPrompt(filePath, content);
        
        // Only add if we have meaningful content
        if (promptData.title && promptData.fullPrompt && promptData.fullPrompt.length > 50) {
            convertedPrompts.push(promptData);
        } else {
            skippedFiles.push(filePath);
        }
        
        if (index % 50 === 0) {
            console.log(`Processed ${index + 1}/${markdownFiles.length} files...`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        skippedFiles.push(filePath);
    }
});

console.log(`\nConversion results:`);
console.log(`- Total files found: ${markdownFiles.length}`);
console.log(`- Successfully converted: ${convertedPrompts.length}`);
console.log(`- Skipped files: ${skippedFiles.length}`);

if (skippedFiles.length > 0) {
    console.log(`\nSkipped files:`);
    skippedFiles.forEach(file => console.log(`- ${file}`));
}

// Read existing prompts.json to merge
const existingPromptsPath = 'prompt-marketplace/data/prompts.json';
let existingPrompts = [];

if (fs.existsSync(existingPromptsPath)) {
    try {
        existingPrompts = JSON.parse(fs.readFileSync(existingPromptsPath, 'utf8'));
        console.log(`\nFound ${existingPrompts.length} existing prompts`);
    } catch (error) {
        console.error('Error reading existing prompts.json:', error.message);
    }
}

// Merge existing and converted prompts
const allPrompts = [...existingPrompts, ...convertedPrompts];

// Remove duplicates based on title and source
const uniquePrompts = [];
const seen = new Set();

allPrompts.forEach(prompt => {
    const key = `${prompt.title}-${prompt.source || 'unknown'}`.toLowerCase();
    if (!seen.has(key)) {
        seen.add(key);
        uniquePrompts.push(prompt);
    }
});

// Sort by creation date (newest first)
uniquePrompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

// Update prompts.json
fs.writeFileSync(existingPromptsPath, JSON.stringify(uniquePrompts, null, 2));

console.log(`\nFinal results:`);
console.log(`- Converted prompts: ${convertedPrompts.length}`);
console.log(`- Existing prompts: ${existingPrompts.length}`);
console.log(`- Total unique prompts: ${uniquePrompts.length}`);
console.log(`- Updated prompts.json with ${uniquePrompts.length} prompts`);

// Generate summary by source
const sourceSummary = {};
uniquePrompts.forEach(prompt => {
    const source = prompt.source || 'unknown';
    sourceSummary[source] = (sourceSummary[source] || 0) + 1;
});

console.log('\nSummary by source:');
Object.entries(sourceSummary).forEach(([source, count]) => {
    console.log(`- ${source}: ${count} prompts`);
});

// Generate summary by category
const categorySummary = {};
uniquePrompts.forEach(prompt => {
    const category = prompt.category || 'General';
    categorySummary[category] = (categorySummary[category] || 0) + 1;
});

console.log('\nSummary by category:');
Object.entries(categorySummary)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15) // Show top 15 categories
    .forEach(([category, count]) => {
        console.log(`- ${category}: ${count} prompts`);
    });
