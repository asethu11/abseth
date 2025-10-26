import { useState, useEffect, useMemo, useCallback } from 'react'
import Layout from './components/Layout/Layout'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import PromptGrid from './components/Prompts/PromptGrid'
import PromptDetail from './components/Prompts/PromptDetail'
import { Prompt } from '../types'
import { getAllPrompts, searchPrompts, getStatistics } from '../prompts'

const ITEMS_PER_PAGE = 20

function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [stats, setStats] = useState({ totalPrompts: 0, categories: {} })

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
      const newOffset = offset + ITEMS_PER_PAGE
      const promptsData = await getAllPrompts(ITEMS_PER_PAGE, newOffset)
      
      setPrompts(prev => [...prev, ...promptsData.prompts])
      setFilteredPrompts(prev => [...prev, ...promptsData.prompts])
      setHasMore(promptsData.hasMore)
      setOffset(newOffset)
    } catch (error) {
      console.error('Error loading more prompts:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [offset, hasMore, isLoadingMore])

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
          const promptsData = await getAllPrompts(ITEMS_PER_PAGE, 0)
          setPrompts(promptsData.prompts)
          setFilteredPrompts(promptsData.prompts)
          setHasMore(promptsData.hasMore)
        } catch (error) {
          console.error('Error loading prompts:', error)
        }
        return
      }

      try {
        // Reset pagination for filtered results
        setOffset(0)
        
        let results = prompts

        if (searchQuery.trim()) {
          results = await searchPrompts(searchQuery)
        }

        if (selectedCategory) {
          results = results.filter(prompt => prompt.category === selectedCategory)
        }

        setFilteredPrompts(results)
        setHasMore(false) // Don't show load more for filtered results
      } catch (error) {
        console.error('Error filtering prompts:', error)
        setFilteredPrompts(prompts)
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
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedPrompt(null)
  }, [])

  const handlePromptSubmitted = useCallback(async () => {
    // Reload prompts and statistics after a new prompt is submitted
    try {
      const [promptsData, statistics] = await Promise.all([
        getAllPrompts(ITEMS_PER_PAGE, 0),
        getStatistics()
      ])
      setPrompts(promptsData.prompts)
      setFilteredPrompts(promptsData.prompts)
      setHasMore(promptsData.hasMore)
      setStats(statistics)
      setOffset(0)
      
      // Show success notification (you can add a toast notification here)
      console.log('Prompt submitted successfully!')
    } catch (error) {
      console.error('Error refreshing prompts:', error)
    }
  }, [])

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
