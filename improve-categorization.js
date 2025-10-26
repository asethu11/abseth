const fs = require('fs');
const path = require('path');

// Read current prompts.json
const promptsData = JSON.parse(fs.readFileSync('prompt-marketplace/data/prompts.json', 'utf8'));

console.log(`Processing ${promptsData.length} prompts for improved categorization...`);

// Enhanced categorization logic
function categorizePrompt(prompt) {
    const title = prompt.title.toLowerCase();
    const description = prompt.description.toLowerCase();
    const fullPrompt = prompt.fullPrompt.toLowerCase();
    const tags = prompt.tags.join(' ').toLowerCase();
    const source = prompt.source || '';
    
    const allText = `${title} ${description} ${fullPrompt} ${tags}`.toLowerCase();
    
    // Development & Programming
    if (title.includes('developer') || title.includes('programmer') || 
        title.includes('terminal') || title.includes('javascript') || 
        title.includes('excel') || title.includes('cyber security') ||
        title.includes('ux') || title.includes('web design') ||
        title.includes('software') || title.includes('code') ||
        title.includes('programming') || title.includes('debug') ||
        title.includes('api') || title.includes('database') ||
        title.includes('algorithm') || title.includes('framework') ||
        allText.includes('act as a developer') || allText.includes('act as a programmer') ||
        allText.includes('write code') || allText.includes('debug code') ||
        allText.includes('programming language') || allText.includes('software development')) {
        return 'Development & Programming';
    }
    
    // Creative Writing
    if (title.includes('writer') || title.includes('novelist') || 
        title.includes('poet') || title.includes('screenwriter') ||
        title.includes('storyteller') || title.includes('rapper') ||
        title.includes('blogger') || title.includes('copywriter') ||
        title.includes('content writer') || title.includes('script writer') ||
        allText.includes('write a story') || allText.includes('creative writing') ||
        allText.includes('write a poem') || allText.includes('write an article') ||
        allText.includes('write content') || allText.includes('storytelling')) {
        return 'Creative Writing';
    }
    
    // Business & Professional
    if (title.includes('business') || title.includes('recruiter') ||
        title.includes('accountant') || title.includes('real estate') ||
        title.includes('advertiser') || title.includes('logistician') ||
        title.includes('manager') || title.includes('consultant') ||
        title.includes('marketing') || title.includes('sales') ||
        title.includes('entrepreneur') || title.includes('investor') ||
        allText.includes('business plan') || allText.includes('marketing strategy') ||
        allText.includes('financial analysis') || allText.includes('project management') ||
        allText.includes('customer service') || allText.includes('leadership')) {
        return 'Business & Professional';
    }
    
    // Education & Learning
    if (title.includes('teacher') || title.includes('tutor') ||
        title.includes('professor') || title.includes('instructor') ||
        title.includes('translator') || title.includes('etymologist') ||
        title.includes('academic') || title.includes('researcher') ||
        title.includes('student') || title.includes('learning') ||
        allText.includes('explain') || allText.includes('teach') ||
        allText.includes('educational') || allText.includes('learning') ||
        allText.includes('study guide') || allText.includes('curriculum') ||
        allText.includes('academic') || allText.includes('research')) {
        return 'Education & Learning';
    }
    
    // Health & Wellness
    if (title.includes('doctor') || title.includes('dentist') ||
        title.includes('trainer') || title.includes('mental health') ||
        title.includes('behaviorist') || title.includes('therapist') ||
        title.includes('nutritionist') || title.includes('fitness') ||
        title.includes('wellness') || title.includes('medical') ||
        allText.includes('health advice') || allText.includes('medical') ||
        allText.includes('therapy') || allText.includes('wellness') ||
        allText.includes('fitness') || allText.includes('nutrition') ||
        allText.includes('mental health') || allText.includes('treatment')) {
        return 'Health & Wellness';
    }
    
    // Entertainment & Media
    if (title.includes('comedian') || title.includes('magician') ||
        title.includes('commentator') || title.includes('critic') ||
        title.includes('composer') || title.includes('musician') ||
        title.includes('actor') || title.includes('director') ||
        title.includes('entertainer') || title.includes('performer') ||
        allText.includes('entertainment') || allText.includes('comedy') ||
        allText.includes('music') || allText.includes('film') ||
        allText.includes('performance') || allText.includes('show')) {
        return 'Entertainment & Media';
    }
    
    // Data Analysis & Research
    if (title.includes('analyst') || title.includes('researcher') ||
        title.includes('scientist') || title.includes('statistician') ||
        title.includes('data') || title.includes('research') ||
        title.includes('analysis') || title.includes('survey') ||
        allText.includes('data analysis') || allText.includes('research') ||
        allText.includes('statistics') || allText.includes('survey') ||
        allText.includes('analytics') || allText.includes('metrics') ||
        allText.includes('study') || allText.includes('investigation')) {
        return 'Data Analysis & Research';
    }
    
    // Security & Privacy
    if (title.includes('security') || title.includes('privacy') ||
        title.includes('cybersecurity') || title.includes('hacker') ||
        title.includes('penetration') || title.includes('audit') ||
        allText.includes('security') || allText.includes('privacy') ||
        allText.includes('cybersecurity') || allText.includes('vulnerability') ||
        allText.includes('encryption') || allText.includes('firewall') ||
        allText.includes('malware') || allText.includes('threat')) {
        return 'Security & Privacy';
    }
    
    // Communication & Language
    if (title.includes('translator') || title.includes('interpreter') ||
        title.includes('communicator') || title.includes('speaker') ||
        title.includes('linguist') || title.includes('language') ||
        allText.includes('translation') || allText.includes('language') ||
        allText.includes('communication') || allText.includes('speaking') ||
        allText.includes('pronunciation') || allText.includes('dialect')) {
        return 'Communication & Language';
    }
    
    // Personal Development
    if (title.includes('coach') || title.includes('mentor') ||
        title.includes('counselor') || title.includes('advisor') ||
        title.includes('motivation') || title.includes('productivity') ||
        title.includes('lifestyle') || title.includes('self-help') ||
        allText.includes('personal development') || allText.includes('motivation') ||
        allText.includes('goal setting') || allText.includes('self improvement') ||
        allText.includes('productivity') || allText.includes('lifestyle') ||
        allText.includes('coaching') || allText.includes('advice')) {
        return 'Personal Development';
    }
    
    // Technical Writing & Documentation
    if (title.includes('technical writer') || title.includes('documentation') ||
        title.includes('manual') || title.includes('guide') ||
        title.includes('tutorial') || title.includes('instructions') ||
        allText.includes('technical writing') || allText.includes('documentation') ||
        allText.includes('user manual') || allText.includes('tutorial') ||
        allText.includes('instructions') || allText.includes('guide') ||
        allText.includes('documentation') || allText.includes('technical guide')) {
        return 'Technical Writing & Documentation';
    }
    
    // Philosophy & Critical Thinking
    if (title.includes('philosopher') || title.includes('thinker') ||
        title.includes('debater') || title.includes('logician') ||
        title.includes('philosophy') || title.includes('ethics') ||
        allText.includes('philosophy') || allText.includes('ethical') ||
        allText.includes('debate') || allText.includes('critical thinking') ||
        allText.includes('logic') || allText.includes('reasoning') ||
        allText.includes('moral') || allText.includes('ethics')) {
        return 'Philosophy & Critical Thinking';
    }
    
    // AI & Prompt Engineering
    if (source.includes('prompt-library') || source.includes('priompt') ||
        title.includes('ai') || title.includes('prompt') ||
        title.includes('assistant') || title.includes('agent') ||
        allText.includes('ai assistant') || allText.includes('prompt engineering') ||
        allText.includes('artificial intelligence') || allText.includes('machine learning') ||
        allText.includes('llm') || allText.includes('gpt') ||
        allText.includes('claude') || allText.includes('anthropic')) {
        return 'AI & Prompt Engineering';
    }
    
    // Finance & Investment
    if (title.includes('financial') || title.includes('investment') ||
        title.includes('portfolio') || title.includes('trading') ||
        title.includes('economist') || title.includes('analyst') ||
        allText.includes('financial analysis') || allText.includes('investment') ||
        allText.includes('portfolio') || allText.includes('trading') ||
        allText.includes('stock market') || allText.includes('valuation') ||
        allText.includes('damodaran') || allText.includes('finance')) {
        return 'Finance & Investment';
    }
    
    // Design & Creativity
    if (title.includes('designer') || title.includes('artist') ||
        title.includes('creative') || title.includes('aesthetic') ||
        title.includes('visual') || title.includes('graphic') ||
        allText.includes('design') || allText.includes('creative') ||
        allText.includes('artistic') || allText.includes('visual') ||
        allText.includes('graphic') || allText.includes('aesthetic')) {
        return 'Design & Creativity';
    }
    
    // Default category
    return 'General Purpose';
}

