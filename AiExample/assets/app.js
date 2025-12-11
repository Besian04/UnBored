// assets/app.js
// Bootstrapping & App-Logik

import { i18n, setLanguage, t } from './i18n.js';
import { state, setSort, setTimeWindow, clearFilters, exportData, importData, clearPlaylist } from './state.js';
import { weightedRandom, download } from './utils.js';
import { renderAll, renderPlaylist, renderActivities, updateCount } from './ui.js';

// -------- Filter Einklapp-Funktion ----------
function initFilterToggle() {
    const toggleBtn = document.getElementById('toggleFilters');
    const filtersCard = document.querySelector('.card.shadow.border-0.mt-4');

    if (toggleBtn && filtersCard) {
        const filtersCollapsed = localStorage.getItem('unbored:filtersCollapsed') === 'true';

        if (filtersCollapsed) {
            filtersCard.classList.add('filters-collapsed');
            toggleBtn.querySelector('i').style.transform = 'rotate(-90deg)';
        }

        toggleBtn.addEventListener('click', () => {
            filtersCard.classList.toggle('filters-collapsed');
            const isCollapsed = filtersCard.classList.contains('filters-collapsed');
            toggleBtn.querySelector('i').style.transform = isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
            localStorage.setItem('unbored:filtersCollapsed', isCollapsed.toString());
        });
    }
}

// -------- Screen Management ----------
let currentModal = null;

function showScreen(screenId) {
    console.log('Showing screen:', screenId);

    // Verstecke alle Screens
    const screens = ['startScreen', 'appScreen'];
    screens.forEach(screen => {
        const element = document.getElementById(screen);
        if (element) {
            element.classList.add('d-none');
        }
    });

    // Zeige gewünschten Screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('d-none');
    }
}

function initScreenNavigation() {
    console.log('Initializing screen navigation...');

    // Home button
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('startScreen');
            updateCategoryCounts();
        });
    }

    // Back to start
    const backBtn = document.getElementById('backToStart');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showScreen('startScreen');
            updateCategoryCounts();
        });
    }

    // Explore category buttons
    const exploreButtons = document.querySelectorAll('.explore-category');
    console.log('Found explore buttons:', exploreButtons.length);

    exploreButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.currentTarget.getAttribute('data-category');
            console.log('Explore category clicked:', category);

            state.settings.selectedCategories = [category];
            localStorage.setItem('unbored:settings', JSON.stringify(state.settings));
            showScreen('appScreen');
            renderAll();
        });
    });

    // All categories button
    const allCategoriesBtn = document.getElementById('allCategoriesBtn');
    if (allCategoriesBtn) {
        allCategoriesBtn.addEventListener('click', () => {
            console.log('All categories button clicked');

            state.settings.selectedCategories = ['movies', 'games', 'outdoor'];
            localStorage.setItem('unbored:settings', JSON.stringify(state.settings));
            showScreen('appScreen');
            renderAll();
        });
    }
}

// -------- Update Category Counts ----------
function updateCategoryCounts() {
    const moviesCount = document.getElementById('moviesCount');
    const gamesCount = document.getElementById('gamesCount');
    const outdoorCount = document.getElementById('outdoorCount');

    if (moviesCount) {
        const count = state.activities.filter(a => a.category === 'movies').length;
        moviesCount.textContent = count;
    }
    if (gamesCount) {
        const count = state.activities.filter(a => a.category === 'games').length;
        gamesCount.textContent = count;
    }
    if (outdoorCount) {
        const count = state.activities.filter(a => a.category === 'outdoor').length;
        outdoorCount.textContent = count;
    }
}

// -------- Quick Random ----------
function initQuickRandom() {
    const quickRandomBtn = document.getElementById('quickRandomBtn');
    if (quickRandomBtn) {
        quickRandomBtn.addEventListener('click', () => {
            console.log('Quick random button clicked');

            const list = state.activities;
            if (list.length === 0) {
                alert(t('empty'));
                return;
            }
            const pick = weightedRandom(list.map(a => ({ item: a, weight: a.rating || 1 })));
            console.log('Random pick:', pick);

            if (pick) openRandomModal(pick);
        });
    }
}

// -------- Theme ----------
function initTheme() {
    const saved = localStorage.getItem('unbored:theme') || state.settings.theme || 'light';
    document.documentElement.setAttribute('data-bs-theme', saved);
    updateThemeIcon(saved);

    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-bs-theme');
            const nxt = cur === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-bs-theme', nxt);
            localStorage.setItem('unbored:theme', nxt);
            updateThemeIcon(nxt);
        });
    }
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
    }
}

// -------- Sprache ----------
function initLang() {
    const saved = state.settings.lang || localStorage.getItem('unbored:lang') || 'de';
    i18n.lng = saved;
    setLanguage(saved);

    document.querySelectorAll('.lang-select').forEach((a) => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const lng = a.getAttribute('data-lang');
            setLanguage(lng);
            state.settings.lang = lng;
            localStorage.setItem('unbored:lang', lng);
            renderAll();
            renderPlaylist();
            updateCategoryCounts();
        });
    });
}

// -------- Random Modal ----------
function openRandomModal(item) {
    console.log('Opening random modal for:', item);

    const body = document.getElementById('randomResultBody');
    if (!body) {
        console.error('Random result body not found!');
        return;
    }

    const title = (item.title && item.title[i18n.lng]) || item.title?.de || item.title?.en || item.title || '';
    const description = (item.description && item.description[i18n.lng]) || item.description?.de || item.description?.en || item.description || '';

    const stars = Array.from({length: 5}, (_, i) =>
        i < (item.rating || 0) ? 'bi-star-fill' : 'bi-star'
    ).map(star => `<i class="bi ${star}"></i>`).join('');

    let playersInfo = '';
    if (item.players) {
        const playersText = item.players.min === item.players.max
            ? `${item.players.min} Person${item.players.min > 1 ? 'en' : ''}`
            : `${item.players.min}-${item.players.max} Personen`;
        playersInfo = `<div class="mb-2"><i class="bi bi-people me-1"></i>${playersText}</div>`;
    }

    body.innerHTML = `
        <div class="d-flex flex-column align-items-center gap-3">
            <div class="display-4 text-primary fw-bold">${title}</div>
            <div class="text-center">
                <p class="fs-5">${description}</p>
            </div>
            <div class="d-flex align-items-center gap-3">
                <div class="star-rating display-6">${stars}</div>
            </div>
            ${playersInfo}
            <div class="fs-5">${item.durationMin ? 'Dauer: ' + item.durationMin + ' Minuten' : ''}</div>
            <div class="mt-2">
                ${(item.tags || []).map(tg => `<span class="badge bg-light text-dark me-1">${tg}</span>`).join('')}
            </div>
        </div>
    `;

    if (currentModal) {
        currentModal.hide();
    }

    const modalElement = document.getElementById('randomModal');
    if (modalElement) {
        currentModal = new bootstrap.Modal(modalElement);
        currentModal.show();
    }
}

// -------- Controls ----------
function initControls() {
    console.log('Initializing controls...');

    // Sortierung
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = state.settings.sort || 'ratingDesc';
        sortSelect.addEventListener('change', (e) => {
            setSort(e.target.value);
            renderActivities();
            updateCount();
        });
    }

    // Zeitfenster
    const dur = document.getElementById('durationInput');
    if (dur) {
        dur.value = state.settings.timeWindow || '';
        dur.addEventListener('input', (e) => {
            setTimeWindow(e.target.value);
            renderActivities();
            updateCount();
        });
    }

    // Filter zurücksetzen
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            clearFilters();
            if (dur) dur.value = '';
            if (sortSelect) sortSelect.value = 'ratingDesc';
            renderAll();
        });
    }

    // Zufall
    const randomBtn = document.getElementById('randomBtn');
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            const list = state.activities.filter(a => state.settings.selectedCategories.includes(a.category));
            if (list.length === 0) {
                alert(t('empty'));
                return;
            }
            const pick = weightedRandom(list.map(a => ({ item: a, weight: a.rating || 1 })));
            if (pick) openRandomModal(pick);
        });
    }

    // Reroll im Modal
    const reroll = document.getElementById('randomReroll');
    if (reroll) {
        reroll.addEventListener('click', () => {
            const list = state.activities.filter(a => state.settings.selectedCategories.includes(a.category));
            const pick = weightedRandom(list.map(a => ({ item: a, weight: a.rating || 1 })));
            if (pick) openRandomModal(pick);
        });
    }

    // Playlist
    const clearPl = document.getElementById('playlistClear');
    if (clearPl) {
        clearPl.addEventListener('click', () => {
            if (confirm('Playlist wirklich löschen?')) {
                clearPlaylist();
                renderPlaylist();
            }
        });
    }

    const playPl = document.getElementById('playlistPlay');
    if (playPl) {
        playPl.addEventListener('click', () => {
            const acts = state.playlist.map(id => state.activities.find(a => a.id === id)).filter(Boolean);
            if (!acts.length) {
                alert('Playlist ist leer');
                return;
            }
            const pick = weightedRandom(acts.map(a => ({ item: a, weight: a.rating || 1 })));
            if (pick) openRandomModal(pick);
        });
    }

    // Import / Export
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => download('unbored-export.json', exportData()));
    }

    const importFile = document.getElementById('importFile');
    if (importFile) {
        importFile.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const obj = JSON.parse(reader.result);
                    importData(obj);
                    renderAll();
                    renderPlaylist();
                    updateCategoryCounts();
                    alert('Import erfolgreich!');
                } catch (err) {
                    alert('Import fehlgeschlagen: ' + err);
                }
            };
            reader.readAsText(file);
        });
    }
}

// -------- Boot ----------
function boot() {
    console.log('=== UNBORED APP STARTING ===');

    try {
        initTheme();
        initLang();
        initScreenNavigation();
        initQuickRandom();
        initFilterToggle();
        initControls();
        updateCategoryCounts();
        renderAll();
        renderPlaylist();
        showScreen('startScreen');

        console.log('=== UNBORED APP STARTED SUCCESSFULLY ===');
    } catch (error) {
        console.error('=== UNBORED APP FAILED TO START ===', error);
        showScreen('startScreen');
    }
}

// Starte die App
document.addEventListener('DOMContentLoaded', boot);