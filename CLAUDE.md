# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application with TypeScript, Tailwind CSS v4, and React 19. It's a fresh project created with `create-next-app` using the App Router architecture.

## Development Commands

- `npm run dev` - Start development server with Turbopack (opens at http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Directory Structure
- `src/app/` - App Router pages and layouts using Next.js 13+ convention
- `src/app/layout.tsx` - Root layout with Geist fonts and global styles
- `src/app/page.tsx` - Homepage component
- `src/app/globals.css` - Global styles with Tailwind CSS v4 and CSS variables
- `public/` - Static assets (SVG icons)

### Key Technologies
- **Next.js 15** with App Router - File-based routing in `src/app/`
- **TypeScript** - Strict mode enabled with path aliases (`@/*` → `./src/*`)
- **Tailwind CSS v4** - Utility-first CSS with PostCSS integration
- **React 19** - Latest React with server components support
- **Geist Font** - Next.js font optimization for Geist Sans and Mono

### Styling Architecture
- CSS variables defined in `globals.css` for theming (light/dark mode support)
- Tailwind configuration uses inline theme with CSS variables
- Dark mode handled via `prefers-color-scheme` media query

## Development Notes

- Uses Turbopack for fast development builds
- TypeScript path aliases configured for `@/*` imports
- Font variables are applied to body element for consistent typography
- All images use Next.js `Image` component for optimization
- Use conventions from the official nextjs.org tutorials and documentation
- Utilise subagents in parallel when handling complex tasks or in other necessary circumstances to improve efficiency