// assets/ui.js
// UI-Rendering für Unbored

import { state, setWeight, toggleCategory, addToPlaylist } from './state.js';
import { t } from './i18n.js';
import { withinDuration } from './utils.js';

// ---------- Helper Functions ----------
function el(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
}

function titleOf(a) {
    return (a.title && a.title[state.settings.lang]) || a.title?.de || a.title?.en || a.title || '';
}

function descriptionOf(a) {
    const desc = (a.description && a.description[state.settings.lang]) || a.description?.de || a.description?.en || a.description || '';
    return desc || 'Entdecke diese spannende Aktivität!';
}

function sortActivities(list) {
    const sorted = [...list];
    switch (state.settings.sort) {
        case 'alphaAsc': return sorted.sort((a, b) => titleOf(a).localeCompare(titleOf(b)));
        case 'alphaDesc': return sorted.sort((a, b) => titleOf(b).localeCompare(titleOf(a)));
        case 'ratingAsc': return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        case 'ratingDesc': return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        default: return sorted;
    }
}

function getFilteredActivities() {
    let list = state.activities.filter(a => state.settings.selectedCategories.includes(a.category));

    if (state.settings.tagsFilter.length) {
        list = list.filter(a => (a.tags || []).some(t => state.settings.tagsFilter.includes(t)));
    }

    if (state.settings.timeWindow) {
        list = list.filter(a => withinDuration(a, state.settings.timeWindow));
    }

    return sortActivities(list);
}

// ---------- Public API ----------
export function renderAll() {
    renderCategoryChips();
    renderFilters();
    renderActivities();
    updateCount();
}

export function renderActivities() {
    const grid = document.getElementById('activityGrid');
    const empty = document.getElementById('emptyState');
    if (!grid) return;

    grid.innerHTML = '';
    const list = getFilteredActivities();

    if (!list.length) {
        empty?.classList.remove('d-none');
        empty.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-inbox"></i>
                <h5>${t('empty')}</h5>
                <p class="mb-0">Versuche, Filter anzupassen oder mehr Kategorien auszuwählen</p>
            </div>
        `;
        return;
    }
    empty?.classList.add('d-none');

    list.forEach(a => {
        const col = el('div', 'col-12 col-sm-6 col-lg-4');
        const card = el('div', 'card activity h-100');

        // Sternbewertung
        const stars = Array.from({length: 5}, (_, i) =>
            i < (a.rating || 0) ? 'bi-star-fill' : 'bi-star'
        ).map(star => `<i class="bi ${star}"></i>`).join('');

        // Spieler-Anzahl
        let playersBadge = '';
        if (a.players) {
            const playersText = a.players.min === a.players.max
                ? `${a.players.min} ${a.players.min > 1 ? 'Personen' : 'Person'}`
                : `${a.players.min}-${a.players.max} Personen`;
            playersBadge = `<span class="badge badge-players me-1"><i class="bi bi-people me-1"></i>${playersText}</span>`;
        }

        // Tags
        const tagsHtml = (a.tags || []).map(tg =>
            `<span class="badge badge-tag me-1 mb-1">${tg}</span>`
        ).join('');

        // Beschreibung
        const description = descriptionOf(a);

        card.innerHTML = `
            <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="card-title mb-0 fw-bold">${titleOf(a)}</h6>
                    <span class="badge bg-primary">${a.durationMin ? a.durationMin + 'm' : ''}</span>
                </div>
                
                <p class="activity-description mb-3">${description}</p>
                
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>${playersBadge}</div>
                    <div class="star-rating">${stars}</div>
                </div>
                
                <div class="mb-3">${tagsHtml}</div>
                
                <div class="activity-footer mt-auto">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center flex-grow-1 me-3">
                            <label class="form-label small mb-0 me-2">${t('rating')}:</label>
                            <input type="range" min="1" max="5" value="${a.rating || 3}" 
                                   class="form-range flex-grow-1" 
                                   data-activity-id="${a.id}">
                        </div>
                        <button class="btn btn-outline-primary btn-sm" data-activity-id="${a.id}">
                            <i class="bi bi-plus-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Event Listener
        const range = card.querySelector('input[type="range"]');
        range.addEventListener('input', (e) => {
            const newRating = parseInt(e.target.value);
            setWeight(a.id, newRating);

            // Sofortige Aktualisierung der Sterne
            const starContainer = card.querySelector('.star-rating');
            const newStars = Array.from({length: 5}, (_, i) =>
                i < newRating ? 'bi-star-fill' : 'bi-star'
            ).map(star => `<i class="bi ${star}"></i>`).join('');
            starContainer.innerHTML = newStars;
        });

        const addBtn = card.querySelector('button');
        addBtn.addEventListener('click', () => {
            addToPlaylist(a.id);
            addBtn.innerHTML = '<i class="bi bi-check"></i>';
            addBtn.classList.remove('btn-outline-primary');
            addBtn.classList.add('btn-success');
            setTimeout(() => {
                addBtn.innerHTML = '<i class="bi bi-plus-circle"></i>';
                addBtn.classList.remove('btn-success');
                addBtn.classList.add('btn-outline-primary');
            }, 1000);
        });

        col.appendChild(card);
        grid.appendChild(col);
    });
}

