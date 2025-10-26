'use client';

import { useState } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

interface SearchFilters {
  tags: string[];
  models: string[];
  sortBy: 'newest' | 'popular';
}


const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' }
];

const availableTags = [
  'storytelling', 'character development', 'creative writing', 'fiction', 'poetry', 'screenwriting',
  'email', 'business', 'professional', 'communication', 'presentation', 'negotiation',
  'code review', 'programming', 'best practices', 'debugging', 'algorithms', 'data structures', 'web development',
  'marketing', 'copywriting', 'advertising', 'conversion', 'SEO', 'social media', 'content strategy',
  'academic', 'research', 'literature review', 'scholarly writing', 'essay writing', 'thesis',
  'coaching', 'goals', 'habits', 'personal growth', 'productivity', 'time management', 'leadership',
  'cooking', 'recipes', 'meal planning', 'dietary', 'nutrition', 'food safety',
  'documentation', 'technical writing', 'API', 'user guides', 'tutorials', 'how-to',
  'data analysis', 'statistics', 'machine learning', 'AI', 'automation', 'workflow',
  'design', 'UI/UX', 'graphic design', 'branding', 'visual communication',
  'finance', 'investment', 'budgeting', 'accounting', 'financial planning',
  'health', 'fitness', 'mental health', 'wellness', 'medical', 'therapy',
  'education', 'teaching', 'learning', 'curriculum', 'assessment', 'pedagogy',
  'legal', 'contracts', 'compliance', 'regulations', 'policy', 'governance',
  'sales', 'customer service', 'CRM', 'lead generation', 'pitch', 'proposal'
];

const availableModels = [
  'All Models',
  'GPT-4',
  'GPT-3.5',
  'Claude-3',
  'Claude-2',
  'Gemini Pro',
  'Gemini Advanced',
  'Llama 2',
  'Mistral'
];

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search prompts...", 
  showFilters = true,
  className = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    tags: [],
    models: [],
    sortBy: 'newest'
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, filters);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleModelToggle = (model: string) => {
    setFilters(prev => ({
      ...prev,
      models: prev.models.includes(model) 
        ? prev.models.filter(m => m !== model)
        : [...prev.models, model]
    }));
  };

  const clearFilters = () => {
    setFilters({
      tags: [],
      models: [],
      sortBy: 'newest'
    });
  };

  return (
    <div className={`${styles['search-bar']} ${className}`}>
        {/* Main Search Input */}
        <div className={styles['search-bar__input']}>
          <div className={styles['search-bar__input-container']}>
            <svg className={styles['search-bar__search-icon']} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className={styles['search-bar__input-field']}
            />
            <button onClick={handleSearch} className={styles['search-bar__search-btn']}>
              Search
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className={styles['search-bar__filters']}>
            {/* Sort Filter */}
            <div className={styles['search-bar__filter-group']}>
              <label className={styles['search-bar__filter-label']}>Sort by</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className={styles['search-bar__select']}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={styles['search-bar__advanced-toggle']}
            >
              <svg 
                className={`${styles['search-bar__filter-icon']} ${showFilterPanel ? styles['search-bar__filter-icon--rotated'] : ''}`} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
              </svg>
              Advanced Filters
            </button>
          </div>
        )}

      {/* Advanced Filter Panel */}
      {showFilters && showFilterPanel && (
        <div className={styles['search-bar__advanced-panel']}>
          <div className={styles['search-bar__advanced-filters']}>

            {/* Tags Filter */}
            <div className={styles['search-bar__filter-group']}>
              <label className={styles['search-bar__filter-label']}>Tags</label>
              <div className={styles['search-bar__tag-filter']}>
                {availableTags.slice(0, 12).map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`${styles['search-bar__tag-btn']} ${filters.tags.includes(tag) ? styles['search-bar__tag-btn--active'] : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Models Filter */}
            <div className={styles['search-bar__filter-group']}>
              <label className={styles['search-bar__filter-label']}>Compatible Models</label>
              <div className={styles['search-bar__model-filter']}>
                {availableModels.slice(1, 6).map(model => (
                  <button
                    key={model}
                    onClick={() => handleModelToggle(model)}
                    className={`${styles['search-bar__model-btn']} ${filters.models.includes(model) ? styles['search-bar__model-btn--active'] : ''}`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className={styles['search-bar__filter-actions']}>
            <button onClick={clearFilters} className={styles['search-bar__clear-btn']}>
              Clear Filters
            </button>
            <button onClick={handleSearch} className={styles['search-bar__apply-btn']}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
