import { useState, useEffect, useMemo, useCallback } from 'react'
import Layout from './components/Layout/Layout'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import PromptGrid from './components/Prompts/PromptGrid'
import PromptDetail from './components/Prompts/PromptDetail'
import { Prompt } from '../types'
import { getAllPrompts, searchPrompts, getStatistics, getPromptsByCategory } from '../prompts'
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics'

const ITEMS_PER_PAGE = 20

function App() {
  const [, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [allFilteredPrompts, setAllFilteredPrompts] = useState<Prompt[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [filteredOffset, setFilteredOffset] = useState(0)
  const [stats, setStats] = useState({ totalPrompts: 0, categories: {} })
  
  // Initialize Google Analytics
  const { trackPageView, trackPromptView, trackPromptSearch, trackCategoryFilter, trackPromptSubmit, trackLoadMore } = useGoogleAnalytics()

  // Track initial page view
  useEffect(() => {
    trackPageView('/', 'Prompt Library - Home')
  }, [trackPageView])

  // Load initial data with pagination
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [promptsData, statistics] = await Promise.all([
          getAllPrompts(ITEMS_PER_PAGE, 0),
          getStatistics()
        ])
        setPrompts(promptsData.prompts)
        setFilteredPrompts(promptsData.prompts)
        setAllFilteredPrompts(promptsData.prompts)
        setHasMore(promptsData.hasMore)
        setStats(statistics)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle loading more prompts (infinite scroll)
  const loadMorePrompts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    try {
      setIsLoadingMore(true)
      
      // Track load more event
      trackLoadMore(filteredPrompts.length)
      
      // If we have filters, load from allFilteredPrompts
      if (searchQuery.trim() || selectedCategory) {
        const newOffset = filteredOffset + ITEMS_PER_PAGE
        const nextBatch = allFilteredPrompts.slice(newOffset, newOffset + ITEMS_PER_PAGE)
        
        setFilteredPrompts(prev => [...prev, ...nextBatch])
        setFilteredOffset(newOffset)
        setHasMore(newOffset + ITEMS_PER_PAGE < allFilteredPrompts.length)
      } else {
        // No filters, load from all prompts
        const newOffset = offset + ITEMS_PER_PAGE
        const promptsData = await getAllPrompts(ITEMS_PER_PAGE, newOffset)
        
        setPrompts(prev => [...prev, ...promptsData.prompts])
        setFilteredPrompts(prev => [...prev, ...promptsData.prompts])
        setHasMore(promptsData.hasMore)
        setOffset(newOffset)
      }
    } catch (error) {
      console.error('Error loading more prompts:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [offset, filteredOffset, hasMore, isLoadingMore, searchQuery, selectedCategory, allFilteredPrompts, filteredPrompts.length, trackLoadMore])

  // Handle search and filtering with memoization
  const filteredPromptsMemo = useMemo(() => {
    return filteredPrompts
  }, [filteredPrompts])

  // Handle search and filtering
  useEffect(() => {
    const filterPrompts = async () => {
      if (!searchQuery.trim() && !selectedCategory) {
        // No filter, load paginated data
        try {
          setOffset(0)
          setFilteredOffset(0)
          const promptsData = await getAllPrompts(ITEMS_PER_PAGE, 0)
          setPrompts(promptsData.prompts)
          setFilteredPrompts(promptsData.prompts)
          setAllFilteredPrompts(promptsData.prompts)
          setHasMore(promptsData.hasMore)
        } catch (error) {
          console.error('Error loading prompts:', error)
        }
        return
      }

      try {
        // Reset pagination for filtered results
        setFilteredOffset(0)
        
        let results: Prompt[] = []

        if (selectedCategory && searchQuery.trim()) {
          // Both category and search query
          const searchResults = await searchPrompts(searchQuery)
          results = searchResults.filter(prompt => prompt.category === selectedCategory)
        } else if (selectedCategory) {
          // Only category filter
          results = await getPromptsByCategory(selectedCategory)
        } else if (searchQuery.trim()) {
          // Only search query
          results = await searchPrompts(searchQuery)
        }

        // Store all filtered results
        setAllFilteredPrompts(results)
        
        // Track search events
        if (searchQuery.trim()) {
          trackPromptSearch(searchQuery, results.length)
        }
        if (selectedCategory) {
          trackCategoryFilter(selectedCategory)
        }
        
        // Show first page of filtered results
        const firstPage = results.slice(0, ITEMS_PER_PAGE)
        setFilteredPrompts(firstPage)
        setHasMore(results.length > ITEMS_PER_PAGE)
      } catch (error) {
        console.error('Error filtering prompts:', error)
        setFilteredPrompts([])
        setAllFilteredPrompts([])
        setHasMore(false)
      }
    }

    filterPrompts()
  }, [searchQuery, selectedCategory])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleCategoryFilter = useCallback((category: string | null) => {
    setSelectedCategory(category)
  }, [])

  const handlePromptSelect = useCallback((prompt: Prompt) => {
    setSelectedPrompt(prompt)
    // Track prompt view
    trackPromptView(prompt.id, prompt.title, prompt.category)
  }, [trackPromptView])

  const handleCloseDetail = useCallback(() => {
    setSelectedPrompt(null)
  }, [])

  const handlePromptSubmitted = useCallback(async () => {
    // Track prompt submission
    trackPromptSubmit()
    
    // Reload prompts and statistics after a new prompt is submitted
    try {
      const [promptsData, statistics] = await Promise.all([
        getAllPrompts(ITEMS_PER_PAGE, 0),
        getStatistics()
      ])
      setPrompts(promptsData.prompts)
      setFilteredPrompts(promptsData.prompts)
      setAllFilteredPrompts(promptsData.prompts)
      setHasMore(promptsData.hasMore)
      setStats(statistics)
      setOffset(0)
      setFilteredOffset(0)
      
      // Show success notification (you can add a toast notification here)
      console.log('Prompt submitted successfully!')
    } catch (error) {
      console.error('Error refreshing prompts:', error)
    }
  }, [trackPromptSubmit])

  return (
    <Layout>
      <Header onSearch={handleSearch} />
      <Sidebar 
        stats={stats}
        selectedCategory={selectedCategory}
        onCategoryFilter={handleCategoryFilter}
        onPromptSubmitted={handlePromptSubmitted}
      />
      <main className="main">
        <PromptGrid 
          prompts={filteredPromptsMemo}
          isLoading={isLoading}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onPromptSelect={handlePromptSelect}
          onLoadMore={loadMorePrompts}
        />
      </main>
      {selectedPrompt && (
        <PromptDetail 
          prompt={selectedPrompt}
          onClose={handleCloseDetail}
        />
      )}
    </Layout>
  )
}

export default App