// Enhanced tag generation
function generateEnhancedTags(prompt, category) {
    const tags = [];
    const title = prompt.title.toLowerCase();
    const fullPrompt = prompt.fullPrompt.toLowerCase();
    const source = prompt.source || '';
    
    // Add category-based tags
    const categoryTag = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
    tags.push(categoryTag);
    
    // Add source-based tags
    if (source.includes('awesome-chatgpt')) {
        tags.push('role-playing', 'chatgpt-prompts');
    } else if (source.includes('prompt-library')) {
        tags.push('professional', 'template');
    } else if (source.includes('my-prompt-library')) {
        tags.push('analytical', 'framework');
    } else if (source.includes('priompt')) {
        tags.push('advanced', 'jsx');
    } else if (source.includes('marketplace')) {
        tags.push('marketplace', 'community');
    }
    
    // Add content-based tags
    if (fullPrompt.includes('act as')) tags.push('role-playing');
    if (fullPrompt.includes('creative')) tags.push('creative');
    if (fullPrompt.includes('technical') || fullPrompt.includes('code')) tags.push('technical');
    if (fullPrompt.includes('professional')) tags.push('professional');
    if (fullPrompt.includes('educational')) tags.push('educational');
    if (fullPrompt.includes('business')) tags.push('business');
    if (fullPrompt.includes('health')) tags.push('health');
    if (fullPrompt.includes('security')) tags.push('security');
    if (fullPrompt.includes('data')) tags.push('data-analysis');
    if (fullPrompt.includes('writing')) tags.push('writing');
    if (fullPrompt.includes('analysis')) tags.push('analysis');
    
    // Remove duplicates and return
    return [...new Set(tags)];
}

