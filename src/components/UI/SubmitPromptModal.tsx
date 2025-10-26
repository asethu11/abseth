import React, { useState } from 'react'
import './SubmitPromptModal.css'

interface SubmitPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

const SubmitPromptModal: React.FC<SubmitPromptModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullPrompt: '',
    category: '',
    tags: [] as string[],
    compatibleModels: ['Model Agnostic']
  })
  const [tagsInput, setTagsInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    'System Prompts',
    'General Purpose',
    'Development & Programming',
    'Code Review & Refactoring',
    'Web Development',
    'Mobile Development',
    'DevOps & Cloud',
    'AI & Machine Learning',
    'Data & Analytics',
    'Data Analysis & Research',
    'Creative Writing',
    'Content & Marketing',
    'Technical Writing & Documentation',
    'Business & Professional',
    'Education & Learning',
    'Security & Testing',
    'Security & Privacy'
  ]

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagsInput.trim()) {
      e.preventDefault()
      setFormData({
        ...formData,
        tags: [...formData.tags, tagsInput.trim()]
      })
      setTagsInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit prompt')
      }

      onSubmit(data.prompt)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        fullPrompt: '',
        category: '',
        tags: [],
        compatibleModels: ['Model Agnostic']
      })
      setTagsInput('')
      
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Submit New Prompt</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Code Review Assistant"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              placeholder="Brief description of what this prompt does"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullPrompt">Full Prompt *</label>
            <textarea
              id="fullPrompt"
              value={formData.fullPrompt}
              onChange={(e) => setFormData({ ...formData, fullPrompt: e.target.value })}
              required
              rows={8}
              placeholder="Enter the complete prompt text"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={handleTagInput}
              placeholder="Press Enter to add a tag"
            />
            <div className="tags-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Compatible Models</label>
            <div className="models-grid">
              {[
                'Model Agnostic',
                'GPT-4',
                'GPT-3.5',
                'GPT-4o',
                'GPT-4 Turbo',
                'Claude-3',
                'Claude-3.5 Sonnet',
                'Claude-3 Opus',
                'Claude-3 Haiku',
                'Gemini',
                'Gemini Pro',
                'Gemini Ultra',
                'Llama 2',
                'Llama 3',
                'Llama 3.1',
                'Mistral',
                'Mistral 7B',
                'Pi',
                'Copilot',
                'Copilot Chat',
                'Ollama',
                'Code Llama',
                'PaLM',
                'Jurassic'
              ].map(model => (
                <label key={model} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.compatibleModels.includes(model)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          compatibleModels: [...formData.compatibleModels, model]
                        })
                      } else {
                        setFormData({
                          ...formData,
                          compatibleModels: formData.compatibleModels.filter(m => m !== model)
                        })
                      }
                    }}
                  />
                  {model}
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubmitPromptModal
