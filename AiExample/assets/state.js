// assets/state.js
// Zentrale State-Verwaltung

import { save, load, clamp } from './utils.js';
import { seedActivities, FIXED_CATEGORIES } from './data.js';

const SETTINGS_KEY = 'unbored:settings';
const ACTIVITIES_KEY = 'unbored:activities';
const PLAYLIST_KEY = 'unbored:playlist';

export const state = {
    settings: load(SETTINGS_KEY, {
        lang: localStorage.getItem('unbored:lang') || 'de',
        theme: localStorage.getItem('unbored:theme') || 'light',
        selectedCategories: [...FIXED_CATEGORIES],
        sort: 'ratingDesc',
        timeWindow: 0,
        tagsFilter: []
    }),
    activities: load(ACTIVITIES_KEY, seedActivities),
    playlist: load(PLAYLIST_KEY, [])
};

// ---- Aktivitäten ----
export function setWeight(id, rating) {
    const act = state.activities.find(a => a.id === id);
    if (act) {
        act.rating = clamp(parseInt(rating || 0), 1, 5);
        save(ACTIVITIES_KEY, state.activities);
    }
}

// ---- Einstellungen ----
export function toggleCategory(cat) {
    const idx = state.settings.selectedCategories.indexOf(cat);
    if (idx >= 0) {
        state.settings.selectedCategories.splice(idx, 1);
    } else {
        state.settings.selectedCategories.push(cat);
    }
    save(SETTINGS_KEY, state.settings);
}

export function setSort(sort) {
    state.settings.sort = sort;
    save(SETTINGS_KEY, state.settings);
}

export function setTimeWindow(min) {
    state.settings.timeWindow = Math.max(0, parseInt(min || 0));
    save(SETTINGS_KEY, state.settings);
}

export function clearFilters() {
    state.settings.selectedCategories = [...FIXED_CATEGORIES];
    state.settings.tagsFilter = [];
    state.settings.timeWindow = 0;
    save(SETTINGS_KEY, state.settings);
}

// ---- Playlist ----
export function addToPlaylist(id) {
    if (!state.playlist.includes(id)) {
        state.playlist.push(id);
        save(PLAYLIST_KEY, state.playlist);
        // Playlist sofort aktualisieren
        if (typeof window.updatePlaylist === 'function') {
            window.updatePlaylist();
        }
    }
}

export function clearPlaylist() {
    state.playlist = [];
    save(PLAYLIST_KEY, state.playlist);
    // Playlist sofort aktualisieren
    if (typeof window.updatePlaylist === 'function') {
        window.updatePlaylist();
    }
}

// ---- Import / Export ----
export function importData(obj) {
    if (Array.isArray(obj.activities)) state.activities = obj.activities;
    if (obj.settings) Object.assign(state.settings, obj.settings);
    if (Array.isArray(obj.playlist)) state.playlist = obj.playlist;

    save(ACTIVITIES_KEY, state.activities);
    save(SETTINGS_KEY, state.settings);
    save(PLAYLIST_KEY, state.playlist);
}

export function exportData() {
    return JSON.stringify(
        { activities: state.activities, settings: state.settings, playlist: state.playlist },
        null,
        2
    );
}