const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvContent = fs.readFileSync('awesome-chatgpt-prompts/prompts.csv', 'utf8');
const lines = csvContent.split('\n');

// Skip header line and filter empty lines
const promptLines = lines.slice(1).filter(line => line.trim());

console.log(`Found ${promptLines.length} prompt lines in CSV`);

// Create output directory
const outputDir = 'extracted-prompts-library/awesome-chatgpt-prompts/prompts';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to categorize prompts
function categorizePrompt(title, prompt) {
    const titleLower = title.toLowerCase();
    const promptLower = prompt.toLowerCase();
    
    if (titleLower.includes('developer') || titleLower.includes('programmer') || 
        titleLower.includes('terminal') || titleLower.includes('javascript') || 
        titleLower.includes('excel') || titleLower.includes('cyber security') ||
        titleLower.includes('ux') || titleLower.includes('web design') ||
        promptLower.includes('code') || promptLower.includes('programming')) {
        return 'Development & Technical';
    }
    
    if (titleLower.includes('writer') || titleLower.includes('novelist') || 
        titleLower.includes('poet') || titleLower.includes('screenwriter') ||
        titleLower.includes('storyteller') || titleLower.includes('rapper') ||
        promptLower.includes('write') || promptLower.includes('story')) {
        return 'Creative & Writing';
    }
    
    if (titleLower.includes('business') || titleLower.includes('recruiter') ||
        titleLower.includes('accountant') || titleLower.includes('real estate') ||
        titleLower.includes('advertiser') || titleLower.includes('logistician')) {
        return 'Business & Professional';
    }
    
    if (titleLower.includes('teacher') || titleLower.includes('philosophy') ||
        titleLower.includes('math') || titleLower.includes('tutor') ||
        titleLower.includes('translator') || titleLower.includes('etymologist')) {
        return 'Education & Learning';
    }
    
    if (titleLower.includes('doctor') || titleLower.includes('dentist') ||
        titleLower.includes('trainer') || titleLower.includes('mental health') ||
        titleLower.includes('behaviorist')) {
        return 'Health & Wellness';
    }
    
    if (titleLower.includes('comedian') || titleLower.includes('magician') ||
        titleLower.includes('commentator') || titleLower.includes('critic') ||
        titleLower.includes('composer')) {
        return 'Entertainment & Media';
    }
    
    return 'General Purpose';
}

// Function to generate tags
function generateTags(title, prompt, category) {
    const tags = [category.toLowerCase().replace(/[^a-z0-9]/g, '-')];
    
    const titleLower = title.toLowerCase();
    const promptLower = prompt.toLowerCase();
    
    // Add specific tags based on content
    if (promptLower.includes('act as')) tags.push('role-playing');
    if (promptLower.includes('creative')) tags.push('creative');
    if (promptLower.includes('technical') || promptLower.includes('code')) tags.push('technical');
    if (promptLower.includes('professional')) tags.push('professional');
    if (promptLower.includes('educational')) tags.push('educational');
    
    return tags;
}

// Function to parse CSV line properly handling quoted fields
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Process each prompt
let processedCount = 0;
promptLines.forEach((line, index) => {
    try {
        // Parse CSV line properly
        const fields = parseCSVLine(line);
        
        if (fields.length < 3) {
            console.log(`Skipping line ${index + 2}: insufficient fields (${fields.length})`);
            return;
        }
        
        const title = fields[0].replace(/"/g, '');
        const prompt = fields[1].replace(/"/g, '');
        const forDevs = fields[2] === 'TRUE';
        
        const category = categorizePrompt(title, prompt);
        const tags = generateTags(title, prompt, category);
        
        // Create markdown content
        const markdownContent = `# ${title}

## Category
${category}

## Tags
${tags.join(', ')}

## Dedicated to Developers
${forDevs ? 'Yes' : 'No'}

## Prompt
${prompt}

## Usage
This prompt can be used with any AI model that supports role-playing or specific behavior instructions.

## Source
Extracted from: awesome-chatgpt-prompts library
`;

        // Create filename (sanitize title)
        const filename = title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
        
        // Write file
        const filePath = path.join(outputDir, `${filename}.md`);
        fs.writeFileSync(filePath, markdownContent);
        
        processedCount++;
        
        if (processedCount % 50 === 0) {
            console.log(`Processed ${processedCount}/${promptLines.length} prompts...`);
        }
        
    } catch (error) {
        console.error(`Error processing line ${index + 2}:`, error.message);
        console.error(`Line content:`, line.substring(0, 100) + '...');
    }
});

console.log(`Successfully extracted ${processedCount} prompts from awesome-chatgpt-prompts library`);
console.log(`Saved to: ${outputDir}`);
