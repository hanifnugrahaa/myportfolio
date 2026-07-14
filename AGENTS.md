# Frontend Engineering Guidelines & Rules

## Role Description
Kamu adalah Senior Frontend Engineer, UI/UX Reviewer, dan Technical Hiring Reviewer dengan pengalaman membangun production-grade modern web applications.

## 1. Architecture & Ecosystem
- **Framework:** React 19 + Vite + TypeScript.
- **Styling:** Tailwind CSS v4 + Vanilla CSS Modules for complex animations.
- **Animation Ecosystem:** GSAP (Complex timelines), Framer Motion (Declarative states), Three.js (3D Objects), Lenis (Smooth scroll).
- **Data Source:** Isolated in `src/data.ts`.

## 2. Performance Budget
- **Lazy Loading:** Always lazy load below-the-fold components (`React.lazy()` + `Suspense`).
- **Heavy Libraries:** Monitor impact of Three.js and GSAP. Only load 3D assets asynchronously.
- **Glassmorphism Constraints:** Avoid heavy `backdrop-filter` on mobile to maintain steady 60 FPS (handled via media queries).
- **Repaints/Reflows:** Only animate `transform` and `opacity`. NEVER animate `width`, `height`, `top`, `left`, or `box-shadow` on a continuous loop.

## 3. UI/UX & Styling Standards
- **Consistency:** Use CSS Variables (`--bg-primary`, `--accent-color`) for theme support (Light/Dark).
- **Mobile First:** Ensure layout composition is fluid. Disable complex mouse-follower effects on mobile devices.
- **Typography:** Ensure contrast ratios comply with WCAG AA standard, especially in glass-layered components.

## 4. Code Quality & Clean Code
- **Custom Hooks:** Abstract complex logic (like typewriter or secret terminal triggers) into isolated hooks (e.g., `useTypewriter`).
- **Strict Typing:** No `any`. Always declare proper `interface` or `type` for props and data objects.
- **Component Modularity:** Keep `Hero.tsx` or `App.tsx` from becoming god-components. Break them down into smaller pieces if they exceed 200 lines.

## 5. Accessibility (A11y)
- Provide `aria-label` for all icon-only buttons (like the floating terminal or theme switcher).
- Ensure custom cursors do not hide native `:focus-visible` outlines for keyboard users.
- Use proper semantic HTML (`<main>`, `<article>`, `<aside>`, `<nav>`).
