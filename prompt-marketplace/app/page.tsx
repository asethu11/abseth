'use client';

import { useState, useEffect } from 'react';
import PromptCard from '@/components/PromptCard/PromptCard';
import SearchBar from '@/components/SearchBar/SearchBar';
import styles from './page.module.css';
import promptsData from '@/data/prompts.json';

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  compatibleModels: string[];
  featured?: boolean;
  createdAt?: string;
}

interface SearchFilters {
  tags: string[];
  models: string[];
  sortBy: 'newest' | 'popular';
}

export default function HomePage() {
  const [prompts] = useState<Prompt[]>(promptsData);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(promptsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [filters, setFilters] = useState<SearchFilters>({
    tags: [],
    models: [],
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const promptsPerPage = 32;
  const categories = ['All Categories', ...Array.from(new Set(prompts.map(p => p.category)))];
  
  const categoryCounts = categories.reduce((acc, category) => {
    if (category === 'All Categories') {
      acc[category] = prompts.length;
    } else {
      acc[category] = prompts.filter(p => p.category === category).length;
    }
    return acc;
  }, {} as Record<string, number>);

  const categoryIcons: Record<string, string> = {
    'Education & Learning': '📚',
    'Technical Writing & Documentation': '📝',
    'Development & Programming': '💻',
    'Communication & Language': '🗣️',
    'Entertainment & Media': '🎬',
    'Business & Professional': '💼',
    'Security & Privacy': '🔒',
    'Creative Writing': '✍️',
    'Data Analysis & Research': '📊',
    'Health & Wellness': '🏥',
    'AI & Prompt Engineering': '🤖',
    'Personal Development': '🌱',
    'Philosophy & Critical Thinking': '🤔',
    'Finance & Investment': '💰',
    'Design & Creativity': '🎨',
    'General Purpose': '⚡'
  };

  useEffect(() => {
    setIsLoading(true);
    
    let filtered = [...prompts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prompt => 
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query)) ||
        prompt.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory);
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(prompt => 
        filters.tags.some(tag => prompt.tags.some(promptTag => 
          promptTag.toLowerCase().includes(tag.toLowerCase())
        ))
      );
    }

    if (filters.models.length > 0) {
      filtered = filtered.filter(prompt => 
        filters.models.some(model => prompt.compatibleModels.includes(model))
      );
    }

    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        });
        break;
    }

    setFilteredPrompts(filtered);
    setCurrentPage(1);
    setTimeout(() => setIsLoading(false), 300);
  }, [searchQuery, selectedCategory, filters, prompts]);

  const handleSearch = (query: string, newFilters: SearchFilters) => {
    setSearchQuery(query);
    setFilters(newFilters);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);
  const startIndex = (currentPage - 1) * promptsPerPage;
  const endIndex = startIndex + promptsPerPage;
  const currentPrompts = filteredPrompts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.searchSection}>
        <div className="container">
          <SearchBar 
            onSearch={handleSearch}
            showFilters={true}
            className={styles.searchBar}
          />
        </div>
      </div>

      <div className={styles.mainLayout}>
        <aside className={styles.categoriesSidebar}>
          <div className={styles.categoriesList}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`${styles.categoryItem} ${selectedCategory === category ? styles.active : ''}`}
              >
                <div className={styles.categoryIcon}>
                  <span style={{ fontSize: '1.2em' }}>
                    {categoryIcons[category] || '•'}
                  </span>
                </div>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{category}</span>
                  <span className={styles.categoryCount}>({categoryCounts[category] || 0})</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className="container">
            {isLoading && (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner}></div>
                <p>Searching prompts...</p>
              </div>
            )}

            {!isLoading && (
              <>
                {currentPrompts.length > 0 ? (
                  <div className={`grid grid-cols-4 ${styles.promptsGrid}`}>
                    {currentPrompts.map((prompt) => (
                      <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>🔍</div>
                    <h3 className={styles.noResultsTitle}>No prompts found</h3>
                    <p className={styles.noResultsDescription}>
                      Try adjusting your search criteria or browse all prompts
                    </p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All Categories');
                        setFilters({
                          tags: [],
                          models: [],
                          sortBy: 'newest'
                        });
                      }}
                      className={styles.clearFiltersBtn}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={styles.paginationBtn}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                      Previous
                    </button>

                    <div className={styles.paginationNumbers}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`${styles.paginationNumber} ${currentPage === page ? styles.active : ''}`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className={styles.paginationEllipsis}>...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={styles.paginationBtn}
                    >
                      Next
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}