# Kaiwal Panchal — Portfolio

Personal engineering portfolio and publication hub for **Kaiwal Panchal**, Forward Deployed & Applied AI Engineer.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **GSAP**, featuring real-time WebGL canvas shaders, Lenis inertia scrolling, and Markdown-powered technical publications.

Hosted natively on **GitHub Pages** via automated GitHub Actions static export.

🌐 **Live Website:** [https://kaiwalpanchal.github.io/MyPage](https://kaiwalpanchal.github.io/MyPage)

---

## ✨ Features & Architecture

* **Editorial Typographic Sculpture:** High-craft layout with TWK Lausanne, Manier, and Instrument Serif typefaces.
* **WebGL Caustic Wave Shader:** Custom GPU canvas shader rendering organic light caustics across the Hero and Footer reveal sections.
* **Lenis Smooth Inertia Scrolling:** Butter-smooth momentum scrolling powered by Lenis v1, synchronized directly with GSAP's ticker (`ScrollTrigger.update`) for zero-jitter scrub animations.
* **Interactive Publications ("My 2 Cents"):** Markdown/Frontmatter article system with syntax-highlighted code blocks, architecture diagrams, and responsive layouts.
* **Design Reference Archive:** Archived interactive reference clone of `kstoimenov.com` preserved at `/archive` (and `/kstoimenov`) with an archive indicator banner.
* **Static Export (`output: 'export'`):** 100% pre-rendered static HTML, CSS, and client-side JavaScript, optimized for fast delivery over GitHub Pages CDN.

---

## 🧭 Routes & Pages

| Route | Description |
|---|---|
| `/` | Main portfolio — Hero, word-by-word About flow, experience stack, article deck, parallax quotes, and footer reveal |
| `/blog` | Technical publications directory |
| `/blog/[slug]` | Full-length engineering deep-dive articles (e.g. AutoCAD COM + LLM extraction, WebGL dynamics) |
| `/archive` | Archived reference clone of `kstoimenov.com` |
| `/kstoimenov` | Legacy alias preserved for the archived clone |

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Static Export)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Smooth Scrolling:** [Lenis](https://github.com/darkroomengineering/lenis)
* **Animation & Interactions:** [GSAP 3](https://greensock.com/gsap/) & [ScrollTrigger](https://greensock.com/scrolltrigger/)
* **Content:** [Gray-Matter](https://github.com/jonschlinkert/gray-matter), [React Markdown](https://github.com/remarkjs/react-markdown), [Remark GFM](https://github.com/remarkjs/remark-gfm), [Rehype Raw](https://github.com/rehypejs/rehype-raw)
* **Deployment & CI/CD:** [GitHub Actions](https://github.com/features/actions) → [GitHub Pages](https://pages.github.com/)

---

## 🚀 Getting Started

### Prerequisites

* Node.js 20+ installed
* npm (or yarn / pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/KaiwalPanchal/MyPage.git

# Navigate into the project directory
cd MyPage

# Install dependencies
npm install
```

### Local Development

```bash
npm run dev
```

Open [http://localhost:3000/MyPage](http://localhost:3000/MyPage) in your browser.

> **Note:** The application uses `basePath: '/MyPage'` in `next.config.mjs` to match the GitHub Pages URL structure. Always access local routes under `/MyPage` (e.g., `http://localhost:3000/MyPage/`).

### Production Build & Static Export

```bash
npm run build
```

This compiles the static export into the `./out` directory, exactly as performed in GitHub Actions.

---

## 🚢 Deployment to GitHub Pages

Deployments are fully automated:
1. Every push to the `main` branch triggers the workflow in [`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml).
2. The runner installs dependencies, runs `next build` to generate the `./out` static folder, and publishes the artifact to GitHub Pages.

---

## 📁 Project Structure

```
MyPage/
├── .github/workflows/nextjs.yml   # GitHub Actions Pages deployment
├── app/
│   ├── archive/                   # Archived reference clone route (/archive)
│   ├── blog/                      # Technical blog index and [slug] pages
│   ├── kstoimenov/                # Alias route to archive
│   ├── mypagedemo/                # Portfolio demo route
│   ├── globals.css                # Global Tailwind v4 styles & Lenis overrides
│   ├── layout.tsx                 # Root layout with Geist font & Lenis provider
│   └── page.tsx                   # Main portfolio entrypoint
├── components/
│   ├── archive/                   # ArchiveNotice floating banner
│   ├── kstoimenov/                # Components for the reference clone
│   ├── mypagedemo/                # Primary portfolio components (Hero, About, etc.)
│   ├── markdown-renderer.tsx      # Markdown parser for blog posts
│   └── SmoothScroll.tsx           # Lenis v1 + GSAP Ticker synchronization
├── content/posts/                 # Markdown publications & case studies
├── data/
│   └── portfolio.ts               # Structured portfolio data (experience, projects, skills)
├── lib/
│   ├── blog.ts                    # Blog post loader & frontmatter parser
│   └── utils.ts                   # Class variance & styling utilities
├── public/                        # Static assets, local typography, and images
├── next.config.mjs                # Next.js static export & basePath config
├── package.json
└── tsconfig.json
```

---

## 📄 License

Open source and available under the [MIT License](LICENSE).
