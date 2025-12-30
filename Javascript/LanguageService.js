window.LanguageService = (() => {
    let currentLang = localStorage.getItem("unboredLang") || "en";

    const translations = {
        en: {
            // header
            search_placeholder: "Find an activity...",

            // sidebar
            nav_dashboard: "Dashboard",
            sidebar_categories: "Categories",
            sidebar_playlists: "Playlists",
            btn_add: "Add",
            no_playlists: "No playlists yet.",

            // local mode box
            local_mode: "Local Mode",
            local_mode_desc: "Your data is saved locally on this device.",
            btn_export: "Export",
            btn_import: "Import",
            export_tip: "Tip: Export saves your full state (activities, categories, playlists) as a text file.",

            // hero
            hero_title_prefix: "Don't just sit there.",
            hero_title_highlight: "Do something.",
            hero_subtitle: "Discover your next hobby, distraction, or adventure in seconds. No sign-up required.",

            // action cards
            instant_pick: "Instant Pick",
            btn_random_title: "Get Random Activity",
            btn_random_desc: "Let fate decide your next adventure immediately.",
            btn_browse_title: "Browse Categories",
            btn_browse_desc: "Explore all",
            btn_open_form_title: "Open Form",
            btn_open_form_desc: "Submit activity",

            // section
            highly_rated_title: "Highly Rated",
            highly_rated_desc: "Your local favorites (based on rating).",

            // modals
            browse_title: "Browse Activities",
            search_title: 'Search: "{q}"',
            sort_label: "Sort",
            order_label: "Order",
            sorting_hint: "Sorting applies to browse, playlists, and search.",
            no_results: "No matching activities found.",
            view_activity: "View Activity",

            // random modal buttons
            random_label: "Random",
            add: "Add",
            reroll: "Reroll",
            delete: "Delete",
            done: "Done",

            // playlist select
            create_playlist_first: "Create a playlist first",
            playlist_empty: "This playlist is empty. Add activities from the Random modal.",
            playlist_prefix: "Playlist: "
        },

        de: {
            // header
            search_placeholder: "Aktivität suchen...",

            // sidebar
            nav_dashboard: "Dashboard",
            sidebar_categories: "Kategorien",
            sidebar_playlists: "Playlists",
            btn_add: "Hinzufügen",
            no_playlists: "Noch keine Playlists.",

            // local mode box
            local_mode: "Lokaler Modus",
            local_mode_desc: "Deine Daten werden lokal auf diesem Gerät gespeichert.",
            btn_export: "Export",
            btn_import: "Import",
            export_tip: "Tipp: Export speichert deinen kompletten Stand (Aktivitäten, Kategorien, Playlists) als Textdatei.",

            // hero
            hero_title_prefix: "Sitz nicht nur rum.",
            hero_title_highlight: "Mach was.",
            hero_subtitle: "Finde dein nächstes Hobby, Ablenkung oder Abenteuer in Sekunden. Keine Anmeldung nötig.",

            // action cards
            instant_pick: "Zufallswahl",
            btn_random_title: "Zufällige Aktivität",
            btn_random_desc: "Lass das Schicksal dein nächstes Abenteuer bestimmen.",
            btn_browse_title: "Kategorien durchsuchen",
            btn_browse_desc: "Alles anzeigen",
            btn_open_form_title: "Formular öffnen",
            btn_open_form_desc: "Aktivität einreichen",

            // section
            highly_rated_title: "Top bewertet",
            highly_rated_desc: "Deine Favoriten (basierend auf Bewertung).",

            // modals
            browse_title: "Aktivitäten durchsuchen",
            search_title: 'Suche: "{q}"',
            sort_label: "Sortieren",
            order_label: "Reihenfolge",
            sorting_hint: "Sortierung gilt für Browse, Playlists und Suche.",
            no_results: "Keine passenden Aktivitäten gefunden.",
            view_activity: "Ansehen",

            // random modal buttons
            random_label: "Zufall",
            add: "Hinzufügen",
            reroll: "Neu ziehen",
            delete: "Löschen",
            done: "Fertig",

            // playlist select
            create_playlist_first: "Bitte erst eine Playlist erstellen",
            playlist_empty: "Diese Playlist ist leer. Füge Aktivitäten über das Zufalls-Modal hinzu.",
            playlist_prefix: "Playlist: "
        }
    };

    function t(key, vars = {}) {
        let str = translations[currentLang]?.[key] || key;
        Object.entries(vars).forEach(([k, v]) => {
            str = str.replace(`{${k}}`, v);
        });
        return str;
    }

    function setLang(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        localStorage.setItem("unboredLang", lang);
        applyTranslations();
    }

    function getLang() {
        return currentLang;
    }

    function applyTranslations() {
        // 1) Texte (innerText)
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            if (!key) return;
            el.textContent = t(key);
        });

        // 2) Placeholder
        document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (!key) return;
            el.setAttribute("placeholder", t(key));
        });

        // 3) Browse/Search Titel (default Browse)
        const browseTitle = document.getElementById("browseTitle");
        if (browseTitle) {
            if (!browseTitle.textContent.includes('"')) {
                browseTitle.textContent = t("browse_title");
            }
        }

        // 4) Language Button Label (EN/DE)
        const btnLang = document.getElementById("btnLang");
        if (btnLang) btnLang.textContent = (currentLang || "en").toUpperCase();
    }

    return { t, setLang, getLang, applyTranslations };
})();