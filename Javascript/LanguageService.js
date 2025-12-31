// LanguageService: handles i18n (translations + switching)
window.LanguageService = (() => {
    let currentLang = localStorage.getItem("unboredLang") || "en";

    const translations = {
        en: {
            // core texts
            search_title: 'Search: "{q}"',
            browse_title: "Browse Activities",
            sort_label: "Sort",
            order_label: "Order",
            no_results: "No matching activities found.",

            // header + controls
            search_placeholder: "Find an activity...",
            theme_title: "Theme",
            language_title: "Language",

            // sidebar
            nav_dashboard: "Dashboard",
            sidebar_categories: "Categories",
            sidebar_playlists: "Playlists",
            common_add: "Add",

            // local storage info box
            local_mode_title: "Local Mode",
            local_mode_desc: "Your data is saved locally on this device.",
            export_btn: "Export",
            import_btn: "Import",
            reset_btn: "Reset / Clear Data",
            export_tip: "Tip: Export saves your full state (activities, categories, playlists) as a text file.",

            // hero section
            hero_title: "Don't just sit there.",
            hero_title_accent: "Do something.",
            hero_subtitle: "Discover your next hobby, distraction, or adventure in seconds. No sign-up required.",

            // action cards
            instant_pick: "Instant Pick",
            get_random_activity: "Get Random Activity",
            random_subtitle: "Let fate decide your next adventure immediately.",
            browse_categories: "Browse Categories",
            browse_explore_all: "Explore all",
            open_form: "Open Form",
            submit_activity: "Submit activity",

            // lists / sections
            highly_rated: "Highly Rated",
            highly_rated_subtitle: "Your local favorites (based on rating).",

            // random modal
            random_title: "Random",
            add_btn: "Add",
            reroll: "Reroll",
            delete: "Delete",
            done: "Done",

            // browse modal
            sort_rating: "Rating",
            sort_name: "Name",
            sort_type: "Type",
            sort_duration: "Duration",
            order_desc: "Desc",
            order_asc: "Asc",
            sorting_hint: "Sorting applies to browse, playlists, and search.",

            // add activity modal
            add_activity_title: "Add Activity",
            label_name: "Name",
            label_type: "Type",
            label_description: "Description",
            label_time: "Time",
            label_rating: "Rating",
            label_link: "Link",
            label_image_url: "Image URL",
            add_activity_btn: "Add Activity",

            // add category modal
            add_category_title: "Add Category",
            category_name_label: "Category name",
            category_name_placeholder: "e.g. music",
            category_tip: "Tip: Use short lowercase names (movie, game, outdoor, …)",
            add_category_btn: "Add Category",

            // add playlist modal
            create_playlist_title: "Create Playlist",
            playlist_name_label: "Playlist name",
            playlist_name_placeholder: "e.g. Friday Night",
            create_playlist_btn: "Create",

            // dynamic / runtime texts
            no_playlists_yet: "No playlists yet.",
            create_playlist_first: "Create a playlist first",
            playlist_empty: "This playlist is empty. Add activities from the Random modal.",
            view_activity: "View Activity",
            view: "View",
            playlist_prefix: "Playlist: {name}",
            playlist_fallback: "Playlist",

            // alerts + validations
            category_exists: "Category already exists.",
            invalid_category: "Invalid category name.",
            invalid_playlist: "Invalid playlist name.",
            select_playlist_first: "Please create/select a playlist first.",
            no_activity_selected: "No activity selected.",
            could_not_add: "Could not add to playlist.",
            added_to_playlist: "Added to playlist!",
            delete_confirm: 'Delete "{name}"?\nThis will also remove it from all playlists.',

            import_success: "Import successful!",
            import_failed: "Import failed: {msg}",

            reset_confirm: "Reset all data?\nThis will remove activities, categories and playlists.",
            reset_done: "Data cleared. Default activities were restored.",

            unknown: "unknown",
            minutes_short: "min",

            // category/type labels (storage -> display)
            type_movie: "Movie",
            type_game: "Game",
            type_outdoor: "Outdoor",

            sample_movie_name: "Sci-Fi Film",
            sample_movie_desc: "A futuristic action and adventure film.",
            sample_game_name: "Game Night",
            sample_game_desc: "Play strategy and party games with friends.",
            sample_outdoor_name: "Hiking",
            sample_outdoor_desc: "A beautiful hike through nature.",

            filter_min: "Min minutes",
            filter_max: "Max minutes",
            no_match_duration: "No activities match this duration filter.",

            stat_random: "Random picks",
            stat_total: "Total activities",
            stat_avg: "Avg rating",

            history_title: "Recently picked",
            history_empty: "No activity picked yet.",
        },

        de: {
            // core texts
            search_title: 'Suche: "{q}"',
            browse_title: "Aktivitäten durchsuchen",
            sort_label: "Sortieren",
            order_label: "Reihenfolge",
            no_results: "Keine passenden Aktivitäten gefunden.",

            // header + controls
            search_placeholder: "Aktivität suchen...",
            theme_title: "Design",
            language_title: "Sprache",

            // sidebar
            nav_dashboard: "Dashboard",
            sidebar_categories: "Kategorien",
            sidebar_playlists: "Playlists",
            common_add: "Hinzufügen",

            // local storage info box
            local_mode_title: "Lokaler Modus",
            local_mode_desc: "Deine Daten werden lokal auf diesem Gerät gespeichert.",
            export_btn: "Export",
            import_btn: "Import",
            reset_btn: "Zurücksetzen / Daten löschen",
            export_tip: "Tipp: Export speichert deinen kompletten Stand (Aktivitäten, Kategorien, Playlists) als Textdatei.",

            // hero section
            hero_title: "Nicht nur rumsitzen.",
            hero_title_accent: "Mach was.",
            hero_subtitle: "Finde in Sekunden dein nächstes Hobby, eine Ablenkung oder ein kleines Abenteuer – ganz ohne Anmeldung.",

            // action cards
            instant_pick: "Sofort-Auswahl",
            get_random_activity: "Zufällige Aktivität",
            random_subtitle: "Lass das Schicksal sofort entscheiden, was du als Nächstes machst.",
            browse_categories: "Kategorien durchsuchen",
            browse_explore_all: "Alle anzeigen",
            open_form: "Formular öffnen",
            submit_activity: "Aktivität hinzufügen",

            // lists / sections
            highly_rated: "Top bewertet",
            highly_rated_subtitle: "Deine Favoriten (basierend auf Bewertung).",

            // random modal
            random_title: "Zufall",
            add_btn: "Hinzufügen",
            reroll: "Neu ziehen",
            delete: "Löschen",
            done: "Fertig",

            // browse modal
            sort_rating: "Bewertung",
            sort_name: "Name",
            sort_type: "Typ",
            sort_duration: "Dauer",
            order_desc: "Absteigend",
            order_asc: "Aufsteigend",
            sorting_hint: "Sortierung gilt für Durchsuchen, Playlists und Suche.",

            // add activity modal
            add_activity_title: "Aktivität hinzufügen",
            label_name: "Name",
            label_type: "Typ",
            label_description: "Beschreibung",
            label_time: "Zeit",
            label_rating: "Bewertung",
            label_link: "Link",
            label_image_url: "Bild-URL",
            add_activity_btn: "Aktivität hinzufügen",

            // add category modal
            add_category_title: "Kategorie hinzufügen",
            category_name_label: "Kategoriename",
            category_name_placeholder: "z.B. musik",
            category_tip: "Tipp: Kurze Namen in Kleinbuchstaben verwenden (film, spiel, outdoor, …)",
            add_category_btn: "Kategorie hinzufügen",

            // add playlist modal
            create_playlist_title: "Playlist erstellen",
            playlist_name_label: "Playlist-Name",
            playlist_name_placeholder: "z.B. Freitagabend",
            create_playlist_btn: "Erstellen",

            // dynamic / runtime texts
            no_playlists_yet: "Noch keine Playlists.",
            create_playlist_first: "Erstelle zuerst eine Playlist",
            playlist_empty: "Diese Playlist ist leer. Füge Aktivitäten im Zufall-Dialog hinzu.",
            view_activity: "Aktivität ansehen",
            view: "Ansehen",
            playlist_prefix: "Playlist: {name}",
            playlist_fallback: "Playlist",

            // alerts + validations
            category_exists: "Kategorie existiert bereits.",
            invalid_category: "Ungültiger Kategoriename.",
            invalid_playlist: "Ungültiger Playlist-Name.",
            select_playlist_first: "Bitte zuerst eine Playlist erstellen/auswählen.",
            no_activity_selected: "Keine Aktivität ausgewählt.",
            could_not_add: "Konnte nicht zur Playlist hinzufügen.",
            added_to_playlist: "Zur Playlist hinzugefügt!",
            delete_confirm: '„{name}“ löschen?\nDas entfernt die Aktivität auch aus allen Playlists.',

            import_success: "Import erfolgreich!",
            import_failed: "Import fehlgeschlagen: {msg}",

            reset_confirm: "Alle Daten zurücksetzen?\nDas löscht Aktivitäten, Kategorien und Playlists.",
            reset_done: "Daten gelöscht. Standard-Aktivitäten wurden wiederhergestellt.",

            unknown: "unbekannt",
            minutes_short: "Min",

            // category/type labels (storage -> display)
            type_movie: "Film",
            type_game: "Spiel",
            type_outdoor: "Outdoor",

            sample_movie_name: "Sci-Fi Film",
            sample_movie_desc: "Ein futuristischer Action- und Abenteuerfilm.",
            sample_game_name: "Spieleabend",
            sample_game_desc: "Strategie- und Partyspiele mit Freunden spielen.",
            sample_outdoor_name: "Wanderung",
            sample_outdoor_desc: "Eine schöne Wanderung durch die Natur.",

            filter_min: "Min. Minuten",
            filter_max: "Max. Minuten",
            no_match_duration: "Keine Aktivitäten passen zu diesem Dauer-Filter.",

            stat_random: "Zufalls-Auswahlen",
            stat_total: "Aktivitäten gesamt",
            stat_avg: "Ø Bewertung",

            history_title: "Zuletzt ausgewählt",
            history_empty: "Noch keine Aktivität ausgewählt.",
        },
    };

    // Translation helper: key + optional variables
    function t(key, vars = {}) {
        let str = translations[currentLang]?.[key] ?? key;
        for (const [k, v] of Object.entries(vars)) {
            str = str.replaceAll(`{${k}}`, String(v));
        }
        return str;
    }

    // Helper: maps stored type value to translated label
    function typeLabel(typeValue) {
        if (!typeValue) return t("unknown");
        const key = `type_${String(typeValue).toLowerCase()}`;
        const hit = translations[currentLang]?.[key];
        return hit ? hit : String(typeValue);
    }

    function getLang() {
        return currentLang;
    }

    // Switch language and re-apply all translations
    function setLang(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        localStorage.setItem("unboredLang", lang);
        document.documentElement.lang = lang;

        applyTranslations();
    }

    // Apply translations to DOM (text, placeholder, title, aria)
    function applyTranslations(rootEl = document) {
        rootEl.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            if (!key) return;
            el.textContent = t(key);
        });

        rootEl.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (!key) return;
            el.setAttribute("placeholder", t(key));
        });

        rootEl.querySelectorAll("[data-i18n-title]").forEach((el) => {
            const key = el.getAttribute("data-i18n-title");
            if (!key) return;
            el.setAttribute("title", t(key));
        });

        rootEl.querySelectorAll("[data-i18n-aria]").forEach((el) => {
            const key = el.getAttribute("data-i18n-aria");
            if (!key) return;
            el.setAttribute("aria-label", t(key));
        });
    }

    return { t, getLang, setLang, applyTranslations, typeLabel };
})();