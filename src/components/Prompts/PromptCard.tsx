import React, { memo } from 'react'
import { Prompt } from '../../../types'
import './PromptCard.css'

interface PromptCardProps {
  prompt: Prompt
  onSelect: (prompt: Prompt) => void
}

const PromptCard: React.FC<PromptCardProps> = memo(({ prompt, onSelect }) => {
  const handleClick = () => {
    onSelect(prompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(prompt)
    }
    if (e.key === 'Escape') {
      ;(e.currentTarget as HTMLElement).blur()
    }
  }

  return (
    <article 
      className="prompt-card animate-fade-in"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View prompt: ${prompt.title}`}
    >
      <div className="prompt-card__header">
        <span className="prompt-card__category">
          {prompt.category}
        </span>
        <div className="prompt-card__models">
          {prompt.compatibleModels.slice(0, 3).map((model) => (
            <span key={model} className="prompt-card__model">
              {model}
            </span>
          ))}
          {prompt.compatibleModels.length > 3 && (
            <span className="prompt-card__model-more">
              +{prompt.compatibleModels.length - 3}
            </span>
          )}
        </div>
      </div>

      <h3 className="prompt-card__title">
        {prompt.title}
      </h3>

      <p className="prompt-card__description">
        {prompt.description}
      </p>

      {prompt.tags.length > 0 && (
        <div className="prompt-card__tags">
          {prompt.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="prompt-card__tag">
              {tag}
            </span>
          ))}
          {prompt.tags.length > 4 && (
            <span className="prompt-card__tag-more">
              +{prompt.tags.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="prompt-card__footer">
        <div className="prompt-card__meta">
          <span className="prompt-card__date">
            {new Date(prompt.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="prompt-card__actions">
          <button 
            className="prompt-card__action-btn"
            onClick={(e) => {
              e.stopPropagation()
              navigator.clipboard.writeText(prompt.fullPrompt)
            }}
            aria-label="Copy prompt to clipboard"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
})

PromptCard.displayName = 'PromptCard'

export default PromptCard
