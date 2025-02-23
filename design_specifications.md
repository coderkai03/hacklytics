# ViralAI Analytics Engine - Design Specifications

## Design System

### Colors

```css
--primary: #2563eb; /* Primary Blue - CTAs, important actions */
--secondary: #3b82f6; /* Light Blue - Secondary elements */
--accent: #f59e0b; /* Orange - Highlights, alerts */
--background: #f3f4f6; /* Light Gray - Main background */
--text: #1f2937; /* Dark Gray - Primary text */
--success: #10b981; /* Green - Success states */
--error: #ef4444; /* Red - Error states */
--neutral: #9ca3af; /* Medium Gray - Inactive states */
```

### Typography

```css
/* Modern, readable font stack with fallbacks */
--heading-font: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
--body-font: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
--mono-font: "JetBrains Mono", "Consolas", monospace;

/* Font sizes */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
```

### Spacing & Layout

```css
/* Consistent spacing scale */
--spacing-xs: 0.25rem; /*  4px */
--spacing-sm: 0.5rem; /*  8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */
--spacing-2xl: 2.5rem; /* 40px */

/* Layout constants */
--max-width: 1280px;
--border-radius: 0.5rem;
--header-height: 4rem;
```

## Component Design

### Navigation

- Sticky header with responsive menu
- Clear visual hierarchy
- Active state indicators
- Mobile-friendly hamburger menu

### Dashboard Components

1. Quick Stats Cards

   - Prominent metrics
   - Clear typography hierarchy
   - Subtle hover effects
   - Loading states
   - **Key metrics:** Hook Score, Retention Rate, Viral Probability, Revenue Potential

2. Performance Graph

   - Interactive tooltips
   - Zoom controls
   - Data point markers
   - Legend with toggle controls
   - Multi-metric comparison
   - Trend visualization

3. Video List
   - Thumbnail previews
   - Key metrics display
   - Infinite scroll
   - Sort/filter controls
   - Quick action buttons
   - Batch analysis support

## Screen Layouts

### Dashboard

```
┌────────────────────────────────────────┐
│ Navigation Bar │
├──────────┬─────────────┬──────────────┤
│ Overview │ Create New │ Analytics │
├──────────┴─────────────┴──────────────┤
│ │
│ Quick Stats │
│ ┌────────┐ ┌────────┐ ┌────────┐ │
│ │ Videos │ │ Views │ │Revenue │ │
│ └────────┘ └────────┘ └────────┘ │
│ │
│ Performance Graph │
│ [Interactive Chart] │
│ │
│ Recent Videos │
│ [Scrollable List with Metrics] │
└───────────────────────────────────────┘
```

### Video Analysis

```
┌────────────────────────────────────────┐
│ Video Analysis │
├───────────────────┬───────────────────┤
│ │ Metrics │
│ Video Preview │ • Hook Score: 8.5 │
│ │ • Retention: 85% │
│ [Player] │ • Viral Prob: 73% │
│ │ │
├───────────────────┴───────────────────┤
│ Recommendations │
│ 1. Hook Optimization │
│ 2. Timing Adjustments │
│ 3. Call-to-Action Placement │
└────────────────────────────────────────┘
```

## User Flows

### Content Creation Flow

1. Dashboard → Create New
2. Upload Video/Input Content
3. AI Analysis
4. Review Recommendations
5. Export/Save

### Analytics Review Flow

1. Dashboard → Analytics
2. Select Time Period
3. View Metrics
4. Generate Reports

## Responsive Design

### Breakpoints

```css
--mobile: 640px; /* Small devices */
--tablet: 768px; /* Medium devices */
--laptop: 1024px; /* Large devices */
--desktop: 1280px; /* Extra large devices */
```

### Mobile Optimizations

- Stack layouts vertically
- Larger touch targets (min 44px)
- Simplified charts
- Swipe gestures
- Bottom navigation bar

## Animation Guidelines

### Transitions

- Duration: 200-300ms
- Timing: ease-in-out
- Use for:
  - Page transitions
  - Modal dialogs
  - Menu expansions
  - Content loading
  - **Real-time analysis updates**
  - **Metric changes**

### Micro-interactions

- Subtle scale on hover
- Loading spinners
- Progress bars
- Success/error animations
- Skeleton loading states

## Accessibility

### Standards

- WCAG 2.1 AA compliance
- Semantic HTML structure
- Focus management
- Keyboard navigation
- Screen reader optimization

### Color Contrast

- Text: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear focus states

## Asset Guidelines

### Icons

- Format: SVG
- Base size: 24x24px
- Stroke width: 2px
- Consistent padding
- Clear touch targets

### Images

- Format: WebP (with fallbacks)
- Responsive sizing
- Lazy loading
- Alt text required
- Compression: 80% quality
