# Personal Portfolio Website

A dynamic and responsive personal portfolio built with React.js and Vite, designed to showcase software development projects and professional skills. This project is a complete migration from a static HTML/CSS/JS implementation to a modern, component-based architecture.

[![MIT License](https://img.shields.io/github/license/hanifnugrahaa/portfolio-react?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![GitHub last commit](https://img.shields.io/github/last-commit/hanifnugrahaa/portfolio-react?style=flat-square)](https://github.com/hanifnugrahaa/portfolio-react/commits/main)

**Live Deployment:** [**MY PORTFOLIO**](https://nugrahax.vercel.app/)

---


## Project Overview

This portfolio serves as a central hub for my work, showcasing projects ranging from web development to IoT systems. The primary technical goal of this project was to refactor a legacy static site into a scalable and maintainable React application. The result is a faster, more interactive user experience with a clean, modern interface.

### Key Features

-   **Component-Based Architecture:** Built with reusable React components for enhanced maintainability.
-   **Dual-Theme Interface:** Light and dark mode support with theme persistence via `localStorage`.
-   **Interactive Project Showcase:** A touch-friendly project slider powered by Swiper.js, supporting both image and video content.
-   **Dynamic Content Rendering:** Skills, projects, and social links are rendered from a centralized data source, making updates efficient.
-   **Scroll-Reveal Animations:** Subtle animations triggered by the Intersection Observer API to enhance visual engagement.

## Technology Stack

-   **Core:** JavaScript (ES6+), React.js, HTML5, CSS3
-   **Tooling:** Vite, NPM
-   **Libraries:** Swiper.js
-   **Deployment:** GitHub Pages

## Deployment

This project is configured for automated deployment to GitHub Pages using the `gh-pages` package. To deploy, run the following command:

```bash
npm run deploy
```
This script builds the application for production and pushes the contents of the `dist` folder to the `gh-pages` branch.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.
