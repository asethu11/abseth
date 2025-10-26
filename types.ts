export interface Prompt {
  id: string;
  title: string;
  description: string;
  fullPrompt: string;
  category: string;
  tags: string[];
  compatibleModels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Statistics {
  totalPrompts: number;
  categories: {
    [key: string]: number;
  };
}

export interface SearchFilters {
  query: string;
  category: string | null;
}

export interface CategoryGroup {
  name: string;
  categories: {
    name: string;
    count: number;
  }[];
}

export interface SearchResult {
  prompts: Prompt[];
  totalCount: number;
  hasMore: boolean;
}

