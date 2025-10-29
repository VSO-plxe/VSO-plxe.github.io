// --- Skrypt do pobierania danych z GitHub API ---

// ZMIEŃ TĘ NAZWĘ UŻYTKOWNIKA, JEŚLI KIEDYKOLWIEK BĘDZIESZ CHCIAŁ
// --- Ustawienia Globalne ---
const githubUsername = "VSO-plxe";
let currentStrings = {};
let allFetchedRepos = [];
let repoObserver;

// --- Selektory DOM ---
const themeToggle = document.getElementById('theme-toggle');
const searchBar = document.getElementById('search-bar');
const repoContainer = document.getElementById("repo-container");
const filterContainer = document.getElementById('filter-container');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalContent = document.getElementById('modal-content');

// --- Inicjalizacja Aplikacji ---
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    // 1. Zastosuj motyw
    applyInitialTheme();

    // 2. Ustaw nasłuchiwania
    themeToggle.addEventListener('click', toggleTheme);
    searchBar.addEventListener('input', applyFilters); // 'input' jest lepsze niż 'keyup'
    modalOverlay.addEventListener('click', closeModal);
    modalCloseBtn.addEventListener('click', closeModal);

    // 3. Ustaw język i pobierz dane
    const initialLang = getInitialLanguage();
    setupIntersectionObserver();
    setLanguage(initialLang);
}

// --- MOTYW ---

function toggleTheme() {
    const currentTheme = document.body.dataset.theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '☀️' : '🌙';
}

function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.body.dataset.theme = theme;
    themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
}

// --- LOGIKA JĘZYKA (I18N) ---

function getInitialLanguage() {
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['pl', 'en', 'de', 'ru'];
    if (savedLang) return savedLang;
    if (supportedLangs.includes(browserLang)) return browserLang;
    return 'pl';
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    loadLanguage(lang);
}

async function loadLanguage(lang) {
    try {
        const response = await fetch(`./base_mm/locale/${lang}/all_strings.xml`);
        if (!response.ok) throw new Error(`Nie można wczytać pliku językowego: ${response.statusText}`);
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        
        currentStrings = {};
        xmlDoc.querySelectorAll('p').forEach(p => {
            currentStrings[p.id] = p.innerHTML;
        });

        // Po załadowaniu stringów, zaktualizuj UI i pobierz dane
        updateUI();
        
        // Pokaż skeletony PRZED pobraniem danych (NOWE)
        showSkeletonLoaders(6); // Pokaż 6 szkieletów

        await Promise.all([
            fetchUserProfile(),
            fetchGitHubRepos()
        ]);
        
        // Po pobraniu WSZYSTKICH danych, zbuduj filtry i wyrenderuj karty
        populateFilterButtons();
        applyFilters(); // Zastępuje renderRepoCards(allFetchedRepos)

    } catch (error) {
        console.error("Błąd ładowania języka:", error);
        repoContainer.innerHTML = `<p>Błąd ładowania zasobów językowych.</p>`;
    }
}

function updateUI() {
    document.title = document.getElementById('portfolio-title').textContent = currentStrings['portfolio-title'] || 'Portfolio';
    document.getElementById('header-desc').innerHTML = currentStrings['header-desc'];
    document.getElementById('repo-title').innerHTML = currentStrings['repo-title'];
    document.getElementById('footer-text').innerHTML = currentStrings['footer-text'];
    
    // NOWE stringi
    themeToggle.setAttribute('aria-label', currentStrings['toggle-theme-label'] || 'Zmień motyw');
    searchBar.setAttribute('placeholder', currentStrings['search-placeholder'] || 'Szukaj...');
    modalCloseBtn.setAttribute('aria-label', currentStrings['modal-close-label'] || 'Zamknij');
}

// --- LOGIKA POBIERANIA DANYCH z GitHub ---

async function fetchUserProfile() {
    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (!response.ok) throw new Error(`Błąd API profilu: ${response.statusText}`);
        const user = await response.json();
        
        const profileInfo = document.getElementById('profile-info');
        const headerDesc = document.getElementById('header-desc');
        
        profileInfo.innerHTML = `
            <img src="${user.avatar_url}" alt="Avatar" id="profile-avatar">
            <h1 id="profile-name">${user.name || user.login}</h1>
            <div id="profile-stats">
                <span>${user.followers} ${currentStrings['profile-followers'] || 'obserwujących'}</span>
                <span>•</span>
                <span>${user.following} ${currentStrings['profile-following'] || 'obserwowanych'}</span>
            </div>
        `;
        
        if (user.bio) {
            headerDesc.innerHTML = user.bio;
        }

    } catch (error) {
        console.error("Nie udało się pobrać profilu GitHub:", error);
    }
}

