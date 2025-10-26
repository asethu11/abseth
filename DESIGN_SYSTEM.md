# CSS Design System Documentation

## Overview
A comprehensive dark mode design system with orange accents for the React Prompt Marketplace UI. Built with vanilla CSS using CSS custom properties for maintainability and consistency.

## Color Palette

### Background Colors
- `--color-bg-primary: #0a0a0a` - Main background
- `--color-bg-secondary: #121212` - Header/sidebar backgrounds
- `--color-bg-tertiary: #1a1a1a` - Card backgrounds
- `--color-bg-card: #1e1e1e` - Individual card backgrounds
- `--color-bg-hover: #2a2a2a` - Hover states

### Text Colors
- `--color-text-primary: #ffffff` - Primary text
- `--color-text-secondary: #b3b3b3` - Secondary text
- `--color-text-muted: #808080` - Muted text
- `--color-text-inverse: #0a0a0a` - Text on orange backgrounds

### Orange Accent Colors
- `--color-orange-primary: #ff6b35` - Primary orange
- `--color-orange-secondary: #ff8c42` - Secondary orange
- `--color-orange-tertiary: #ffa057` - Tertiary orange
- `--color-orange-muted: #cc5a2b` - Muted orange
- `--color-orange-hover: #ff7a4a` - Hover orange

### Semantic Colors
- `--color-success: #4ade80` - Success states
- `--color-warning: #fbbf24` - Warning states
- `--color-error: #f87171` - Error states
- `--color-info: #60a5fa` - Info states

## Typography Scale

### Font Families
- `--font-family-primary` - System font stack for UI
- `--font-family-mono` - Monospace for code

### Font Sizes
- `--font-size-xs: 0.75rem` (12px)
- `--font-size-sm: 0.875rem` (14px)
- `--font-size-base: 1rem` (16px)
- `--font-size-lg: 1.125rem` (18px)
- `--font-size-xl: 1.25rem` (20px)
- `--font-size-2xl: 1.5rem` (24px)
- `--font-size-3xl: 1.875rem` (30px)
- `--font-size-4xl: 2.25rem` (36px)

### Font Weights
- `--font-weight-normal: 400`
- `--font-weight-medium: 500`
- `--font-weight-semibold: 600`
- `--font-weight-bold: 700`

## Spacing System

### Spacing Scale
- `--space-1: 0.25rem` (4px)
- `--space-2: 0.5rem` (8px)
- `--space-3: 0.75rem` (12px)
- `--space-4: 1rem` (16px)
- `--space-5: 1.25rem` (20px)
- `--space-6: 1.5rem` (24px)
- `--space-8: 2rem` (32px)
- `--space-10: 2.5rem` (40px)
- `--space-12: 3rem` (48px)
- `--space-16: 4rem` (64px)
- `--space-20: 5rem` (80px)
- `--space-24: 6rem` (96px)

## Border Radius

- `--radius-sm: 0.25rem` (4px) - Small elements
- `--radius-md: 0.5rem` (8px) - Default elements
- `--radius-lg: 0.75rem` (12px) - Cards
- `--radius-xl: 1rem` (16px) - Large cards
- `--radius-full: 9999px` - Pills and badges

## Shadows

### Standard Shadows
- `--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3)`
- `--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)`
- `--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)`
- `--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.2)`

### Orange Glow Effects
- `--shadow-orange: 0 0 20px rgba(255, 107, 53, 0.3)`
- `--shadow-orange-lg: 0 0 30px rgba(255, 107, 53, 0.4)`

## Transitions

- `--transition-fast: 150ms ease-in-out` - Quick interactions
- `--transition-normal: 250ms ease-in-out` - Standard transitions
- `--transition-slow: 350ms ease-in-out` - Complex animations

## Component Patterns

### Layout Components

#### Grid Layout
```css
.layout-container {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main";
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: var(--header-height) 1fr;
  min-height: 100vh;
}
```

#### Header
- Fixed height: `var(--header-height: 4rem)`
- Background: `var(--header-bg)`
- Sticky positioning with z-index

#### Sidebar
- Width: `var(--sidebar-width: 16rem)`
- Collapsible on mobile
- Background: `var(--sidebar-bg)`

### Card Components

#### Base Card
```css
.card {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  box-shadow: var(--card-shadow);
  transition: all var(--transition-normal);
}
```

#### Prompt Card
- Hover effects with orange glow
- Category badges
- Tag display
- Model compatibility indicators

### Form Elements

#### Input Fields
```css
.form-input {
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  transition: all var(--transition-fast);
}
```

#### Search Bar
- Rounded design with icon
- Orange focus states
- Debounced input handling

### Buttons

#### Button Variants
- `btn--primary` - Orange background
- `btn--secondary` - Gray background
- `btn--ghost` - Transparent background

#### Button Sizes
- `btn--sm` - Small buttons
- `btn--lg` - Large buttons

### Badges

#### Badge Types
- `badge--primary` - Orange background
- `badge--secondary` - Gray background
- `badge--outline` - Orange border

## Responsive Design

### Breakpoints
- `--breakpoint-sm: 640px`
- `--breakpoint-md: 768px`
- `--breakpoint-lg: 1024px`
- `--breakpoint-xl: 1280px`
- `--breakpoint-2xl: 1536px`

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Collapsible sidebar on mobile
- Responsive grid layouts

## Accessibility

### Focus States
- Orange outline for keyboard navigation
- High contrast ratios
- Screen reader friendly markup

### Color Contrast
- White text on dark backgrounds
- Orange accents for interactive elements
- Sufficient contrast ratios for WCAG compliance

## Performance Considerations

### CSS Optimization
- CSS custom properties for efficient theming
- Minimal specificity for faster rendering
- Optimized animations with `transform` and `opacity`

### Loading States
- Skeleton loaders for content
- Spinner animations
- Smooth transitions between states

## Usage Guidelines

### Naming Convention
- BEM methodology for component classes
- Semantic naming for utility classes
- Consistent spacing and sizing

### Component Structure
```css
.component {
  /* Base styles */
}

.component__element {
  /* Element styles */
}

.component--modifier {
  /* Modifier styles */
}
```

### Best Practices
- Use CSS custom properties for theming
- Maintain consistent spacing using the scale
- Use semantic color names
- Optimize for performance and accessibility
