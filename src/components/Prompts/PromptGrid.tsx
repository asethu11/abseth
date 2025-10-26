import React, { useMemo } from 'react'
import { Prompt } from '../../../types'
import PromptCard from './PromptCard'
import LoadingSpinner from '../UI/LoadingSpinner'
import EmptyState from '../UI/EmptyState'
import './PromptGrid.css'

interface PromptGridProps {
  prompts: Prompt[]
  isLoading: boolean
  hasMore?: boolean
  isLoadingMore?: boolean
  onPromptSelect: (prompt: Prompt) => void
  onLoadMore?: () => void
}

const PromptGrid: React.FC<PromptGridProps> = ({ 
  prompts, 
  isLoading, 
  hasMore = false,
  isLoadingMore = false,
  onPromptSelect,
  onLoadMore
}) => {
  const memoizedPrompts = useMemo(() => prompts, [prompts])

  if (isLoading) {
    return (
      <div className="prompt-grid">
        <div className="prompt-grid__loading">
          <LoadingSpinner />
          <p className="prompt-grid__loading-text">Loading prompts...</p>
        </div>
      </div>
    )
  }

  if (memoizedPrompts.length === 0) {
    return (
      <div className="prompt-grid">
        <EmptyState
          icon="🔍"
          title="No prompts found"
          description="Try adjusting your search or filter criteria to find more prompts."
        />
      </div>
    )
  }

  return (
    <div className="prompt-grid">
      <div className="prompt-grid__header">
        <h2 className="prompt-grid__title">
          {memoizedPrompts.length} Prompt{memoizedPrompts.length !== 1 ? 's' : ''} Found
        </h2>
        <div className="prompt-grid__filters">
          <span className="prompt-grid__filter-info">
            Showing all prompts
          </span>
        </div>
      </div>

      <div className="prompt-grid__content">
        {memoizedPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onSelect={onPromptSelect}
          />
        ))}
      </div>

      {hasMore && (
        <div className="prompt-grid__load-more">
          <button 
            className="prompt-grid__load-more-btn"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Loading more...</span>
              </>
            ) : (
              'Load More Prompts'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default PromptGrid