// Enhanced description generation
function generateEnhancedDescription(prompt, category) {
    const title = prompt.title;
    const source = prompt.source || '';
    
    // Generate more descriptive descriptions based on category and content
    const descriptions = {
        'Development & Programming': `A ${title.toLowerCase()} prompt for software development and programming tasks`,
        'Creative Writing': `A ${title.toLowerCase()} prompt for creative writing and storytelling`,
        'Business & Professional': `A ${title.toLowerCase()} prompt for business and professional applications`,
        'Education & Learning': `A ${title.toLowerCase()} prompt for educational and learning purposes`,
        'Health & Wellness': `A ${title.toLowerCase()} prompt for health and wellness guidance`,
        'Entertainment & Media': `A ${title.toLowerCase()} prompt for entertainment and media creation`,
        'Data Analysis & Research': `A ${title.toLowerCase()} prompt for data analysis and research`,
        'Security & Privacy': `A ${title.toLowerCase()} prompt for security and privacy applications`,
        'Communication & Language': `A ${title.toLowerCase()} prompt for communication and language tasks`,
        'Personal Development': `A ${title.toLowerCase()} prompt for personal development and growth`,
        'Technical Writing & Documentation': `A ${title.toLowerCase()} prompt for technical writing and documentation`,
        'Philosophy & Critical Thinking': `A ${title.toLowerCase()} prompt for philosophical and critical thinking`,
        'AI & Prompt Engineering': `A ${title.toLowerCase()} prompt for AI and prompt engineering`,
        'Finance & Investment': `A ${title.toLowerCase()} prompt for finance and investment analysis`,
        'Design & Creativity': `A ${title.toLowerCase()} prompt for design and creative tasks`,
        'General Purpose': `A ${title.toLowerCase()} prompt for general use cases`
    };
    
    return descriptions[category] || `A ${title.toLowerCase()} prompt for various applications`;
}

// Process all prompts
let processedCount = 0;
promptsData.forEach((prompt, index) => {
    // Improve categorization
    const newCategory = categorizePrompt(prompt);
    prompt.category = newCategory;
    
    // Generate enhanced tags
    prompt.tags = generateEnhancedTags(prompt, newCategory);
    
    // Generate enhanced description
    prompt.description = generateEnhancedDescription(prompt, newCategory);
    
    // Clean up the fullPrompt field (remove metadata)
    if (prompt.fullPrompt.includes('## Category') || prompt.fullPrompt.includes('## Tags')) {
        // Extract just the actual prompt content
        const promptStart = prompt.fullPrompt.indexOf('## Prompt');
        if (promptStart !== -1) {
            const promptContent = prompt.fullPrompt.substring(promptStart + 9).trim();
            const usageIndex = promptContent.indexOf('## Usage');
            if (usageIndex !== -1) {
                prompt.fullPrompt = promptContent.substring(0, usageIndex).trim();
            } else {
                prompt.fullPrompt = promptContent;
            }
        }
    }
    
    processedCount++;
    
    if (processedCount % 50 === 0) {
        console.log(`Processed ${processedCount}/${promptsData.length} prompts...`);
    }
});

// Sort prompts by category and then by title
promptsData.sort((a, b) => {
    if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
});

// Write updated prompts.json
fs.writeFileSync('prompt-marketplace/data/prompts.json', JSON.stringify(promptsData, null, 2));

console.log(`\nCategorization complete!`);
console.log(`- Total prompts processed: ${processedCount}`);
console.log(`- Updated prompts.json with improved categorization`);

// Generate summary by category
const categorySummary = {};
promptsData.forEach(prompt => {
    const category = prompt.category;
    categorySummary[category] = (categorySummary[category] || 0) + 1;
});

console.log('\nSummary by improved categories:');
Object.entries(categorySummary)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
        console.log(`- ${category}: ${count} prompts`);
    });

// Generate summary by source
const sourceSummary = {};
promptsData.forEach(prompt => {
    const source = prompt.source || 'unknown';
    sourceSummary[source] = (sourceSummary[source] || 0) + 1;
});

console.log('\nSummary by source:');
Object.entries(sourceSummary)
    .sort(([,a], [,b]) => b - a)
    .forEach(([source, count]) => {
        console.log(`- ${source}: ${count} prompts`);
    });
