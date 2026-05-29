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

## Local Development Setup

To clone and run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/hanifnugrahaa/portfolio-react.git](https://github.com/hanifnugrahaa/portfolio-react.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd portfolio-react
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Deployment

This project is configured for automated deployment to GitHub Pages using the `gh-pages` package. To deploy, run the following command:

```bash
npm run deploy
```
This script builds the application for production and pushes the contents of the `dist` folder to the `gh-pages` branch.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.
