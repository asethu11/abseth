# PromptMarket - AI Prompt Library

A modern, responsive library for discovering and sharing AI prompts built with Next.js and vanilla CSS.

## Features

- **Home Page**: Hero section, featured prompts, categories overview, and call-to-action sections
- **Browse Page**: Search and filter prompts with advanced filtering options
- **Prompt Detail Page**: Full prompt information, reviews, and related prompts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations and transitions

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS Modules
- **Icons**: SVG icons (Material Design inspired)
- **Data**: Mock JSON data for development

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
prompt-marketplace/
├── app/
│   ├── page.tsx                 # Home page
│   ├── browse/
│   │   └── page.tsx            # Browse/Search page
│   ├── prompts/
│   │   └── [id]/
│   │       └── page.tsx        # Prompt detail page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles and design system
├── components/
│   ├── Navbar/                 # Navigation component
│   ├── PromptCard/             # Prompt card component
│   ├── SearchBar/              # Search and filter component
│   ├── RatingStars/            # Star rating component
│   └── Footer/                 # Footer component
├── data/
│   └── prompts.json            # Mock prompts data
└── README.md
```

## Design System

The project uses a comprehensive design system with CSS custom properties:

- **Colors**: Primary pink (#862041), secondary blue, neutral grays
- **Typography**: System font stack with consistent sizing
- **Spacing**: Consistent spacing scale using CSS variables
- **Components**: Reusable button, card, and form styles
- **Responsive**: Mobile-first responsive design

## Pages

### Home Page (`/`)
- Hero section with marketplace introduction
- Featured prompts showcase
- Categories overview with icons
- Statistics section
- Call-to-action sections

### Browse Page (`/browse`)
- Search functionality with real-time filtering
- Advanced filters (category, rating, sort)
- Responsive grid layout
- Pagination for large result sets
- Loading states and empty states

### Prompt Detail Page (`/prompts/[id]`)
- Full prompt information and content
- Copy-to-clipboard functionality
- Reviews and ratings display
- Related prompts suggestions
- Purchase interface (UI only)

## Components

### Navbar
- Responsive navigation with mobile menu
- Search bar integration
- User authentication links
- Brand logo with gradient text

### PromptCard
- Multiple variants (default, featured, compact)
- Rating display with stars
- Seller information
- Price and category badges
- Hover effects and animations

### SearchBar
- Advanced filtering options
- Real-time search
- Sort functionality
- Responsive design

### RatingStars
- Configurable star display
- Half-star support
- Review count integration
- Multiple sizes

## Future Enhancements

- Backend integration (Supabase/Firebase)
- User authentication and profiles
- Payment processing (Stripe)
- Real-time search and filtering
- User reviews and ratings system
- Seller dashboard
- Admin panel
- API integration for prompt testing

## Development

The project is set up for easy development and customization:

- **Hot Reload**: Automatic page refresh on file changes
- **TypeScript**: Full type safety and IntelliSense
- **CSS Modules**: Scoped styling with no conflicts
- **ESLint**: Code quality and consistency
- **Responsive**: Mobile-first design approach

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for demonstration purposes. Feel free to use it as a starting point for your own marketplace application.