# Google Analytics Setup Guide

This project includes Google Analytics integration to track user interactions and page views. Follow these steps to complete the setup:

## 1. Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use an existing one
3. Get your Measurement ID (format: `G-XXXXXXXXXX` for GA4)

## 2. Update Configuration

Replace `GA_MEASUREMENT_ID` with your actual Measurement ID in these files:

### `index.html`
```html
<!-- Replace GA_MEASUREMENT_ID with your actual ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_title: document.title,
    page_location: window.location.href
  });
</script>
```

### `src/config/analytics.ts`
```typescript
export const GA_CONFIG = {
  MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with your actual ID
  ENABLED: process.env.NODE_ENV === 'production',
  // ... rest of config
}
```

## 3. What's Being Tracked

The following events are automatically tracked:

- **Page Views**: Initial page load and navigation
- **Prompt Views**: When users click on a prompt to view details
- **Search Events**: When users search for prompts (with query and result count)
- **Category Filters**: When users filter by category
- **Load More**: When users load additional prompts via infinite scroll
- **Prompt Submissions**: When users submit new prompts

## 4. Custom Events

You can track additional custom events using the `useGoogleAnalytics` hook:

```typescript
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics'

const { trackEvent } = useGoogleAnalytics()

// Track a custom event
trackEvent('custom_action', {
  event_category: 'user_interaction',
  event_label: 'button_click',
  custom_parameter: 'value'
})
```

## 5. Development vs Production

Analytics tracking is automatically disabled in development mode and only enabled in production builds. This prevents test data from polluting your analytics.

## 6. Privacy Considerations

This implementation follows Google Analytics best practices:
- No personal data is collected
- Only anonymous usage statistics are tracked
- Users can opt out via browser settings or ad blockers

## 7. Testing

To test analytics in development:
1. Temporarily set `ENABLED: true` in `src/config/analytics.ts`
2. Use Google Analytics Real-time reports to verify events
3. Remember to set it back to `false` for development

## 8. Verification

After deployment, verify analytics are working by:
1. Visiting your site
2. Performing various actions (search, filter, view prompts)
3. Checking Google Analytics Real-time reports
4. Looking for the tracked events in the Events section
