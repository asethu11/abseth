// Google Analytics Configuration
export const GA_CONFIG = {
  // Google Analytics Measurement ID
  MEASUREMENT_ID: 'G-Y9542M0PX9',
  
  // Enable/disable analytics (useful for development)
  ENABLED: process.env.NODE_ENV === 'production',
  
  // Custom dimensions (optional)
  CUSTOM_DIMENSIONS: {
    PROMPT_CATEGORY: 'custom_dimension_1',
    USER_TYPE: 'custom_dimension_2',
  }
}

export default GA_CONFIG