async function fetchGitHubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=pushed&direction=desc&per_page=30`);
        if (!response.ok) throw new Error(`Błąd API repozytoriów: ${response.status}`);
        const repos = await response.json();
        allFetchedRepos = repos.filter(repo => !repo.fork);
    } catch (error) {
        console.error("Błąd pobierania danych z API:", error);
        repoContainer.innerHTML = `<p>${currentStrings['fetch-error'] || 'Nie udało się załadować projektów.'}</p>`;
    }
}

// --- NOWA LOGIKA: SKELETON LOADERS ---

function showSkeletonLoaders(count) {
    repoContainer.innerHTML = ''; // Wyczyść
    for (let i = 0; i < count; i++) {
        repoContainer.innerHTML += `
            <div class="skeleton-card">
                <div class="skeleton-line title"></div>
                <div class="skeleton-line text"></div>
                <div class="skeleton-line text-short"></div>
                <div class="skeleton-line footer"></div>
            </div>
        `;
    }
}

// --- LOGIKA FILTROWANIA I RENDEROWANIA ---

function populateFilterButtons() {
    filterContainer.innerHTML = '';
    const languages = [...new Set(allFetchedRepos.map(repo => repo.language).filter(lang => lang))];

    const allButton = createFilterButton(currentStrings['filter-all'] || 'Wszystkie', 'all');
    allButton.classList.add('active');
    filterContainer.appendChild(allButton);

    languages.forEach(lang => {
        filterContainer.appendChild(createFilterButton(lang, lang));
    });
}

function createFilterButton(text, langKey) {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    button.textContent = text;
    button.dataset.lang = langKey;

    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        applyFilters(); // Użyj nowej, centralnej funkcji
    });
    return button;
}

/**
 * NOWA CENTRALNA FUNKCJA FILTRÓW
 * Filtruje repozytoria na podstawie paska wyszukiwania I języka
 */
function applyFilters() {
    const searchTerm = searchBar.value.toLowerCase();
    const activeLangBtn = document.querySelector('.filter-btn.active');
    const langKey = activeLangBtn ? activeLangBtn.dataset.lang : 'all';

    const filteredRepos = allFetchedRepos.filter(repo => {
        const matchesLang = (langKey === 'all' || repo.language === langKey);
        const matchesSearch = (
            repo.name.toLowerCase().includes(searchTerm) ||
            (repo.description && repo.description.toLowerCase().includes(searchTerm))
        );
        return matchesLang && matchesSearch;
    });

    renderRepoCards(filteredRepos);
}

function renderRepoCards(repos) {
    repoContainer.innerHTML = ""; // Wyczyść stare karty / skeletony

    if (repos.length === 0) {
        repoContainer.innerHTML = `<p>${currentStrings['filter-none'] || 'Brak projektów spełniających kryteria.'}</p>`;
        return;
    }

    repos.forEach(repo => {
        const description = repo.description || `<i>${currentStrings['repo-no-desc']}</i>`;
        const language = repo.language || currentStrings['repo-unknown-lang'];

        const card = document.createElement('div');
        card.className = 'repo-card';
        // Zapisz nazwę repo w data-atrybucie, aby łatwo ją odczytać
        card.dataset.repoName = repo.name; 
        
        card.innerHTML = `
            <div>
                <h3><a href="${repo.html_url}" target="_blank" class="repo-link">${repo.name}</a></h3>
                <p>${description}</p>
            </div>
            <div class="repo-footer">
                <span class="repo-lang">${language}</span>
                <span class="repo-stats">
                    <span>⭐ ${repo.stargazers_count}</span>
                </span>
            </div>
        `;

        // NOWY Event Listener dla modala
        card.addEventListener('click', (e) => {
            // Jeśli kliknięty element (lub jego rodzic) to link, nie otwieraj modala
            if (e.target.closest('.repo-link')) {
                return;
            }
            openModal(repo.name);
        });

        repoContainer.appendChild(card);
    });

    observeRepoCards();
}

// --- LOGIKA ANIMACJI (Intersection Observer) ---

function setupIntersectionObserver() {
    const options = { root: null, rootMargin: '0px', threshold: 0.1 };
    repoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, options);
}

function observeRepoCards() {
    const cards = document.querySelectorAll('.repo-card');
    cards.forEach(card => {
        repoObserver.observe(card);
    });
}

// --- NOWA LOGIKA: MODAL (README) ---

function openModal(repoName) {
    modal.classList.remove('hidden');
    modalOverlay.classList.remove('hidden');
    modalContent.innerHTML = `<p>${currentStrings['readme-loading'] || 'Ładowanie README...'}</p>`;

    fetchReadme(repoName);
}

function closeModal() {
    modal.classList.add('hidden');
    modalOverlay.classList.add('hidden');
    modalContent.innerHTML = ''; // Wyczyść zawartość po zamknięciu
}

async function fetchReadme(repoName) {
    try {
        // 1. Pobierz dane o README (base64)
        const response = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/readme`);
        if (!response.ok) {
            throw new Error('README nie znalezione');
        }
        const data = await response.json();
        
        // 2. Dekoduj zawartość z base64 do stringa (Markdown)
        const markdown = new TextDecoder().decode(
            Uint8Array.from(atob(data.content), c => c.charCodeAt(0))
        );
        
        // 3. Użyj biblioteki marked.js do konwersji Markdown na HTML
        const htmlContent = marked.parse(markdown);
        
        // 4. Wstrzyknij gotowy HTML do modala
        modalContent.innerHTML = htmlContent;

    } catch (error) {
        console.error("Błąd ładowania README:", error);
        modalContent.innerHTML = `<p>${currentStrings['readme-error'] || 'Nie udało się wczytać pliku README. Prawdopodobnie nie istnieje w tym repozytorium.'}</p>`;
    }
}