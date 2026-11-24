# 🚀 Hanif Nugraha - Interactive Portfolio

A state-of-the-art, highly interactive personal portfolio built with React 19, Vite, and TypeScript. This project blends a sleek **Neo-Japan** aesthetic with **Glassmorphism**, featuring complex scroll animations, and an administrative dashboard for portfolio content and CV versions.

[![MIT License](https://img.shields.io/github/license/hanifnugrahaa/hanifnugrahaa.github.io?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![GitHub last commit](https://img.shields.io/github/last-commit/hanifnugrahaa/hanifnugrahaa.github.io?style=flat-square)](https://github.com/hanifnugrahaa/hanifnugrahaa.github.io/commits/main)

**Live Deployment:** [**nugrahax.vercel.app**](https://nugrahax.vercel.app/)

---

## 🌟 Key Features

### 🎨 Premium Neo-Japan UI & UX
- **Immersive Aesthetic:** Minimalist dark mode with glowing accents, glassmorphism, and CRT scanlines.
- **Fluid Animations:** Powered by **GSAP** (ScrollTrigger) and **Framer Motion** for complex staggering, page transitions, and element pinning.
- **Smooth Scrolling:** Integrated **Lenis** for a silky-smooth, native-feeling scroll experience across all devices.
- **Magic UI Components:** Utilizing `RetroGrid`, `Particles`, `BorderBeam`, and a macOS-style floating `Dock` for micro-interactions.

### 🔒 Secret Admin Panel (CMS)
- **Hidden Access:** A protected route (`/admin`) guarded by **Firebase Authentication**.
- **Real-time Database:** Connected to **Firebase Firestore** to manage portfolio projects dynamically without touching the codebase.
- **Base64 Image Compression:** Client-side image compression using `Canvas API` before uploading to Firestore, bypassing the need for Firebase Storage.

### CV viewing
- Visitors can open the English CV and Shokumukeirekisho directly from the About section.

### ⚡ Dynamic Data & Integrations
- **Auto-detected Tech Icons:** Automatically renders the correct brand icon (via `react-icons`) based on the technology name specified in the project data.
- **Internationalization:** Seamlessly switch between Indonesian and English using `i18next`.

---

## Managing portfolio posts

Open `/admin` and select **Projects** or **Activities**. Paste a direct public HTTPS URL, select **Foto** or **Video**, and click **Tambah media**. The editor supports up to 10 slides. The first slide is the public cover. Use the arrow buttons to reorder and **Simpan** to publish. Firestore stores the ordered URLs and media types. Use links that open the file itself without login. For video, use a browser-playable file such as MP4 or WebM.

Existing projects still read their original `imageUrl`. The built-in activities have stable `legacy-*` IDs. Editing one stores an override in `activities`, and deleting one stores a marker so it stays hidden across reloads. The public gallery shows activities with media.

### Firebase setup

Merge the following block inside the existing Firestore `match /databases/{database}/documents` block. Replace `YOUR_ADMIN_UID` with the account UID from Firebase Authentication, or use the project's existing admin authorization function. Review overlapping wildcard rules because Firebase permits a request whenever any matching rule allows it. Preserve the existing Projects permissions.

```text
match /activities/{activityId} {
  allow read: if true;
  allow create, update, delete: if request.auth != null
    && request.auth.uid == "YOUR_ADMIN_UID";
}
```

After publishing the rules, verify an admin can save a temporary post and a signed-out visitor can view its slides. Removing a slide or deleting a post removes the reference from Firestore. The media host manages the original files.

### CV versions

In **Admin → CV**, add an English CV or Shokumukeirekisho using a direct public HTTPS link to the PDF. Use **Tampilkan** to select the version visitors see. Select a replacement before deleting an active version. The bundled PDFs are the initial versions.

Use **Buat CV** to open an editable template based on the bundled CV for that language. **Simpan lokal** keeps a draft in this browser. **Simpan versi draft** adds it to the online version catalog. Use **Preview A4 → Cetak / simpan PDF** and choose **Save as PDF** in the browser print dialog. A draft created in the editor becomes public only after **Tampilkan** is selected.

Add or update these matches inside the same Firestore documents block. Use the admin UID from Firebase Authentication. The public document contains only the selected PDF URL or authored CV content. The admin catalog holds the version history. A public PDF URL remains accessible to anyone who has it.

```text
match /cv_catalog/{language} {
  allow get, create, update: if language in ['en', 'ja']
    && request.auth != null && request.auth.uid == "YOUR_ADMIN_UID";
}

match /cv_public/{language} {
  allow get: if language in ['en', 'ja'];
  allow create, update: if language in ['en', 'ja']
    && request.auth != null && request.auth.uid == "YOUR_ADMIN_UID"
    && (
      (request.resource.data.keys().hasOnly(['url']) && request.resource.data.url is string)
      || (request.resource.data.keys().hasOnly(['content']) && request.resource.data.content is string
        && request.resource.data.content.size() <= 65000)
    );
}
```

## 🛠 Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Core** | React 19, Vite, TypeScript |
| **Styling** | Tailwind CSS v4, Vanilla CSS Modules |
| **Animations** | GSAP, Framer Motion, Lenis, Three.js |
| **Backend as a Service** | Firebase (Auth, Firestore) |
| **UI Library** | Magic UI, Lucide React, react-icons (FA/SI) |
| **Deployment** | Vercel |



## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE.md) file for details.
