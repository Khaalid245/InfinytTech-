# InfinityTech

> **Premium, modern, enterprise‑grade web platform**

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Running the Development Server](#running-the-development-server)
- [Build & Deploy](#build--deploy)
- [Design System](#design-system)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
InfinityTech is a technology consultancy that designs, builds, and scales digital products for startups, businesses, and enterprises. The website showcases a **premium, enterprise‑ready design system** inspired by leading SaaS brands such as Linear, Vercel, Stripe, and Ramp.

The recent redesign focuses on:
- A **hero section** that instantly conveys value, trust, and a clear call‑to‑action.
- An **evolved dark‑mode palette** that replaces neon yellow with a sophisticated gold/amber accent.
- **Accessibility‑friendly** colour tokens and contrast ratios.
- **Featured case‑study carousel** with a CSS‑driven progress bar and deep‑linking to project pages.
- **Full Django CMS Integration** for dynamically loading and rendering all Portfolio, Services, Industry Taxonomy, Workflow Process Steps, and FAQ data.

---

## Features
- **Responsive layout** built with React + TypeScript.
- **Premium design system** (dark & light themes, CSS variables, micro‑animations).
- **Hero section** with trust indicators, dual CTA buttons, and auto‑rotating case‑study showcase.
- **Portfolio & Services CMS Integration**: All case studies, capabilities, industries, process timeline steps, and FAQs are loaded dynamically from the backend Django REST Framework APIs.
- **Axios & TanStack Query (React Query) Caching**: Optimised data fetching layer in frontend.
- **Dynamic Icon Resolver**: Maps CMS-configured icon strings directly to premium Lucide React SVG components.
- **Portfolio deep‑linking** (`/work?project={id}`).
- **Accessibility**: proper ARIA labels, focus‑trapping for modals, sufficient colour contrast.
- **Performance optimisations**: lazy‑loaded images, CSS‑only animations, minimal external dependencies.

---

## Demo
You can view a live demo by running the development server locally (see below) or visiting the deployed site at **[https://infinyttech.com]** (replace with actual URL when deployed).

---

## Installation
```bash
# Clone the repository
git clone https://github.com/your-org/infinyttech.git
cd infinyttech/frontend

# Install dependencies (Node.js 20+, npm)
npm install
```

---

## Running the Development Server
```bash
npm run dev
```
Open <http://localhost:3000> in your browser. The server supports hot‑module replacement; any changes to components (e.g., `src/sections/HeroSection.tsx`) will instantly reflect in the browser.

---

## Build & Deploy
```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run start
```
Deploy the `build/` folder to any static‑hosting provider (Vercel, Netlify, AWS S3, etc.).

---

## Design System
The design system lives in `src/index.css` (CSS variables) and `src/constants/theme.ts` (color & shadow tokens). It embraces:
- **Gold/amber accent** (`#D4A017` / `#B8860B`).
- **Deep slate dark background** (`#0B0D0F`).
- **Micro‑animations** (`fade-in-up`, `hero-progress`).
- **Responsive typography** using `clamp()` for fluid scaling.

---

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Ensure linting and TypeScript pass: `npx tsc --noEmit`.
4. Open a Pull Request with a clear description of changes.

> **Note**: All new UI components should follow the existing design system and include appropriate ARIA attributes.

---

## License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

*Generated and updated by Antigravity – a powerful AI coding assistant.*
