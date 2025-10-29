<p align="center">
  <a href="README.md">Polski</a> | 
  <strong>English</strong> | 
  <a href="README.de.md">Deutsch</a> | 
  <a href="README.ru.md">Русский</a>
</p>
<hr>

# VSO-plxe — Dynamic Portfolio

Welcome to my personal portfolio repository! This isn't just a simple static HTML page. It's a fully dynamic, data-driven Single Page Application that automatically syncs with my GitHub profile.

### 🔗 **[See it live: VSO-plxe.github.io](https://vso-plxe.github.io)**

---

![Page Preview](./base_mm/textures/demo/VSO-plxe_pageProd_FINAL.png)

---

## 🚀 Features

This site was built from scratch to showcase my projects in a modern and interactive way.

* **🌐 Full Internationalization (i18n):**
    * Automatic browser language detection (PL, EN, DE, RU).
    * Manual language switcher that saves the choice in `localStorage`.
    * All text on the page is loaded dynamically from external `.xml` files.

* **🤖 GitHub API Integration (REST):**
    * **Dynamic Profile:** The page automatically fetches my avatar, bio, and follower/following counts.
    * **Automatic Repo List:** The portfolio fetches my 30 most recently updated repositories, filtering out forks.

* **🌗 Light/Dark Theme Toggle:**
    * Automatic detection of system preferences (`prefers-color-scheme`).
    * Manual ☀️/🌙 toggle that saves the user's choice.
    * SVG icons in the footer dynamically change color (from white to black) using CSS filters.

* **⚡ Interactive User Interface (UI):**
    * **Live Search Bar:** Filters repositories in real-time as you type.
    * **Language Filters:** Automatically generates filter buttons based on the languages found in the fetched repos (e.g., "JavaScript", "Python").
    * **README Loading in Modal:** Clicking a project card opens a modal, which fetches, parses (`marked.js`), and displays the `README.md` file from that repository without leaving the page.

* **✨ Modern Design and UX:**
    * **"Skeleton Loaders":** Instead of a boring "Loading..." text, shimmering card skeletons are displayed, improving perceived performance.
    * **Fade-in Animations:** Project cards smoothly fade in on scroll using the `Intersection Observer API`.
    * **"Glassmorphism" Design:** Semi-transparent, blurred backgrounds for a modern look.
    * **Liquid Animated Background:** A multi-color, animated gradient in CSS.
    * Full responsiveness (RWD) on mobile devices.

---

## 🛠️ Tech Stack

This project was intentionally built **without frameworks** (like React or Vue) to demonstrate a deep understanding of web fundamentals.

* **Frontend:** Vanilla HTML5, CSS3, and JavaScript (ES6+).
* **Design:**
    * CSS Variables (for dynamic themes).
    * CSS Flexbox & Grid (for responsive layout).
    * CSS Animations & Transitions.
* **Application Logic (JavaScript):**
    * **Async/Await** with **Fetch API** to handle GitHub API requests and load XML files.
    * **DOMParser** to parse localization `.xml` files.
    * **Intersection Observer API** for scroll animations.
    * **localStorage** to remember user preferences (language, theme).
* **External Libraries:**
    * **[Marked.js](https://marked.js.org/):** For instant Markdown -> HTML conversion in the modal.
* **Hosting:**
    * **GitHub Pages**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).