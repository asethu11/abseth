import { useState, useEffect, useMemo, useCallback } from 'react'
import Layout from './components/Layout/Layout'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import PromptGrid from './components/Prompts/PromptGrid'
import PromptDetail from './components/Prompts/PromptDetail'
import { Prompt } from '../types'
import { getAllPrompts, searchPrompts, getStatistics } from '../prompts'

function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ totalPrompts: 0, categories: {} })

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [allPrompts, statistics] = await Promise.all([
          getAllPrompts(),
          getStatistics()
        ])
        setPrompts(allPrompts)
        setFilteredPrompts(allPrompts)
        setStats(statistics)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle search and filtering with memoization
  const filteredPromptsMemo = useMemo(() => {
    return filteredPrompts
  }, [filteredPrompts])

  // Handle search and filtering
  useEffect(() => {
    const filterPrompts = async () => {
      if (!searchQuery.trim() && !selectedCategory) {
        setFilteredPrompts(prompts)
        return
      }

      try {
        let results = prompts

        if (searchQuery.trim()) {
          results = await searchPrompts(searchQuery)
        }

        if (selectedCategory) {
          results = results.filter(prompt => prompt.category === selectedCategory)
        }

        setFilteredPrompts(results)
      } catch (error) {
        console.error('Error filtering prompts:', error)
        setFilteredPrompts(prompts)
      }
    }

    filterPrompts()
  }, [searchQuery, selectedCategory, prompts])

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

  return (
    <Layout>
      <Header onSearch={handleSearch} />
      <Sidebar 
        stats={stats}
        selectedCategory={selectedCategory}
        onCategoryFilter={handleCategoryFilter}
      />
      <main className="main">
        <PromptGrid 
          prompts={filteredPromptsMemo}
          isLoading={isLoading}
          onPromptSelect={handlePromptSelect}
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
