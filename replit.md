# replit.md - Food Ordering System Architecture

## Overview

This is a modern full-stack food ordering application built for a college canteen system. The application allows students to browse dishes, place orders, and track their order status through a mobile-first interface. The system uses a traditional REST API architecture with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state, localStorage for cart and authentication
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the stack
- **API Pattern**: RESTful API with JSON responses
- **Development**: Hot reload with tsx for development server
- **Production**: Compiled to JavaScript with esbuild

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migration**: Drizzle Kit for schema migrations
- **Local Storage**: Browser localStorage for cart persistence and user sessions
- **Development**: In-memory storage fallback for development

## Key Components

### Authentication System
- **Method**: Simple roll number-based authentication
- **Storage**: Student data persists in PostgreSQL, session in localStorage
- **Auto-registration**: New students are automatically created on first login

### Menu and Ordering System
- **Categories**: Organized dish browsing by food categories
- **Search**: Real-time dish search functionality
- **Popular Items**: Special sections for popular dishes by type (veg, non-veg, etc.)
- **Cart Management**: Persistent shopping cart with quantity controls
- **Order Tracking**: Multi-stage order status tracking

### UI Components
- **Mobile-first Design**: Optimized for mobile devices with bottom navigation
- **Component Library**: Comprehensive shadcn/ui component set
- **Responsive Layout**: Tailwind CSS for adaptive layouts
- **Toast Notifications**: User feedback for actions
- **Loading States**: Skeleton loaders and query states

## Data Flow

1. **User Authentication**: Roll number → Backend validation → User creation/retrieval → Frontend session storage
2. **Menu Browsing**: Frontend → REST API → Database → Formatted dish data → UI rendering
3. **Cart Operations**: User actions → localStorage updates → UI synchronization → Custom events
4. **Order Placement**: Cart data → API request → Database insertion → Order confirmation
5. **Order Tracking**: Periodic API calls → Order status updates → UI refresh

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon database connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **express**: Web framework for Node.js

### UI Dependencies
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with hot reload
- **Backend**: tsx with file watching for automatic restarts
- **Database**: Neon serverless PostgreSQL
- **Environment**: NODE_ENV=development

### Production Build
- **Frontend**: Vite build to `dist/public` directory
- **Backend**: esbuild compilation to `dist/index.js`
- **Static Assets**: Express serves frontend build files
- **Database**: Same Neon PostgreSQL instance with production credentials

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared TypeScript types in `/shared` directory for consistency
2. **Database Choice**: PostgreSQL with Drizzle ORM chosen for type safety and serverless compatibility
3. **Authentication**: Simple roll number system chosen over complex auth to reduce friction for students
4. **State Management**: TanStack Query for server state, localStorage for client state to minimize complexity
5. **Mobile-first**: Bottom navigation and touch-friendly interface prioritized for mobile usage
6. **Real-time Updates**: Custom events for cart synchronization across components instead of complex state management