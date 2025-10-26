import { Prompt, Statistics, CategoryGroup } from './types';

// Lightweight sample prompts for development (only 5 prompts)
const samplePrompts: Prompt[] = [
  {
    id: 'sample-1',
    title: 'Code Review Assistant',
    description: 'A comprehensive prompt for reviewing code quality, performance, and best practices.',
    fullPrompt: 'You are an expert code reviewer. Analyze the following code for:\n1. Code quality\n2. Performance issues\n3. Security vulnerabilities\n4. Best practices\n5. Maintainability\n\nProvide detailed feedback with specific suggestions for improvement.',
    category: 'Development & Programming',
    tags: ['code-review', 'quality', 'performance'],
    compatibleModels: ['GPT-4', 'Claude-3', 'Gemini'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'sample-2',
    title: 'Creative Writing Prompt',
    description: 'Generate engaging creative writing content with specific style and tone requirements.',
    fullPrompt: 'You are a creative writing expert. Help me create engaging content with:\n- Specific tone and style\n- Character development\n- Plot structure\n- Dialogue writing\n- Setting descriptions\n\nFocus on originality and emotional impact.',
    category: 'Creative Writing',
    tags: ['writing', 'creative', 'storytelling'],
    compatibleModels: ['GPT-4', 'Claude-3'],
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'sample-3',
    title: 'Data Analysis Expert',
    description: 'Comprehensive data analysis and visualization guidance for business intelligence.',
    fullPrompt: 'You are a data analysis expert. Help me:\n1. Analyze datasets for insights\n2. Create visualizations\n3. Identify trends and patterns\n4. Generate reports\n5. Make data-driven recommendations\n\nFocus on actionable insights and clear communication.',
    category: 'Data & Analytics',
    tags: ['data', 'analysis', 'visualization'],
    compatibleModels: ['GPT-4', 'Claude-3', 'Gemini'],
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: 'sample-4',
    title: 'System Prompt Template',
    description: 'A versatile system prompt template for various AI interactions.',
    fullPrompt: 'You are a helpful AI assistant with expertise in [SPECIALTY]. Your role is to:\n- Provide accurate and helpful responses\n- Ask clarifying questions when needed\n- Maintain a professional and friendly tone\n- Focus on practical solutions\n\nGuidelines:\n- Be concise but comprehensive\n- Cite sources when appropriate\n- Admit uncertainty when you don\'t know something',
    category: 'System Prompts',
    tags: ['system', 'template', 'general'],
    compatibleModels: ['GPT-4', 'Claude-3', 'Gemini'],
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: 'sample-5',
    title: 'AI & ML Assistant',
    description: 'Specialized prompt for machine learning and AI development tasks.',
    fullPrompt: 'You are an AI/ML expert. Help me with:\n1. Model selection and architecture\n2. Data preprocessing and feature engineering\n3. Training and validation strategies\n4. Performance optimization\n5. Deployment considerations\n\nProvide practical, implementable solutions with code examples when relevant.',
    category: 'AI & Machine Learning',
    tags: ['ai', 'ml', 'machine-learning'],
    compatibleModels: ['GPT-4', 'Claude-3'],
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  }
];

// Cache for API calls
let allPromptsCache: Prompt[] | null = null;
let isLoading = false;

export async function getAllPrompts(): Promise<Prompt[]> {
  // Return cached data if available
  if (allPromptsCache) {
    return allPromptsCache;
  }

  // Prevent multiple simultaneous loads
  if (isLoading) {
    return new Promise((resolve) => {
      const checkCache = () => {
        if (allPromptsCache) {
          resolve(allPromptsCache);
        } else {
          setTimeout(checkCache, 100);
        }
      };
      checkCache();
    });
  }

  try {
    isLoading = true;
    
    // Try to load from API
    const response = await fetch('/api/prompts');
    if (!response.ok) {
      throw new Error('Failed to fetch prompts from API');
    }
    
    const data = await response.json();
    allPromptsCache = data.prompts as Prompt[];
    return allPromptsCache;
  } catch (error) {
    console.warn('Using sample prompts:', error);
    // Return sample data for development/fallback
    allPromptsCache = samplePrompts;
    return allPromptsCache;
  } finally {
    isLoading = false;
  }
}

export async function getPromptById(id: string): Promise<Prompt | null> {
  try {
    const response = await fetch(`/api/prompts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch prompt');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return null;
  }
}

export async function searchPrompts(query: string): Promise<Prompt[]> {
  try {
    if (!query.trim()) {
      return getAllPrompts();
    }
    
    const response = await fetch(`/api/prompts?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search prompts');
    }
    
    const data = await response.json();
    return data.prompts as Prompt[];
  } catch (error) {
    console.error('Error searching prompts:', error);
    return [];
  }
}

export async function getPromptsByCategory(category: string): Promise<Prompt[]> {
  try {
    const response = await fetch(`/api/prompts?category=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch prompts by category');
    }
    
    const data = await response.json();
    return data.prompts as Prompt[];
  } catch (error) {
    console.error('Error filtering prompts by category:', error);
    return [];
  }
}

export async function getStatistics(): Promise<Statistics> {
  try {
    const response = await fetch('/api/statistics');
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return {
      totalPrompts: 0,
      categories: {}
    };
  }
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
