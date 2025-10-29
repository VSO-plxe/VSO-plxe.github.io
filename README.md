<p align="center">
  <strong>Polski</strong> | 
  <a href="README.en.md">English</a> | 
  <a href="README.de.md">Deutsch</a> | 
  <a href="README.ru.md">Русский</a>
</p>
<hr>

# VSO-plxe — Dynamiczne Portfolio

Witaj w repozytorium mojego osobistego portfolio! To nie jest zwykła statyczna strona HTML. To w pełni dynamiczna, oparta na danych aplikacja webowa (Single Page Application), która automatycznie synchronizuje się z moim profilem GitHub.

### 🔗 **[Zobacz na żywo: VSO-plxe.github.io](https://vso-plxe.github.io)**

---

![Podgląd Strony](./base_mm/textures/demo/VSO-plxe_pageProd_FINAL.png)

---

## 🚀 Funkcjonalności

Ta strona została zbudowana od zera, aby zaprezentować moje projekty w nowoczesny i interaktywny sposób.

* **🌐 Pełna Internacjonalizacja (i18n):**
    * Automatyczne wykrywanie języka przeglądarki (PL, EN, DE, RU).
    * Ręczny przełącznik języków z zapamiętywaniem wyboru w `localStorage`.
    * Wszystkie teksty na stronie ładowane dynamicznie z zewnętrznych plików `.xml`.

* **🤖 Integracja z GitHub API (REST):**
    * **Dynamiczny Profil:** Strona automatycznie pobiera mój avatar, bio oraz liczbę obserwujących i obserwowanych.
    * **Automatyczna Lista Repozytoriów:** Portfolio samo pobiera moje 30 ostatnio aktualizowanych repozytoriów, filtrując forki.

* **🌗 Przełącznik Motywu (Jasny/Ciemny):**
    * Automatyczne wykrywanie preferencji systemowych (`prefers-color-scheme`).
    * Ręczny przełącznik ☀️/🌙, który zapisuje wybór użytkownika.
    * Ikony SVG w stopce dynamicznie zmieniają kolor (z białego na czarny) dzięki filtrom CSS.

* **⚡ Interaktywny Interfejs Użytkownika (UI):**
    * **Wyszukiwarka na Żywo:** Filtruje repozytoria na bieżąco podczas pisania.
    * **Filtry Językowe:** Automatycznie generuje przyciski filtrów na podstawie języków w pobranych repozytoriach (np. "JavaScript", "Python").
    * **Wczytywanie README w Modalu:** Kliknięcie na kartę projektu otwiera okno modalne, które pobiera, parsuje (`marked.js`) i wyświetla plik `README.md` danego repozytorium bez opuszczania strony.

* **✨ Nowoczesny Design i UX:**
    * **"Skeleton Loaders":** Zamiast nudnego tekstu "Ładowanie...", wyświetlane są migoczące szkielety kart, poprawiając odczucie szybkości.
    * **Animacje "Fade-in":** Karty projektów płynnie pojawiają się podczas przewijania strony (`Intersection Observer API`).
    * **Design "Glassmorphism":** Półprzezroczyste, rozmyte tła dla nowoczesnego wyglądu.
    * **Płynne Animowane Tło:** Wielokolorowy, animowany gradient w CSS.
    * Pełna responsywność (RWD) na urządzeniach mobilnych.

---

## 🛠️ Stos Technologiczny

Ten projekt został celowo zbudowany **bez użycia frameworków** (jak React czy Vue), aby pokazać głęboką znajomość fundamentów webowych.

* **Frontend:** Czysty HTML5, CSS i JavaScript (ES6+).
* **Design:**
    * CSS Variables (dla dynamicznych motywów).
    * CSS Flexbox & Grid (dla responsywnego układu).
    * CSS Animations & Transitions.
* **Logika Aplikacji (JavaScript):**
    * **Async/Await** z **Fetch API** do obsługi zapytań do GitHub API i wczytywania plików XML.
    * **DOMParser** do parsowania plików lokalizacyjnych `.xml`.
    * **Intersection Observer API** do animacji przy przewijaniu.
    * **localStorage** do zapamiętywania preferencji użytkownika (język, motyw).
* **Biblioteki Zewnętrzne:**
    * **[Marked.js](https://marked.js.org/):** Do błyskawicznej konwersji Markdown -> HTML w oknie modalnym.
* **Hosting:**
    * **GitHub Pages**

---

## 📄 Licencja

Projekt jest udostępniony na [Licencji MIT](LICENSE).