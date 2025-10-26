// Google Analytics Configuration
export const GA_CONFIG = {
  // Google Analytics Measurement ID
  MEASUREMENT_ID: 'G-NJBNV4HX1R',
  
  // Enable/disable analytics (useful for development)
  ENABLED: process.env.NODE_ENV === 'production',
  
  // Custom dimensions (optional)
  CUSTOM_DIMENSIONS: {
    PROMPT_CATEGORY: 'custom_dimension_1',
    USER_TYPE: 'custom_dimension_2',
  }
}

export default GA_CONFIG
