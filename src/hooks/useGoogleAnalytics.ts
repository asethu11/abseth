import { GA_CONFIG } from '../config/analytics'

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}

interface EventParameters {
  event_category?: string
  event_label?: string
  value?: number
  [key: string]: any
}

export const useGoogleAnalytics = () => {
  // Track page views
  const trackPageView = (page_path: string, page_title?: string) => {
    if (typeof window !== 'undefined' && window.gtag && GA_CONFIG.ENABLED) {
      window.gtag('config', GA_CONFIG.MEASUREMENT_ID, {
        page_path,
        page_title: page_title || document.title,
      })
    }
  }

  // Track custom events
  const trackEvent = (
    event_name: string,
    parameters?: EventParameters
  ) => {
    if (typeof window !== 'undefined' && window.gtag && GA_CONFIG.ENABLED) {
      window.gtag('event', event_name, parameters)
    }
  }

  // Track prompt interactions
  const trackPromptView = (promptId: string, promptTitle: string, category: string) => {
    trackEvent('prompt_view', {
      event_category: 'prompt_interaction',
      event_label: promptTitle,
      prompt_id: promptId,
      prompt_category: category,
    })
  }

  const trackPromptSearch = (searchQuery: string, resultsCount: number) => {
    trackEvent('prompt_search', {
      event_category: 'search',
      event_label: searchQuery,
      search_results_count: resultsCount,
    })
  }

  const trackCategoryFilter = (category: string) => {
    trackEvent('category_filter', {
      event_category: 'filter',
      event_label: category,
    })
  }

  const trackPromptSubmit = () => {
    trackEvent('prompt_submit', {
      event_category: 'user_action',
      event_label: 'new_prompt_submitted',
    })
  }

  const trackLoadMore = (currentCount: number) => {
    trackEvent('load_more_prompts', {
      event_category: 'pagination',
      event_label: 'infinite_scroll',
      current_prompts_count: currentCount,
    })
  }

  return {
    trackPageView,
    trackEvent,
    trackPromptView,
    trackPromptSearch,
    trackCategoryFilter,
    trackPromptSubmit,
    trackLoadMore,
  }
}

export default useGoogleAnalytics
