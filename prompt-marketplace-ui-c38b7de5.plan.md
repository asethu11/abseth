<!-- c38b7de5-161b-4000-a5bd-facb2b8a2035 dd2ccd7b-80c0-4a88-a0e6-e1c4d168442b -->
# User Journey & Prompt Testing Feature

## User Flow Overview

1. **Landing/Browse Page** → User searches/filters prompts by keywords, tags, categories, models, and ratings
2. **Prompt Card Click** → Navigate to detail page with full prompt information
3. **Test Prompt Button** → Opens left-side panel with chat UI to test the prompt in real-time
4. **Free vs Paid Flow**:
   - Free prompts: Instant access to view and test
   - Paid prompts: Require sign-in to purchase/access

## Implementation Tasks

### 1. Enhanced Search & Filtering (Browse Page)
**File**: `app/page.tsx`
- Update filtering logic to include tags and compatible models
- Add tag-based filtering alongside category filtering
- Add model filtering (GPT-4, Claude, Gemini, etc.)
- Keep existing rating filter
- Maintain sort options (newest, popular, rating, price)

**File**: `components/SearchBar/SearchBar.tsx`
- Add tag filter dropdown/multi-select
- Add compatible models filter
- Update filter state management to include tags and models
- Propagate filter changes to parent component

### 2. Prompt Detail Page Updates
**File**: `app/prompts/[id]/page.tsx`
- Convert to client component ('use client')
- Add state for side panel open/close
- Add "Test This Prompt" button prominently displayed
- Implement panel toggle handler
- Add authentication check for paid prompts (show sign-in required message)
- Pass full prompt text to chat panel component

### 3. Chat Panel Component (New)
**File**: `components/ChatPanel/ChatPanel.tsx`
- Create slide-in panel component from left side
- Add chat UI with message history display
- Add text input for user messages
- Add send button functionality
- Display prompt being tested at top of panel
- Add close button to dismiss panel
- Implement basic message state management (user messages and AI responses)
- For MVP: Mock AI responses (can integrate OpenRouter API later)

**File**: `components/ChatPanel/ChatPanel.module.css`
- Fixed position panel sliding from left
- Width: 400-500px on desktop, full width on mobile
- Chat message bubbles (user vs AI styling)
- Input area fixed at bottom
- Smooth slide-in/out animation
- Overlay backdrop when panel is open

### 4. Authentication Flow (Basic Setup)
**File**: `app/prompts/[id]/page.tsx`
- Check if prompt is free (price === 0)
- For free prompts: Show "Test This Prompt" button directly
- For paid prompts: Show "Sign In to Test" or "Purchase to Test" button
- Add isAuthenticated state (mock for now, can integrate Supabase later)

### 5. UI/UX Enhancements

**Quick Access Features**:
- Keyboard shortcuts (Escape to close panel, Enter to send message)
- Loading states for AI responses
- Empty state in chat panel with instructions
- Clear visual distinction between free and paid prompts on detail page

**Mobile Responsiveness**:
- Chat panel takes full screen on mobile
- Filters collapsed by default on mobile
- Touch-friendly button sizes

## Key Files to Create

1. `components/ChatPanel/ChatPanel.tsx` - Main chat panel component
2. `components/ChatPanel/ChatPanel.module.css` - Panel styling

## Key Files to Modify

1. `app/page.tsx` - Enhanced filtering logic
2. `components/SearchBar/SearchBar.tsx` - Add tag and model filters
3. `app/prompts/[id]/page.tsx` - Convert to client component, add test button and panel
4. `app/prompts/[id]/page.module.css` - Add test button styling

## User Journey Summary

**Scenario: User wants a creative writing prompt**

1. Lands on browse page → Sees search bar and filters at top
2. Types "creative writing" in search OR selects "Creative Writing" category
3. Optionally filters by compatible models (e.g., "GPT-4") and tags
4. Sees 4 cards per row with clear FREE badges
5. Clicks on a promising prompt card
6. Views full prompt details with description, tags, models
7. Clicks "Test This Prompt" button (no friction for free prompts)
8. Side panel slides in from left with chat UI
9. Tests the prompt by sending messages
10. Satisfied with results → Can copy prompt or continue using
11. Closes panel and exits OR browses more prompts

**Total clicks to test a free prompt: 3** (select category, click card, click test button)

### To-dos

- [ ] Add tag and model filtering to SearchBar component
- [ ] Update browse page filtering logic to handle tags and models
- [ ] Build ChatPanel component with slide-in animation and chat UI
- [ ] Convert detail page to client component and add test button with panel integration
- [ ] Add authentication checks for free vs paid prompts
- [ ] Implement keyboard shortcuts (Escape, Enter) for chat panel