export function renderCategoryChips() {
    const cont = document.getElementById('categoryChips');
    if (!cont) return;
    cont.innerHTML = '';

    const cats = [
        { id: 'movies', label: t('category_movies'), icon: 'camera-reels', color: 'category-movies' },
        { id: 'games', label: t('category_games'), icon: 'joystick', color: 'category-games' },
        { id: 'outdoor', label: t('category_outdoor'), icon: 'tree', color: 'category-outdoor' }
    ];

    cats.forEach(c => {
        const active = state.settings.selectedCategories.includes(c.id);
        const chip = el('span', `badge badge-click ${c.color} ${active ? 'active' : ''}`);
        chip.innerHTML = `<i class="bi bi-${c.icon} me-1"></i> ${c.label}`;
        chip.addEventListener('click', () => {
            toggleCategory(c.id);
            renderAll();
        });
        cont.appendChild(chip);
    });
}

export function renderFilters() {
    const cont = document.getElementById('filters');
    if (!cont) return;
    cont.innerHTML = '';

    const tags = new Set();
    state.activities.forEach(a => (a.tags || []).forEach(tg => tags.add(tg)));

    if (tags.size === 0) {
        cont.innerHTML = '<p class="text-muted small">Keine Tags verfügbar</p>';
        return;
    }

    [...tags].sort().forEach(tag => {
        const id = `tag_${tag}`;
        const div = el('div', 'form-check');
        const checked = state.settings.tagsFilter.includes(tag);
        div.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${tag}" id="${id}" ${checked ? 'checked' : ''}>
            <label class="form-check-label small" for="${id}">${tag}</label>
        `;
        div.querySelector('input').addEventListener('change', (e) => {
            const arr = state.settings.tagsFilter;
            const i = arr.indexOf(tag);
            if (e.target.checked && i < 0) arr.push(tag);
            if (!e.target.checked && i >= 0) arr.splice(i, 1);
            localStorage.setItem('unbored:settings', JSON.stringify(state.settings));
            renderActivities();
            updateCount();
        });
        cont.appendChild(div);
    });
}

export function updateCount() {
    const count = document.getElementById('countLabel');
    if (!count) return;
    const list = getFilteredActivities();
    const n = list.length;
    count.textContent = `${n} ${n === 1 ? 'Aktivität' : 'Aktivitäten'}`;
}

export function renderPlaylist() {
    const listEl = document.getElementById('playlistList');
    if (!listEl) return;
    listEl.innerHTML = '';

    if (state.playlist.length === 0) {
        listEl.innerHTML = `
            <div class="text-center text-muted py-3">
                <i class="bi bi-music-note-list display-6 opacity-25"></i>
                <p class="mt-2 mb-0 small">${t('empty_playlist') || 'Playlist ist leer'}</p>
            </div>
        `;
        return;
    }

    state.playlist.forEach((id, idx) => {
        const a = state.activities.find(x => x.id === id);
        if (!a) return;
        const title = titleOf(a);
        const item = document.createElement('div');
        item.className = 'list-group-item playlist-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
            <span class="text-truncate flex-grow-1 me-2">${idx + 1}. ${title}</span>
            <span class="badge bg-primary">${a.durationMin ? a.durationMin + 'm' : ''}</span>
        `;
        listEl.appendChild(item);
    });
}

// Globale Funktion für Playlist Updates
window.updatePlaylist = renderPlaylist;