# 🚀 Hanif Nugraha - Interactive Portfolio

A state-of-the-art, highly interactive personal portfolio built with React 19, Vite, and TypeScript. This project blends a sleek **Cyberpunk / Neo-Tokyo** aesthetic with **Glassmorphism**, featuring complex scroll animations, a hidden administrative dashboard, and real-time CV access tracking.

[![MIT License](https://img.shields.io/github/license/hanifnugrahaa/hanifnugrahaa.github.io?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![GitHub last commit](https://img.shields.io/github/last-commit/hanifnugrahaa/hanifnugrahaa.github.io?style=flat-square)](https://github.com/hanifnugrahaa/hanifnugrahaa.github.io/commits/main)

**Live Deployment:** [**hanifnugrahaa.github.io**](https://hanifnugrahaa.github.io/)

---

## 🌟 Key Features

### 🎨 Premium Cyberpunk UI & UX
- **Immersive Aesthetic:** Minimalist dark mode with glowing accents, glassmorphism, and CRT scanlines.
- **Fluid Animations:** Powered by **GSAP** (ScrollTrigger) and **Framer Motion** for complex staggering, page transitions, and element pinning.
- **Smooth Scrolling:** Integrated **Lenis** for a silky-smooth, native-feeling scroll experience across all devices.
- **Magic UI Components:** Utilizing `RetroGrid`, `Particles`, `BorderBeam`, and a macOS-style floating `Dock` for micro-interactions.

### 🔒 Secret Admin Panel (CMS)
- **Hidden Access:** A protected route (`/admin`) guarded by **Firebase Authentication**.
- **Real-time Database:** Connected to **Firebase Firestore** to manage portfolio projects dynamically without touching the codebase.
- **Base64 Image Compression:** Client-side image compression using `Canvas API` before uploading to Firestore, bypassing the need for Firebase Storage.

### 🕵️‍♂️ CV Access Logs (Guestbook)
- **Security Clearance Gate:** Recruiter tracking system disguised as a cyberpunk terminal. Users are prompted to leave their name/company before downloading the CV.
- **Real-time Monitoring:** Visitor logs are instantly sent to Firestore and displayed on the Admin Dashboard for easy tracking of potential leads.

### ⚡ Dynamic Data & Integrations
- **Auto-detected Tech Icons:** Automatically renders the correct brand icon (via `react-icons`) based on the technology name specified in the project data.
- **Internationalization:** Seamlessly switch between Indonesian and English using `i18next`.

---

## 🛠 Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Core** | React 19, Vite, TypeScript |
| **Styling** | Tailwind CSS v4, Vanilla CSS Modules |
| **Animations** | GSAP, Framer Motion, Lenis, Three.js |
| **Backend as a Service** | Firebase (Auth, Firestore) |
| **UI Library** | Magic UI, Lucide React, react-icons (FA/SI) |
| **Deployment** | GitHub Pages / Vercel |



## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE.md) file for details.
