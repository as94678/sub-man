# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

The main application is located in the `subscription-manager/` directory. All commands should be run from this directory:

```bash
cd subscription-manager/
```

- **Development server**: `npm run dev` - Starts Vite dev server with HMR
- **Build**: `npm run build` - Creates production build
- **Lint**: `npm run lint` - Runs ESLint with React-specific rules
- **Preview**: `npm run preview` - Preview production build locally

## Application Architecture

This is a React + Vite subscription management application with the following key architectural patterns:

### State Management
- Uses custom hooks pattern for state management (no external state library)
- Main state hooks located in `src/hooks/`:
  - `useSubscriptions.js` - Manages subscription data, CRUD operations, and derived calculations
  - `useCurrency.js` - Handles currency conversion and exchange rates
  - `useTheme.js` - Dark/light mode theme management

### Component Structure
- **Layout Components** (`src/components/Layout/`): Header and Navigation
- **View Components**: Dashboard, Charts, Calendar, and ListView - these are the main app screens
- **Form Components** (`src/components/Forms/`): SubscriptionForm and CurrencyConverter
- **Common Components** (`src/components/Common/`): Reusable Modal and FloatingAddButton
- **Specialized Components**: Charts (using Recharts) and Calendar components

### Data Flow
- App component manages global state via hooks and passes data down as props
- View switching handled by `activeView` state in App.jsx
- Modal forms for adding/editing subscriptions
- Initial data stored in `src/data/initialData.js`

### Key Features
- Multi-currency support with real-time conversion
- Dark/light theme support
- Multiple view modes: Dashboard, Charts, Calendar, List
- Subscription CRUD operations
- Upcoming renewals tracking
- Category-based spending analysis

### Technology Stack
- React 18 with Vite
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- ESLint for code quality

### Utility Functions
- `src/utils/currency.js` - Currency conversion logic
- `src/utils/calendar.js` - Date/calendar utilities
- `src/utils/googleCalendar.js` - Google Calendar integration (if used)

The application follows a component-per-feature organization and uses custom hooks for complex state logic rather than external state management libraries.