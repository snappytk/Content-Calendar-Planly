# Overview

This is a content planning application built as a full-stack web application using React and Express. The app allows users to create, schedule, and manage content items across different platforms (social media, email, blog) with calendar-based visualization. It includes PayPal payment integration and uses a modern tech stack with TypeScript, Tailwind CSS, and shadcn/ui components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with React 18 using TypeScript and follows a component-based architecture:

- **Framework**: React with Vite as the build tool and development server
- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Calendar**: react-big-calendar with moment.js localizer for content scheduling visualization

The frontend follows a feature-based directory structure with reusable UI components, hooks, and utilities. Path aliases are configured for clean imports (@/, @shared/).

## Backend Architecture

The backend uses Express.js with TypeScript in an ESM configuration:

- **Framework**: Express.js with middleware for JSON parsing, URL encoding, and request logging
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Shared TypeScript schema definitions between frontend and backend using Zod
- **Storage**: Abstracted storage interface (IStorage) with in-memory implementation for development
- **API Design**: RESTful API endpoints with proper error handling and status codes

The server includes automatic request/response logging for API endpoints and error handling middleware.

## Data Storage

- **Database**: PostgreSQL using Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with migrations support and schema-first approach
- **Schema**: Content items table with fields for title, description, platform, scheduled date, and status
- **Validation**: Zod schemas for runtime type checking and validation shared between client and server

## Authentication and Authorization

Currently implements a basic user system with username-based lookup. The storage interface includes user management methods, though authentication middleware is not yet implemented.

## External Dependencies

### Payment Processing
- **PayPal SDK**: @paypal/paypal-server-sdk for payment processing with sandbox/production environment switching
- **Payment Flow**: Order creation, capture, and webhook handling (implementation marked as critical and unmodifiable)

### Database and ORM
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle Kit**: Database migrations and schema management
- **Connection**: Environment-based DATABASE_URL configuration

### UI and Styling
- **Radix UI**: Comprehensive primitive components for accessible UI building
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe CSS-in-JS variant management

### Development Tools
- **TypeScript**: Full type safety across the stack
- **Vite**: Fast development server and build tool with HMR
- **ESBuild**: Production bundling for the server
- **TSX**: TypeScript execution for development

### Calendar and Date Handling
- **react-big-calendar**: Calendar component for content scheduling
- **moment.js**: Date manipulation and formatting
- **date-fns**: Modern date utility library

The application is configured for deployment with both development and production build scripts, and includes Replit-specific tooling for the hosted environment.