# Implementation Plan: IIT Kharagpur MVP Platform

This document outlines the architecture, tooling, and steps to build the Phase 1 MVP of the commercialization platform.

## User Review Required
> [!IMPORTANT]
> The design system guidelines stipulate that we should avoid TailwindCSS unless you specifically request it. Instead, we will use standard Vanilla CSS/CSS Modules for a completely custom "Premium" look. 
> We will also use standard JavaScript instead of TypeScript based on standard platform setup guidelines unless you prefer TypeScript.
> **Please confirm if you are okay with Next.js (JavaScript, App Router) and Vanilla CSS, or if you prefer a different stack.**

## Proposed Changes

We will bootstrap the repository here and implement the core feature set of Phase 1.

### 1. Project Initialization
- Run `npx -y create-next-app@latest ./ --js --no-tailwind --eslint --app --src-dir --import-alias "@/*"` to scaffold the application.
- Clean up default Next.js boilerplate.

### 2. Design System Setup (Vanilla CSS)
- Set up `globals.css` with CSS variables mapped to the requested palette: IIT Blue, steel grey, graphite, and clean white.
- Define modern typographies (e.g., Google Fonts 'Inter' for UI, 'Roboto' for technical data).
- Establish macro-layout structures (glassmorphism accents, polished cards, subtle micro-animations).

### 3. Core Components 
- **Navigation (Header/Footer):** Institute-branded, responsive navbar with search entry points.
- **Entity Cards:** `TechnologyCard` and `StartupCard` visualizing TRL badges, patent status pills, and short commercial summaries.
- **Button & Form Controls:** Reusable inputs for the inquiry and filtering experiences.

### 4. Page Architecture
- **Home Page (`/`):** Hero section, "Industry Pain Points" navigation, and featured technologies.
- **Technology Directory (`/technologies`):** A list view showcasing our curated array of items, with a rudimentary filter layout.
- **Technology Detail Page (`/technologies/[id]`):** The core display page highlighting the bottleneck, innovation, validation data, and "Request NDA" CTA.
- **Startup Directory (`/startups`):** A showcase of institute-affiliated ventures.

## Open Questions
1. Do you want to include any specific placeholder logos or just use text placeholders for "IIT Kharagpur MME" for now?
2. Shall I generate 3-4 realistic "dummy" deep-tech records (e.g. Battery recycling tech, Steel process optimization) so the UI doesn't look empty?

## Verification Plan

### Automated / Local Verification
- Run `npm run dev` and navigate to the application using the browser tool.
- Verify that standard routing works between Home, Technologies, and Startups.
- Inspect the CSS to ensure high-fidelity aesthetics without utility classes leaking.

### Manual Verification
- Share screenshot artifacts or walkthrough videos directly showing the Premium look and feel of the platform.
