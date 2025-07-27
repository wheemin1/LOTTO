# LuckySim - 복권 시뮬레이터

## Overview

LuckySim is a 100% client-side lottery simulator supporting Korean lottery games including Lotto 6/45, Scratch tickets (Speetto1000), and Pension lottery 720+. The application is designed as a Progressive Web App (PWA) that works completely offline, providing users with a safe and entertaining way to experience lottery games without actual gambling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript in a Single Page Application (SPA) architecture
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS custom properties for theming

### Backend Architecture
- **Server**: Express.js server primarily for development and static file serving
- **API**: Minimal REST API structure (currently unused as app is client-side only)
- **Development**: Hot module replacement via Vite integration

### State Management
- **Primary**: Zustand for lottery game state and ticket management
- **Secondary**: Zustand persist middleware for data persistence
- **Settings**: Separate Zustand store for application settings and preferences

## Key Components

### Core Features
1. **Lottery Simulators**
   - Lotto 6/45: Number selection (manual/auto), drawing simulation, prize calculation
   - Scratch Tickets: Interactive scratch-off simulation with touch/mouse support
   - Pension Lottery 720+: 7-digit number selection and monthly payout simulation

2. **Cryptographic Random Generation**
   - Web Crypto API for secure random number generation
   - Custom CryptoRandom class ensuring fair and verifiable results
   - SHA-256 seed verification for transparency

3. **Progressive Web App**
   - Service Worker for offline functionality
   - Web App Manifest for native app-like experience
   - Cache strategies for static assets and runtime caching

4. **Statistics and Analytics**
   - Purchase history tracking
   - ROI (Return on Investment) calculations
   - Win rate analysis and visualization
   - Recharts integration for data visualization

### Technical Components
- **Database**: IndexedDB via Dexie for client-side data persistence
- **Routing**: File-based routing with Wouter
- **Theming**: Dark/light mode support with CSS custom properties
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

1. **User Interaction**: User selects lottery type and purchases tickets
2. **Random Generation**: CryptoRandom generates secure random numbers
3. **Game Logic**: LotteryLogic processes game rules and determines results
4. **State Update**: Zustand stores update with new tickets and statistics
5. **Persistence**: Data automatically persists to IndexedDB via Zustand middleware
6. **UI Update**: React components re-render with updated state

### Data Storage Strategy
- **Local Storage**: User preferences and settings via Zustand persist
- **IndexedDB**: Ticket history, game results, and statistics via Dexie
- **No Server Storage**: Complete client-side operation for privacy and offline support

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **UI Libraries**: Radix UI primitives, Lucide React icons
- **State Management**: Zustand with persist middleware
- **Database**: Dexie for IndexedDB operations
- **Styling**: Tailwind CSS, class-variance-authority for component variants

### Development Dependencies
- **Build Tools**: Vite, TypeScript, ESBuild
- **Code Quality**: ESLint, Prettier (configured but not visible in files)
- **Server**: Express.js for development server

### Optional Integrations
- **Charts**: Recharts for statistics visualization
- **Forms**: React Hook Form with Zod validation (hookform/resolvers present)
- **Date Handling**: date-fns for date manipulation

## Deployment Strategy

### Target Platform
- **Primary**: Static hosting (Netlify) for production deployment
- **Development**: Vite dev server with Express.js backend
- **Build Process**: Vite builds client-side assets, ESBuild bundles server code

### Deployment Characteristics
- **Static Generation**: Client-side application with no server dependencies
- **CDN Ready**: All assets optimized for CDN distribution
- **Offline First**: Service Worker ensures functionality without network
- **Mobile Optimized**: PWA features for mobile installation

### Performance Optimizations
- **Code Splitting**: Vite automatic code splitting for optimal loading
- **Asset Optimization**: Image and font optimization via Vite plugins
- **Caching Strategy**: Service Worker implements cache-first strategy for static assets
- **Bundle Size**: Tree-shaking and dead code elimination via Vite/ESBuild

### Database Considerations
The application currently includes Drizzle ORM configuration with PostgreSQL schema definitions in the shared folder, suggesting potential for future server-side features. However, the current implementation is entirely client-side using IndexedDB.