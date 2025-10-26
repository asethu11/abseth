const fs = require('fs');
const path = require('path');

// Create output directory
const outputDir = 'extracted-prompts-library/priompt';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to recursively find all relevant files
function findFiles(dir, extensions = ['.tsx', '.ts', '.yaml', '.yml', '.md'], files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            findFiles(fullPath, extensions, files);
        } else if (extensions.some(ext => item.endsWith(ext))) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Find all relevant files
const sourceFiles = findFiles('priompt/examples/src');
const exampleFiles = findFiles('priompt/examples/priompt');

// Process source files (TSX/TS files with prompt definitions)
sourceFiles.forEach((filePath, index) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Extract prompt functions and their content
    const promptFunctions = content.match(/export function (\w+)\([^)]*\): PromptElement \{[\s\S]*?\}/g) || [];
    
    promptFunctions.forEach((func, funcIndex) => {
        const funcName = func.match(/export function (\w+)/)[1];
        const systemMessages = func.match(/<SystemMessage>([\s\S]*?)<\/SystemMessage>/g) || [];
        const userMessages = func.match(/<UserMessage>([\s\S]*?)<\/UserMessage>/g) || [];
        
        // Extract the actual content from JSX
        const systemContent = systemMessages.map(msg => 
            msg.replace(/<SystemMessage>|<\/SystemMessage>/g, '').trim()
        ).join('\n\n');
        
        const userContent = userMessages.map(msg => 
            msg.replace(/<UserMessage>|<\/UserMessage>/g, '').trim()
        ).join('\n\n');
        
        // Create markdown content
        const markdownContent = `# ${funcName}

## Category
Priompt Framework

## Tags
priompt, jsx, react, priority-based, prompt-engineering

## Framework
Priompt (Priority + Prompt) - A JSX-based prompting library that uses priorities to decide what to include in the context window.

## System Message
${systemContent || 'No system message defined'}

## User Message Template
${userContent || 'No user message template defined'}

## Full Function Code
\`\`\`tsx
${func}
\`\`\`

## Source File
${filePath}

## Usage
This is a Priompt component that can be used with the Priompt framework for dynamic prompt rendering based on priority.

## Source
Extracted from: priompt library
`;

        // Create filename
        const outputFileName = `${funcName}.md`;
        const outputPath = path.join(outputDir, outputFileName);
        
        // Write file
        fs.writeFileSync(outputPath, markdownContent);
    });
});

// Process example YAML files
exampleFiles.forEach((filePath, index) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, path.extname(filePath));
    const dirName = path.basename(path.dirname(filePath));
    
    // Create markdown content
    const markdownContent = `# ${fileName}

## Category
Priompt Example

## Tags
priompt, example, yaml, configuration

## Example Directory
${dirName}

## YAML Content
\`\`\`yaml
${content}
\`\`\`

## Source File
${filePath}

## Usage
This is an example configuration file for the Priompt framework.

## Source
Extracted from: priompt library
`;

    // Create filename
    const outputFileName = `${dirName}-${fileName}.md`;
    const outputPath = path.join(outputDir, outputFileName);
    
    // Write file
    fs.writeFileSync(outputPath, markdownContent);
});

console.log(`Extracted prompts from priompt library`);
console.log(`Processed ${sourceFiles.length} source files and ${exampleFiles.length} example files`);
console.log(`Saved to: ${outputDir}`);

// Create README for priompt
const readmeContent = `# Priompt - Extracted

This folder contains all prompts extracted from the priompt library.

## Source
- Repository: priompt
- Focus: JSX-based prompting library with priority-based context management

## What is Priompt?
Priompt (Priority + Prompt) is a JSX-based prompting library that uses priorities to decide what to include in the context window. It's inspired by web design libraries like React.

## Key Features
- **Priority-Based Rendering**: Uses priorities to decide what to include in the context window
- **JSX Components**: Build prompts using familiar React-like syntax
- **Dynamic Context Management**: Automatically manages context window size
- **Reusable Components**: Create modular, reusable prompt components

## Components
- **SystemMessage**: System-level instructions
- **UserMessage**: User input
- **Scope**: Set priorities for content inclusion
- **Capture**: Capture and parse output
- **Empty**: Reserve tokens for generation

## Files
${sourceFiles.map(file => `- ${file}`).join('\n')}
${exampleFiles.map(file => `- ${file}`).join('\n')}
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);
