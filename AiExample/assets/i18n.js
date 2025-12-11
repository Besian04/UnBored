// assets/i18n.js
// Simple i18n (Deutsch + Englisch) für Unbored

export const i18n = {
    lng: 'de',
    dict: {
        de: {
            lang_label: 'Deutsch',
            categories: 'Kategorien',
            filters: 'Filter',
            sorting: 'Sortierung',
            time_window: 'Zeitfenster (Minuten)',
            time_window_hint: 'Zeigt Aktivitäten, die in das Zeitfenster passen.',
            random: 'Zufall',
            clear: 'Zurücksetzen',
            playlist: 'Playlist',
            import_export: 'Import/Export',
            activities: 'Aktivitäten',
            empty: 'Keine Ergebnisse. Passen Sie Filter/Kategorie an.',
            random_result: 'Zufallsergebnis',
            reroll: 'Neu würfeln',
            close: 'Schließen',
            add_to_playlist: 'Zur Playlist',
            rating: 'Bewertung',
            duration: 'Dauer',
            category_movies: 'Filme & Serien',
            category_games: 'Spiele',
            category_outdoor: 'Outdoor',
            category_movies_desc: 'Entdecke Filme, Serien und Dokumentationen',
            category_games_desc: 'Videospiele, Brettspiele und mehr',
            category_outdoor_desc: 'Aktivitäten in der Natur und draußen',
            play: 'Abspielen',
            export: 'Export',
            import: 'Import',
            empty_playlist: 'Playlist ist leer',
            confirm_clear_playlist: 'Playlist wirklich löschen?',
            import_success: 'Import erfolgreich!',
            import_failed: 'Import fehlgeschlagen: ',
            welcome_title: 'Langeweile? Wir kümmern und darum',
            welcome_subtitle: 'Wähle eine Kategorie und entdecke spannende Aktivitäten',
            quick_random: 'Überrasche mich!',
            quick_random_hint: 'Eine zufällige Aktivität aus allen Kategorien',
            explore: 'Entdecken',
            all_categories: 'Alle Kategorien anzeigen',
            browsing: 'Aktivitäten durchsuchen',
            players: 'Spieler',
            player_single: 'Person',
            player_multiple: 'Personen',
            description: 'Beschreibung'
        },
        en: {
            lang_label: 'English',
            categories: 'Categories',
            filters: 'Filters',
            sorting: 'Sorting',
            time_window: 'Time window (minutes)',
            time_window_hint: 'Shows activities that fit into the time window.',
            random: 'Random',
            clear: 'Reset',
            playlist: 'Playlist',
            import_export: 'Import/Export',
            activities: 'Activities',
            empty: 'No results. Adjust filters/category.',
            random_result: 'Random Result',
            reroll: 'Reroll',
            close: 'Close',
            add_to_playlist: 'Add to playlist',
            rating: 'Rating',
            duration: 'Duration',
            category_movies: 'Movies & Series',
            category_games: 'Games',
            category_outdoor: 'Outdoor',
            category_movies_desc: 'Discover movies, series and documentaries',
            category_games_desc: 'Video games, board games and more',
            category_outdoor_desc: 'Activities in nature and outdoors',
            play: 'Play',
            export: 'Export',
            import: 'Import',
            empty_playlist: 'Playlist is empty',
            confirm_clear_playlist: 'Really delete playlist?',
            import_success: 'Import successful!',
            import_failed: 'Import failed: ',
            welcome_title: 'Boredom? We\'ll take care of that.',
            welcome_subtitle: 'Choose a category and discover exciting activities',
            quick_random: 'Surprise me!',
            quick_random_hint: 'A random activity from all categories',
            explore: 'Explore',
            all_categories: 'Show all categories',
            browsing: 'Browsing activities',
            players: 'Players',
            player_single: 'person',
            player_multiple: 'people',
            description: 'Description'
        }
    }
};

// Text holen (nach aktueller Sprache)
export function t(key) {
    const d = i18n.dict[i18n.lng] || i18n.dict.de;
    return d[key] ?? key;
}

// Sprache umschalten & UI aktualisieren
export function setLanguage(lng) {
    i18n.lng = lng === 'en' ? 'en' : 'de';
    localStorage.setItem('unbored:lang', i18n.lng);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Aktualisiere Label im Dropdown
    const langLabel = document.querySelector('#langDropdown span[data-i18n="lang_label"]');
    if (langLabel) langLabel.textContent = t('lang_label');
}