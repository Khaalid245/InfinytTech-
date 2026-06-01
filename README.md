# InfinytTech Website

This is the marketing website for InfinytTech. It's built with Next.js, React, TypeScript, and Tailwind CSS. The site has six pages: Home, About, Services, Work, Blog, and Contact.

---

## What's in here

- [Tech stack](#tech-stack)
- [Before you start](#before-you-start)
- [Running the project](#running-the-project)
- [Folder structure](#folder-structure)
- [Pages](#pages)
- [How the components are organized](#how-the-components-are-organized)
- [Styles and colors](#styles-and-colors)
- [Fonts](#fonts)
- [Adding a new page](#adding-a-new-page)
- [Services page](#services-page)
- [Adding a new work card](#adding-a-new-work-card)
- [Building for production](#building-for-production)
- [Before you push — commit everything](#before-you-push--commit-everything)
- [Deploying to Vercel](#deploying-to-vercel)
- [Environment variables](#environment-variables)
- [npm scripts](#npm-scripts)
- [Things to watch out for](#things-to-watch-out-for)
- [Implementation Summary](#implementation-summary)
- [Design System](#design-system)
- [Key Files — What to Edit and When](#key-files--what-to-edit-and-when)
- [Collaboration Rules](#collaboration-rules)

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Poppins + Caveat (Google Fonts) |
| Build | Turbopack |

---

## Before you start

You need Node.js v20.9 or newer. If you're not sure what version you have, run this:

```bash
node --version
```

If it shows something older than v20.9, grab the latest LTS version from [nodejs.org](https://nodejs.org).

---

## Running the project

**1. Go into the project folder**

```bash
cd path/to/Tech/infinyttech
```

**2. Install the dependencies**

```bash
npm install
```

This downloads everything listed in `package.json`. It only takes a minute. You'll see a `node_modules` folder appear when it's done.

**3. Start the dev server**

```bash
npm run dev
```

You'll see something like this in the terminal:

```
▲ Next.js 16.2.6 (Turbopack)
- Local: http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser and you should see the home page.

> If port 3000 is already taken, Next.js will try 3001, then 3002, and so on. The terminal always tells you the actual URL.

Any file you save will update in the browser automatically — no need to refresh.

---

## Folder structure

```
infinyttech/
├── public/                        # Static files served as-is
│   ├── logo.png                   # Main logo
│   ├── logo1.png                  # Logo variant
│   ├── card.png                   # Generic card image
│   ├── card1.png                  # Work card images (card1 – card6)
│   ├── card2.png
│   ├── card3.png
│   ├── card4.png
│   ├── card5.png
│   ├── card6.png
│   ├── About.png                  # About page image
│   ├── Blog.png                   # Blog page image
│   ├── Service.png                # Service page image
│   ├── Work.png                   # Work page image
│   ├── testimonial1-img.png       # Testimonial avatar images
│   ├── testimonial2-img.png
│   ├── testimonial3-img.png
│   ├── testimonial4-img.png
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                       # One folder = one page (Next.js App Router)
│   │   ├── layout.tsx             # Shared layout — adds Nav and Footer to every page
│   │   ├── page.tsx               # Home page  ( / )
│   │   ├── globals.css            # All styles and CSS color variables
│   │   ├── favicon.ico
│   │   ├── about/
│   │   │   └── page.tsx           # About page  ( /about )
│   │   ├── blog/
│   │   │   └── page.tsx           # Blog page  ( /blog )
│   │   ├── contact/
│   │   │   └── page.tsx           # Contact page  ( /contact )
│   │   ├── projects/
│   │   │   └── page.tsx           # Work page  ( /projects ) — shown as "Work" in the nav
│   │   └── services/
│   │       └── page.tsx           # Services page  ( /services )
│   └── components/
│       ├── icons/
│       │   └── Icons.tsx          # Every icon used in the project is exported from here
│       ├── layout/
│       │   ├── Nav.tsx            # Navigation bar
│       │   └── Footer.tsx         # Footer
│       ├── sections/              # Page-level sections dropped into pages
│       │   ├── HomeHero.tsx       # Hero section on the home page
│       │   ├── ServicesSection.tsx        # The 6 service cards + the service detail modal (both live in this file)
│       │   ├── ProjectsSection.tsx        # Work card preview on the home page
│       │   ├── ProjectsFilterSection.tsx  # Filterable full work grid on /projects
│       │   ├── ProjectModal.tsx           # Detail modal that opens when you click a work card
│       │   ├── ProjectCTA.tsx             # CTA section on the work page
│       │   ├── WhyChooseSection.tsx       # "Why choose us" section
│       │   ├── TestimonialSection.tsx     # Client testimonials
│       │   ├── StatsSection.tsx           # Stats/numbers section
│       │   ├── IndustriesSection.tsx      # Industries we work in
│       │   ├── ConnectCTA.tsx             # "Let's connect" call-to-action
│       │   ├── FinalCTA.tsx               # Bottom CTA section
│       │   └── projects-data.ts           # All work card content lives here
│       └── ui/
│           ├── Button.tsx                 # Reusable button component
│           └── Eyebrow.tsx               # Small label shown above headings
├── next.config.ts                 # Next.js config (Turbopack enabled)
├── tsconfig.json                  # TypeScript config
├── postcss.config.mjs             # PostCSS config for Tailwind v4
└── package.json                   # Dependencies and scripts
```

---

## Pages

| Page | URL | What's on it |
|---|---|---|
| Home | `/` | Hero, services preview, work preview, why choose us, testimonials |
| Services | `/services` | 6 service cards, outcomes, process steps, tech marquee, CTA |
| Work | `/projects` | Filterable portfolio cards, each opens a detail modal |
| About | `/about` | Company story, team, values |
| Blog | `/blog` | Blog post listing |
| Contact | `/contact` | Contact form with project type and budget selectors |

> **Contact form heads-up:** the form UI is complete but it doesn't actually send emails yet. It just shows a success message on submit. To make it deliver messages, you'll need to wire up a service like [Resend](https://resend.com) or [Formspree](https://formspree.io).

---

## How the components are organized

### Nav and Footer

You don't need to add the nav or footer to any page yourself. The `layout.tsx` file wraps every page with them automatically.

### Icons

All icons are in one file — `src/components/icons/Icons.tsx`. To use an icon anywhere in the project:

```tsx
import { Icons } from "@/components/icons/Icons";

<Icons.rocket />
<Icons.brainCircuit />
```

To add a new icon, open `Icons.tsx`, import it from `lucide-react`, and add it to the `Icons` object.

### Eyebrow

The small uppercase label you see above section headings is the `Eyebrow` component. Pass `center` to center it.

```tsx
import Eyebrow from "@/components/ui/Eyebrow";

<Eyebrow center>Our Services</Eyebrow>
```

### Work data

All the work/portfolio cards are defined in one file: `src/components/sections/projects-data.ts`. Both the home page preview and the full work page pull from the same `PROJECTS` array in that file.

---

## Styles and colors

This project uses Tailwind CSS v4, which works differently from v3. The main difference is that all the colors, spacing, and theme values are set as CSS variables inside `src/app/globals.css` — there's no `tailwind.config.ts` file.

To change a color or spacing value, open `globals.css` and look near the top for the `:root` block:

```css
:root {
  --brand-500: #1957DE;
  --navy-900:  #0A1B2E;
  --bg:        #FAF8F4;
  --gray-500:  #6B7A8C;
  /* ...and so on */
}
```

Change a value and the browser will update instantly.

Most of the component-specific styles are also written in `globals.css`, grouped by component name with comments to help you find them.

---

## Fonts

Two fonts are used across the site, both loaded from Google Fonts:

| Font | Where it's used |
|---|---|
| **Poppins** | All headings and body text |
| **Caveat** | Handwritten-style accent text in hero sections |

They're loaded in `src/app/layout.tsx` and made available as CSS variables:

```css
font-family: var(--font-poppins);
font-family: var(--font-caveat);
```

---

## Adding a new page

**1. Create a new folder inside `src/app/`**

The folder name becomes the URL. For a page at `/team`, create `src/app/team/`.

**2. Add a `page.tsx` file inside that folder**

```tsx
// src/app/team/page.tsx
import Eyebrow from "@/components/ui/Eyebrow";

export default function TeamPage() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <Eyebrow center>Our Team</Eyebrow>
          <h1 className="h1">Meet the people behind InfinytTech</h1>
        </div>
      </section>
    </main>
  );
}
```

The nav and footer are added automatically — just write the `<main>` content.

**3. Add it to the nav**

Open `src/components/layout/Nav.tsx` and add your new route to the links list.

---

## Services page

The services page (`src/app/services/page.tsx`) is made up of these sections, top to bottom:

| Section | What it shows |
|---|---|
| Hero | Page heading |
| ServicesSection | The 6 service offering cards |
| What we deliver | 4 outcome cards |
| How We Work | 6 process steps (Discover → Scale) |
| Technologies | Animated scrolling pills of tech names |
| WhyChooseSection | 6 reasons to work with us |
| ConnectCTA | Button linking to the contact page |

### Service detail modal

When a visitor clicks **"Learn more"** on any service card, a modal pops up with more detail about that service. This modal is built inside `ServicesSection.tsx` — it's not a separate file.

Each service in the `SERVICES` array has a `modal` object with these fields:

| Field | What it shows in the modal |
|---|---|
| `rating` | Star rating (e.g. "4.9") |
| `timeline` | How long the project takes (e.g. "4-12 weeks") |
| `startingPrice` | Price starting point (e.g. "From $500") |
| `teamSize` | Team assigned (e.g. "2-4 devs") |
| `simpleTerms` | A plain-English explanation of the service |
| `whatYouGet` | Bullet list of deliverables |
| `perfectFor` | List of who this service is best suited for |

The modal also shows the service's `tags` (technologies used) and a "Contact Us Now" button that takes the user to the contact page.

To close the modal, the user can click the X button, click outside it, or press Escape.

### Editing the 6 service cards

The services are defined in the `SERVICES` array inside `src/components/sections/ServicesSection.tsx`:

```ts
const SERVICES = [
  {
    icon: Icons.code,
    label: "Plan + Build",
    title: "Web Development",
    body: "Short description shown on the card.",
    accent: "#1957DE",
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
    modal: {
      rating: "4.9",
      timeline: "4-12 weeks",
      startingPrice: "From $500",
      teamSize: "2-4 devs",
      simpleTerms: "Plain-English description of the service.",
      whatYouGet: ["Deliverable one", "Deliverable two"],
      perfectFor: ["Who it suits", "Another type of client"],
    },
  },
  // ... 5 more
];
```

To add a service, append a new object following this shape. To edit an existing one, just find it by `title` and update the fields.

### Adding to the tech pills marquee

The animated tech pills are defined in a `TECH` array inside `src/app/services/page.tsx` (not inside `ServicesSection.tsx` — different file):

```ts
const TECH = [
  { name: "Flutter",      color: "#54C5F8", bg: "rgba(84,197,248,0.10)" },
  { name: "React Native", color: "#61DAFB", bg: "rgba(97,218,251,0.10)" },
  // ...
];
```

Add a new entry with the technology name, its brand color, and a lighter version of that color for the background. The pills are split across two rows — the first 6 go in row one, the rest in row two.

---

## Adding a new work card

All the portfolio cards live in `src/components/sections/projects-data.ts` in the `PROJECTS` array.

**1. Add the project image to `public/`**

Drop the image file (PNG or JPG) in the `public/` folder. Something like `public/card10.png`.

**2. Add a new entry to the `PROJECTS` array**

Copy any existing entry and fill in your own details:

```ts
{
  num: "10",
  tagIcon: Icons.rocket,
  category: "Web",           // "Web" | "Mobile" | "Design"
  industry: "SaaS",
  title: "Project Name",
  body: "Short description shown on the card.",
  accent: "#3B82F6",
  accentBg: "rgba(59,130,246,0.12)",
  image: "/card10.png",

  client: "Client Name",
  overview: "Longer description shown in the detail modal.",
  metrics: [
    { label: "Uptime",    value: "99.9%", pct: 100 },
    { label: "Users",     value: "50K+",  pct: 85  },
    { label: "Latency",   value: "120ms", pct: 75  },
  ],
  challenges: [
    { problem: "What the challenge was.", solution: "How you solved it." },
    { problem: "Second challenge.",        solution: "How you solved it." },
  ],
  stack: ["Next.js", "PostgreSQL", "AWS"],
  liveUrl: "https://example.com",   // optional

  stats: [
    { label: "Users",   value: "50K+",  change: "+34%"  },
    { label: "Uptime",  value: "99.9%", change: "+0.5%" },
    { label: "Revenue", value: "$2M+",  change: "+18%"  },
    { label: "Speed",   value: "120ms", change: "−40%"  },
  ],
},
```

The card shows up on both the home page and the `/projects` page automatically.

---

## Building for production

**1. Run the build**

```bash
npm run build
```

This compiles the app and checks TypeScript types. If there are type errors, the build will stop and tell you what to fix. Note: `npm run build` does not run ESLint — run `npm run lint` separately for that.

**2. Preview the production build locally**

```bash
npm run start
```

This runs the compiled site on [http://localhost:3000](http://localhost:3000). It's a good idea to check this before deploying.

---

## Before you push — commit everything

Run `git status` first. If you see a lot of untracked files (images in `public/`, page files, components), those files don't exist on GitHub yet and Vercel won't have them either. Commit them all before pushing:

```bash
git add .
git commit -m "add project files"
git push origin main
```

---

## Deploying to Vercel

This project hasn't been deployed yet. Here's how to do it for the first time.

**1. Make sure your code is pushed to GitHub**

Follow the steps in the "Before you push" section above, then come back here.

**2. Create a Vercel account and import the project**

1. Go to [vercel.com](https://vercel.com) and sign up or sign in
2. Click **Add New Project**
3. Connect your GitHub account if you haven't already
4. Find and select the repository
5. Before hitting Deploy, check the **Root Directory** setting:
   - If `package.json` is at the root of the repo, leave it as `./`
   - If the project lives inside a subfolder (e.g. `infinyttech/`), set it to `infinyttech`
6. Leave everything else as default — Vercel detects Next.js on its own
7. Hit **Deploy**

Vercel will build and publish the site. It gives you a live URL straight away (something like `your-project.vercel.app`).

From this point on, every push to `main` triggers a new deployment automatically.

**3. Add a custom domain (optional)**

In your Vercel project dashboard, go to **Settings → Domains**, type your domain name, and follow the DNS instructions.

---

## Environment variables

If you ever need to add an API key or a backend URL, create a `.env.local` file in the root of the project:

```
NEXT_PUBLIC_API_URL=https://api.example.com
```

Variables that start with `NEXT_PUBLIC_` are available in the browser. The rest are server-side only. Don't commit this file to git.

---

## npm scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build locally |
| `npm run lint` | Check for linting errors |

---

## Things to watch out for

**Tailwind v4 is not the same as v3**

Don't use `@tailwind base`, `@tailwind components`, or `@tailwind utilities` — those are v3 and will break things. The correct import is just:

```css
@import 'tailwindcss';
```

There's also no `tailwind.config.ts` here. All customization goes in `globals.css`.

**Client components need `"use client"` at the top**

If you're writing a component that uses `useState`, `useEffect`, or any browser API, add this as the very first line:

```tsx
"use client";
```

Without it, Next.js assumes it's a server component and will throw an error.

**Referencing images from `public/`**

Always use a leading `/` when pointing to files in the `public/` folder:

```tsx
<img src="/card1.png" alt="..." />
```

Or better, use the built-in `next/image` component which handles lazy loading and optimization automatically:

```tsx
import Image from "next/image";

<Image src="/card1.png" alt="..." width={800} height={600} />
```

**Path alias**

`@/` is a shortcut that points to `src/`. So instead of writing:

```ts
import Nav from "../../components/layout/Nav";
```

You can write:

```ts
import Nav from "@/components/layout/Nav";
```

---

## Implementation Summary

Here's a quick overview of how this project was put together, so you know what decisions were made and why.

1. **Set up Next.js with TypeScript** — App Router was chosen so each page is just a folder with a `page.tsx` file. No manual routing needed.

2. **Created a shared layout** — `src/app/layout.tsx` wraps every page with the Nav and Footer automatically, so you never need to add them page by page.

3. **Built reusable UI components** — `Button.tsx` and `Eyebrow.tsx` were created so the same styles don't get copy-pasted across pages.

4. **Built the six pages** — each in its own folder inside `src/app/`:
   - Home (`/`)
   - Services (`/services`)
   - Work (`/projects`)
   - About (`/about`)
   - Blog (`/blog`)
   - Contact (`/contact`)

5. **Put all work card data in one place** — `src/components/sections/projects-data.ts` holds every portfolio card. Both the home page preview and the full work page read from the same file.

6. **Put all styles in one CSS file** — `src/app/globals.css` holds every design token, layout class, button style, card style, and page-specific style. There is no separate CSS file per component.

7. **Added images to `public/`** — all images (cards, testimonials, logos) live here and are referenced with a leading `/`.

8. **Used Framer Motion for animations** — scroll-triggered and hover animations on cards and sections.

9. **Used Lucide React for icons** — all icons are imported once in `src/components/icons/Icons.tsx` and re-exported from there.

10. **Tested locally with `npm run dev`** before any deployment.

---

## Design System

All the visual decisions — colors, fonts, spacing, shadows — are written as CSS variables at the top of `src/app/globals.css`. The rule is simple: if a value is already a variable, use it. Don't write a raw hex or pixel value in a component file.

### Colors

The palette uses a blue brand color, a dark navy for text and buttons, and a warm off-white background. Here's what's defined:

| Token | Value | What it's for |
|---|---|---|
| `--brand-500` | `#1957DE` | Main blue — buttons, accents, links |
| `--brand-600` | `#1D4ED8` | Darker blue — hover states |
| `--brand-400` | `#60A5FA` | Lighter blue — subtle highlights |
| `--navy-900` | `#0A1B2E` | Primary dark — headings and dark buttons |
| `--navy-800` | `#15263B` | Secondary dark — nav and footer backgrounds |
| `--gray-700` | `#3A4A5C` | Body text |
| `--gray-500` | `#6B7A8C` | Muted text — subtitles, captions |
| `--gray-300` | `#C9D2DC` | Borders and dividers |
| `--gray-200` | `#E2E8EE` | Light borders |
| `--gray-100` | `#EEF2F6` | Subtle section backgrounds |
| `--bg` | `#FAF8F4` | Page background (warm off-white) |
| `--white` | `#FFFFFF` | Cards and panels |

If you need a color that isn't here, add it as a variable at the top of `globals.css`. Don't drop a raw hex directly into a component.

### Text classes

Rather than setting `font-size` and `font-weight` manually everywhere, these shared classes are already defined in `globals.css`:

- `.h1` — big hero heading, 56px, weight 800
- `.h2` — section heading, scales with viewport (28px → 40px), weight 700
- `.lead` — intro paragraph text, 18px, muted gray
- `.eyebrow` — small uppercase label above headings, 13px, brand blue
- `.accent` — wraps any inline text you want to color blue

### Layout

Page content is kept within a max-width container:

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
```

Sections use one of two spacing options:

```css
.section         { padding: 96px 0; }   /* standard */
.section.compact { padding: 64px 0; }   /* tighter, between two tall sections */
```

### Buttons

Use the `Button` component rather than writing `<button>` elements directly. It handles variants, arrow icons, and whether to render a link or a button automatically.

```tsx
import Button from "@/components/ui/Button";

// Dark button that links to a page
<Button href="/contact" variant="primary">Get in touch</Button>

// White outlined button
<Button href="/projects" variant="secondary">See our work</Button>

// Blue button, no arrow
<Button href="/services" variant="teal" arrow="none">Our services</Button>
```

Available variants: `primary`, `secondary`, `teal`, `submit`, `outline`
Available arrows: `right` (→), `diag` (↗), `none`

If you need to change how a button looks — padding, hover color, border radius — edit the `.btn` rules in `globals.css`, not `Button.tsx`. The component itself just applies class names.

### Cards and shadows

Cards across the site are kept consistent. When building a new card, use these values:

- Border radius: 18px – 24px
- Padding: 24px – 28px
- Border: `1px solid rgba(15,23,42,0.08)`
- Hover lift: `translateY(-4px)` with `220ms` transition

For shadows, use the three tokens already defined — don't write new ones:

```css
--shadow-sm  /* subtle, almost invisible lift */
--shadow-md  /* standard card shadow */
--shadow-lg  /* modals and popovers */
```

---

## Key Files — What to Edit and When

| If you want to… | Edit this file |
|---|---|
| Change a color, shadow, or spacing value | `src/app/globals.css` |
| Change the font or add a new font | `src/app/layout.tsx` |
| Change what's in the Nav or Footer | `src/components/layout/Nav.tsx` or `Footer.tsx` |
| Add or edit a work portfolio card | `src/components/sections/projects-data.ts` |
| Add or edit a service offering | `src/components/sections/ServicesSection.tsx` |
| Change button styles | `src/app/globals.css` (Buttons section) |
| Add a new page | Create `src/app/<page-name>/page.tsx` |
| Add a new image | Drop it in `public/` |
| Change the site title or meta description | `src/app/layout.tsx` |

---

## Collaboration Rules

These are simple rules to avoid overwriting each other's work and breaking things.

**1. Always pull the latest code before you start**

```bash
git pull
```

**2. Create a new branch for every change**

Don't work directly on `main`. Name the branch after what you're doing:

```bash
git checkout -b feature/add-new-service
git checkout -b fix/nav-mobile-menu
git checkout -b update/testimonial-content
```

**3. Be careful with shared files**

Files like `globals.css`, `Nav.tsx`, `Footer.tsx`, and `Button.tsx` affect the whole site. If two people edit the same file at the same time, you get a conflict. Coordinate before touching these.

**4. Use specific class names for new styles**

If you need a style that only applies to one section, name it clearly — don't reuse or modify shared classes like `.btn`, `.container`, `.section`, `.h1`, or `.h2`. Add a new class instead:

```css
/* Good — specific to the new section */
.team-card { ... }

/* Bad — modifies a shared class that affects the whole site */
.btn { padding: 20px; }
```

**5. Check your work before pushing**

```bash
npm run lint     # checks for code errors
npm run build    # makes sure the whole site compiles
```

If either of these fails, fix it before pushing.

**6. Push your branch and open a pull request**

```bash
git push origin feature/add-new-service
```

Then open a pull request on GitHub so someone can review before it goes to `main`.
