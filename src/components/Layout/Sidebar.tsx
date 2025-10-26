import React, { useState } from 'react'
import './Sidebar.css'
import SubmitPromptModal from '../UI/SubmitPromptModal'

interface SidebarProps {
  stats: {
    totalPrompts: number
    categories: { [key: string]: number }
  }
  selectedCategory: string | null
  onCategoryFilter: (category: string | null) => void
  onPromptSubmitted?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ 
  stats, 
  selectedCategory, 
  onCategoryFilter,
  onPromptSubmitted
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const categoryGroups = [
    {
      name: 'System & General',
      categories: [
        { name: 'System Prompts', count: stats.categories['System Prompts'] || 0 },
        { name: 'General Purpose', count: stats.categories['General Purpose'] || 0 }
      ]
    },
    {
      name: 'Development',
      categories: [
        { name: 'Development & Programming', count: stats.categories['Development & Programming'] || 0 },
        { name: 'Code Review & Refactoring', count: stats.categories['Code Review & Refactoring'] || 0 },
        { name: 'Web Development', count: stats.categories['Web Development'] || 0 },
        { name: 'Mobile Development', count: stats.categories['Mobile Development'] || 0 },
        { name: 'DevOps & Cloud', count: stats.categories['DevOps & Cloud'] || 0 }
      ]
    },
    {
      name: 'AI & Data',
      categories: [
        { name: 'AI & Machine Learning', count: stats.categories['AI & Machine Learning'] || 0 },
        { name: 'Data & Analytics', count: stats.categories['Data & Analytics'] || 0 },
        { name: 'Data Analysis & Research', count: stats.categories['Data Analysis & Research'] || 0 }
      ]
    },
    {
      name: 'Content & Writing',
      categories: [
        { name: 'Creative Writing', count: stats.categories['Creative Writing'] || 0 },
        { name: 'Content & Marketing', count: stats.categories['Content & Marketing'] || 0 },
        { name: 'Technical Writing & Documentation', count: stats.categories['Technical Writing & Documentation'] || 0 }
      ]
    },
    {
      name: 'Business & Education',
      categories: [
        { name: 'Business & Professional', count: stats.categories['Business & Professional'] || 0 },
        { name: 'Education & Learning', count: stats.categories['Education & Learning'] || 0 }
      ]
    },
    {
      name: 'Security',
      categories: [
        { name: 'Security & Testing', count: stats.categories['Security & Testing'] || 0 },
        { name: 'Security & Privacy', count: stats.categories['Security & Privacy'] || 0 }
      ]
    }
  ]

  const handleSubmitPrompt = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handlePromptSubmitted = (newPrompt: any) => {
    console.log('New prompt submitted:', newPrompt)
    setIsModalOpen(false)
    
    // Refresh the prompt list if callback provided
    if (onPromptSubmitted) {
      onPromptSubmitted()
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Categories</h2>
        <div className="sidebar__stats">
          <span className="sidebar__stat-number">{stats.totalPrompts.toLocaleString()}</span>
          <span className="sidebar__stat-label">Total Prompts</span>
        </div>
      </div>

      <div className="sidebar__content">
        <button 
          className={`sidebar__category-btn ${!selectedCategory ? 'sidebar__category-btn--active' : ''}`}
          onClick={() => onCategoryFilter(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onCategoryFilter(null)
            }
          }}
        >
          <span>All Categories</span>
          <span className="sidebar__category-count">{stats.totalPrompts}</span>
        </button>

        {categoryGroups.map((group) => (
          <div key={group.name} className="sidebar__group">
            <h3 className="sidebar__group-title">{group.name}</h3>
            <div className="sidebar__group-categories">
              {group.categories
                .filter(category => category.count > 0)
                .map((category) => (
                <button
                  key={category.name}
                  className={`sidebar__category-btn ${selectedCategory === category.name ? 'sidebar__category-btn--active' : ''}`}
                  onClick={() => onCategoryFilter(category.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onCategoryFilter(category.name)
                    }
                  }}
                >
                  <span>{category.name}</span>
                  <span className="sidebar__category-count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar__footer">
        <button 
          className="sidebar__submit-btn"
          onClick={handleSubmitPrompt}
        >
          Submit Prompt
        </button>
      </div>

      <SubmitPromptModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handlePromptSubmitted}
      />
    </aside>
  )
}

export default Sidebar
