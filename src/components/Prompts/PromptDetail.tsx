import React, { useEffect } from 'react'
import { Prompt } from '../../../types'
import './PromptDetail.css'

interface PromptDetailProps {
  prompt: Prompt
  onClose: () => void
}

const PromptDetail: React.FC<PromptDetailProps> = ({ prompt, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.fullPrompt)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy prompt:', error)
    }
  }

  const handleCopyTitle = async () => {
    try {
      await navigator.clipboard.writeText(prompt.title)
    } catch (error) {
      console.error('Failed to copy title:', error)
    }
  }

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal__content">
        <div className="modal__header">
          <div className="modal__title-section">
            <span className="modal__category">
              {prompt.category}
            </span>
            <h1 className="modal__title">
              {prompt.title}
            </h1>
          </div>
          <button 
            className="modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal__body">
          <div className="modal__description">
            <p>{prompt.description}</p>
          </div>

          {prompt.tags.length > 0 && (
            <div className="modal__tags">
              <h3 className="modal__section-title">Tags</h3>
              <div className="modal__tag-list">
                {prompt.tags.map((tag) => (
                  <span key={tag} className="modal__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="modal__compatibility">
            <h3 className="modal__section-title">Compatible Models</h3>
            <div className="modal__model-list">
              {prompt.compatibleModels.map((model) => (
                <span key={model} className="modal__model">
                  {model}
                </span>
              ))}
            </div>
          </div>

          <div className="modal__prompt">
            <div className="modal__prompt-header">
              <h3 className="modal__section-title">Full Prompt</h3>
              <div className="modal__prompt-actions">
                <button 
                  className="btn btn--secondary btn--sm"
                  onClick={handleCopyTitle}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  Copy Title
                </button>
                <button 
                  className="btn btn--primary btn--sm"
                  onClick={handleCopyPrompt}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy Prompt
                </button>
              </div>
            </div>
            <div className="modal__prompt-content">
              <pre className="modal__prompt-text">
                <code>{prompt.fullPrompt}</code>
              </pre>
            </div>
          </div>

          <div className="modal__meta">
            <div className="modal__meta-item">
              <span className="modal__meta-label">Created:</span>
              <span className="modal__meta-value">
                {new Date(prompt.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="modal__meta-item">
              <span className="modal__meta-label">Updated:</span>
              <span className="modal__meta-value">
                {new Date(prompt.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="modal__meta-item">
              <span className="modal__meta-label">ID:</span>
              <span className="modal__meta-value modal__meta-value--mono">
                {prompt.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptDetail
