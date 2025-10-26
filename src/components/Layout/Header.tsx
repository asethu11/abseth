import React, { useState, useCallback } from 'react'
import './Header.css'

interface HeaderProps {
  onSearch: (query: string) => void
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Debounce search input
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: number
      return (query: string) => {
        clearTimeout(timeoutId)
        timeoutId = window.setTimeout(() => {
          onSearch(query)
        }, 300)
      }
    })(),
    [onSearch]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  const handleSearchBlur = () => {
    setIsSearchFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('')
      onSearch('')
      ;(e.currentTarget as HTMLElement).blur()
    }
  }

  return (
    <header className="header">
      <a href="/" className="header__logo">
        🚀 Prompt Library
      </a>
      
      <div className={`header__search ${isSearchFocused ? 'header__search--focused' : ''}`}>
        <div className="search-bar">
          <svg className="search-bar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <nav className="header__nav">
        <button className="btn btn--ghost btn--sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18l-2 13H5L3 6z"></path>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Favorites
        </button>
      </nav>
    </header>
  )
}

export default Header
