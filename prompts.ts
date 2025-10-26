import { Prompt, Statistics, CategoryGroup } from './types';
import promptsData from './processed-prompts/unique-prompts.json';

// Cache for performance
let allPromptsCache: Prompt[] | null = null;

export async function getAllPrompts(limit?: number, offset?: number): Promise<{ prompts: Prompt[], total: number, hasMore: boolean }> {
  // Use static data from JSON file
  const allPrompts = promptsData as Prompt[];
  
  // Cache for performance
  if (!allPromptsCache) {
    allPromptsCache = allPrompts;
  }
  
  // Apply pagination if specified
  const paginatedPrompts = limit !== undefined 
    ? allPrompts.slice(offset || 0, (offset || 0) + limit)
    : allPrompts;
  
  return {
    prompts: paginatedPrompts,
    total: allPrompts.length,
    hasMore: limit !== undefined ? (offset || 0) + limit < allPrompts.length : false
  };
}

export async function getPromptById(id: string): Promise<Prompt | null> {
  const allPrompts = promptsData as Prompt[];
  return allPrompts.find(prompt => prompt.id === id) || null;
}

export async function searchPrompts(query: string): Promise<Prompt[]> {
  if (!query.trim()) {
    const result = await getAllPrompts();
    return result.prompts;
  }
  
  const allPrompts = promptsData as Prompt[];
  const searchTerm = query.toLowerCase();
  
  return allPrompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchTerm) ||
    prompt.description.toLowerCase().includes(searchTerm) ||
    prompt.fullPrompt.toLowerCase().includes(searchTerm) ||
    prompt.category.toLowerCase().includes(searchTerm) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export async function getPromptsByCategory(category: string): Promise<Prompt[]> {
  const allPrompts = promptsData as Prompt[];
  return allPrompts.filter(prompt => prompt.category === category);
}

export async function getStatistics(): Promise<Statistics> {
  const allPrompts = promptsData as Prompt[];
  
  // Calculate category counts
  const categories: { [key: string]: number } = {};
  allPrompts.forEach(prompt => {
    categories[prompt.category] = (categories[prompt.category] || 0) + 1;
  });
  
  return {
    totalPrompts: allPrompts.length,
    categories
  };
}

export function getCategories(): CategoryGroup[] {
  return [
    {
      name: 'System & General',
      categories: [
        { name: 'System Prompts', count: 777 },
        { name: 'General Purpose', count: 185 }
      ]
    },
    {
      name: 'Development',
      categories: [
        { name: 'Development & Programming', count: 138 },
        { name: 'Code Review & Refactoring', count: 0 },
        { name: 'Web Development', count: 0 },
        { name: 'Mobile Development', count: 0 },
        { name: 'DevOps & Cloud', count: 0 },
        { name: 'API & Integration', count: 0 },
        { name: 'Game Development', count: 0 }
      ]
    },
    {
      name: 'AI & Data',
      categories: [
        { name: 'AI & Machine Learning', count: 463 },
        { name: 'Data & Analytics', count: 110 },
        { name: 'Data Analysis & Research', count: 0 },
        { name: 'AI & Prompt Engineering', count: 0 }
      ]
    },
    {
      name: 'Content & Writing',
      categories: [
        { name: 'Creative Writing', count: 78 },
        { name: 'Content & Marketing', count: 0 },
        { name: 'Technical Writing & Documentation', count: 0 }
      ]
    },
    {
      name: 'Business & Education',
      categories: [
        { name: 'Business & Professional', count: 8 },
        { name: 'Education & Learning', count: 1 }
      ]
    },
    {
      name: 'Security',
      categories: [
        { name: 'Security & Testing', count: 7 },
        { name: 'Security & Privacy', count: 0 }
      ]
    },
    {
      name: 'Lifestyle & Personal',
      categories: [
        { name: 'Communication & Language', count: 0 },
        { name: 'Entertainment & Media', count: 0 },
        { name: 'Health & Wellness', count: 0 },
        { name: 'Personal Development', count: 0 },
        { name: 'Philosophy & Critical Thinking', count: 0 }
      ]
    }
  ];
}
