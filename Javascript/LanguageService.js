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
            browse_categories: "Browse Activities",
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
            type_lofi: "Lofi Music",
            type_writing: "Writing",
            type_reading: "Reading",
            type_cooking: "Cooking",
            type_exercise: "Exercise",
            type_creative: "Creative",
            type_social: "Social",
            type_relaxation: "Relaxation",
            type_music: "Music",
            type_art: "Art",
            type_travel: "Travel",
            
            
            //Movie
            movie_night_name: "Movie Night",
            movie_night_desc: "Watch a movie you’ve never seen before and relax for the evening.",
            classic_movie_name: "Classic Film",
            classic_movie_desc: "Discover a classic movie from a different decade.",
            short_films_name: "Short Film Session",
            short_films_desc: "Watch a collection of short films or mini-documentaries.",
            sample_movie_name: "Sci-Fi Film",
            sample_movie_desc: "A futuristic action and adventure film.",

            //Game
            board_game_name: "Board Game Evening",
            board_game_desc: "Play a board or card game with friends or family.",
            video_game_name: "Video Game Session",
            video_game_desc: "Spend some time playing your favorite video game.",
            puzzle_game_name: "Puzzle Challenge",
            puzzle_game_desc: "Solve puzzles or brain teasers to challenge your mind.",
            sample_game_name: "Game Night",
            sample_game_desc: "Play strategy and party games with friends.",

            //Outdoor
            nature_walk_name: "Nature Walk",
            nature_walk_desc: "Take a walk outside and enjoy fresh air and nature.",
            bike_ride_name: "Bike Ride",
            bike_ride_desc: "Go for a relaxing or energetic bike ride.",
            outdoor_photography_name: "Outdoor Photography",
            outdoor_photography_desc: "Take photos of interesting places or landscapes outside.",
            sample_outdoor_name: "Hiking",
            sample_outdoor_desc: "A beautiful hike through nature.",

            //Lofi-Music
            lofi_study_name: "Lofi Study Session",
            lofi_study_desc: "Listen to calm lofi beats while studying or working.",
            relax_music_name: "Relaxing Music Break",
            relax_music_desc: "Take a short break with relaxing background music.",
            night_lofi_name: "Late Night Lofi",
            night_lofi_desc: "Wind down in the evening with smooth lofi sounds.",
            sample_lofi_music_name: "Lofi Cleaning Session",
            sample_lofi_music_desc: "Clean your space while enjoying lofi music.",

            //Reading
            reading_chapter_name: "Read a Book Chapter",
            reading_chapter_desc: "Read one chapter of a book you enjoy.",
            article_reading_name: "Article Reading",
            article_reading_desc: "Read an interesting article or blog post.",
            magazine_reading_name: "Magazine Time",
            magazine_reading_desc: "Browse through a magazine or digital journal.",
            sample_reading_name: "Reading",
            sample_reading_desc: "Read a chapter of a book you enjoy.",

            //Cooking
            simple_cooking_name: "Cook a Simple Meal",
            simple_cooking_desc: "Prepare a quick and easy meal for yourself.",
            new_recipe_name: "Try a New Recipe",
            new_recipe_desc: "Cook something new you’ve never tried before.",
            baking_name: "Bake Something Sweet",
            baking_desc: "Bake cookies, cake, or another sweet treat.",
            sample_cooking_name: "Cooking",
            sample_cooking_desc: "Cook a simple meal or try a new recipe.",

            //Exercise
            quick_workout_name: "Quick Workout",
            quick_workout_desc: "Do a short workout to get your body moving.",
            stretching_name: "Stretching Session",
            stretching_desc: "Stretch your muscles to relax and improve flexibility.",
            home_training_name: "Home Training",
            home_training_desc: "Train at home using bodyweight exercises.",
            sample_exercise_name: "Exercise",
            sample_exercise_desc: "A short workout to get moving.",

            //Creative
            drawing_name: "Drawing Session",
            drawing_desc: "Draw or sketch whatever comes to your mind.",
            diy_project_name: "DIY Project",
            diy_project_desc: "Create something small using materials you have.",
            crafting_name: "Crafting Time",
            crafting_desc: "Do a creative craft or handmade project.",
            sample_creative_name: "Creative Project",
            sample_creative_desc: "Draw, craft, or build something small.",

            //Social
            meet_friends_name: "Meet Friends",
            meet_friends_desc: "Spend time with friends or family.",
            phone_call_name: "Phone Call",
            phone_call_desc: "Call someone you haven’t talked to in a while.",
            game_night_name: "Game Night",
            game_night_desc: "Organize a small game night with others.",
            sample_social_name: "Meet Friends",
            sample_social_desc: "Spend time with friends or family.",

            //Relaxation
            meditation_name: "Meditation Break",
            meditation_desc: "Take a few minutes to meditate and clear your mind.",
            breathing_name: "Breathing Exercise",
            breathing_desc: "Do a short breathing exercise to relax.",
            quiet_time_name: "Quiet Time",
            quiet_time_desc: "Sit quietly and take a break from screens.",
            sample_relaxation_name: "Relaxation",
            sample_relaxation_desc: "Take a break and unwind.",

            //Music
            listen_music_name: "Listen to Music",
            listen_music_desc: "Listen to your favorite songs or albums.",
            discover_music_name: "Discover New Music",
            discover_music_desc: "Explore new artists or genres.",
            music_practice_name: "Music Practice",
            music_practice_desc: "Practice playing an instrument or singing.",
            sample_music_name: "Music",
            sample_music_desc: "Listen to music or learn a new song.",

            //Art
            visit_exhibition_name: "Visit an Exhibition",
            visit_exhibition_desc: "Visit an art exhibition or gallery (online or offline).",
            art_creation_name: "Art Creation",
            art_creation_desc: "Create your own artwork using any medium.",
            art_inspiration_name: "Art Inspiration",
            art_inspiration_desc: "Look at artworks for inspiration.",
            sample_art_name: "Art",
            sample_art_desc: "Visit an exhibition or make art.",

            //Writing
            journal_writing_name: "Journal Writing",
            journal_writing_desc: "Write down your thoughts or feelings.",
            short_story_name: "Short Story",
            short_story_desc: "Write a short story or creative text.",
            planning_notes_name: "Planning Notes",
            planning_notes_desc: "Write notes to plan your day or week.",
            sample_writing_name: "Writing",
            sample_writing_desc: "Write a short journal entry or story.",

            //Travel
            plan_trip_name: "Plan a Trip",
            plan_trip_desc: "Plan a future trip or weekend getaway.",
            explore_destinations_name: "Explore Destinations",
            explore_destinations_desc: "Research interesting travel destinations.",
            travel_memories_name: "Travel Memories",
            travel_memories_desc: "Look at photos from past trips.",
            sample_travel_name: "Travel Planning",
            sample_travel_desc: "Plan a small trip or explore a new place.",

            filter_min: "Min minutes",
            filter_max: "Max minutes",
            no_match_duration: "No activities match this duration filter.",

            stat_random: "Random picks",
            stat_total: "Total activities",
            stat_avg: "Avg rating",

            history_title: "Recently picked",
            history_empty: "No activity picked yet.",

            delete_btn: "Delete",
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
            browse_categories: "Aktivitäten durchsuchen",
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
            type_lofi: "Lofi Musik",
            type_writing: "Schreiben",
            type_reading: "Lesen",
            type_cooking: "Kochen",
            type_exercise: "Sport",
            type_creative: "Kreativ",
            type_social: "Sozial",
            type_relaxation: "Entspannung",
            type_music: "Musik",
            type_art: "Kunst",
            type_travel: "Reisen",
            

            //Movie
            movie_night_name: "Filmabend",
            movie_night_desc: "Schau einen Film, den du noch nie gesehen hast, und entspanne am Abend.",
            classic_movie_name: "Klassischer Film",
            classic_movie_desc: "Entdecke einen Klassiker aus einer anderen Zeit.",
            short_films_name: "Kurzfilm-Session",
            short_films_desc: "Schau eine Auswahl an Kurzfilmen oder Mini-Dokumentationen.",
            sample_movie_name: "Sci-Fi-Film",
            sample_movie_desc: "Ein futuristischer Action- und Abenteuerfilm.",

            //Game
            board_game_name: "Brettspielabend",
            board_game_desc: "Spiele ein Brett- oder Kartenspiel mit Freunden oder Familie.",
            video_game_name: "Videospiel-Session",
            video_game_desc: "Verbringe etwas Zeit mit deinem Lieblingsvideospiel.",
            puzzle_game_name: "Rätsel-Challenge",
            puzzle_game_desc: "Löse Rätsel oder Denksportaufgaben, um deinen Kopf zu fordern.",
            sample_game_name: "Spieleabend",
            sample_game_desc: "Spiele Strategie- und Partyspiele mit Freunden.",

            //Outdoor
            nature_walk_name: "Spaziergang in der Natur",
            nature_walk_desc: "Geh nach draußen, schnapp frische Luft und genieße die Natur.",
            bike_ride_name: "Radtour",
            bike_ride_desc: "Mach eine entspannte oder sportliche Fahrt mit dem Fahrrad.",
            outdoor_photography_name: "Outdoor-Fotografie",
            outdoor_photography_desc: "Mach Fotos von interessanten Orten oder Landschaften draußen.",
            sample_outdoor_name: "Wanderung",
            sample_outdoor_desc: "Eine schöne Wanderung durch die Natur.",

            //Lofi-Music
            lofi_study_name: "Lofi-Lernsession",
            lofi_study_desc: "Hör ruhige Lofi-Beats beim Lernen oder Arbeiten.",
            relax_music_name: "Entspannende Musikpause",
            relax_music_desc: "Mach eine kurze Pause mit entspannender Hintergrundmusik.",
            night_lofi_name: "Late-Night Lofi",
            night_lofi_desc: "Komm am Abend mit sanften Lofi-Sounds zur Ruhe.",
            sample_lofi_music_name: "Lofi aufräum Session",
            sample_lofi_music_desc: "Räume deinen Platz auf und genieße Lofi-Musik",

            //Reading
            reading_chapter_name: "Ein Buchkapitel lesen",
            reading_chapter_desc: "Lies ein Kapitel aus einem Buch, das dir gefällt.",
            article_reading_name: "Artikel lesen",
            article_reading_desc: "Lies einen interessanten Artikel oder Blogbeitrag.",
            magazine_reading_name: "Magazinzeit",
            magazine_reading_desc: "Blättere durch ein Magazin oder ein digitales Journal.",
            sample_reading_name: "Lesen",
            sample_reading_desc: "Lies ein Kapitel aus einem Buch, das dir gefällt.",

            //Cooking
            simple_cooking_name: "Einfache Mahlzeit kochen",
            simple_cooking_desc: "Bereite dir eine schnelle und einfache Mahlzeit zu.",
            new_recipe_name: "Neues Rezept ausprobieren",
            new_recipe_desc: "Koche etwas Neues, das du noch nie probiert hast.",
            baking_name: "Etwas Süßes backen",
            baking_desc: "Backe Kekse, Kuchen oder eine andere süße Leckerei.",
            sample_cooking_name: "Kochen",
            sample_cooking_desc: "Koche eine einfache Mahlzeit oder probiere ein neues Rezept.",

            //Exercise
            quick_workout_name: "Kurzes Workout",
            quick_workout_desc: "Mach ein kurzes Training, um in Bewegung zu kommen.",
            stretching_name: "Dehn-Session",
            stretching_desc: "Dehne deine Muskeln, um zu entspannen und beweglicher zu werden.",
            home_training_name: "Training zuhause",
            home_training_desc: "Trainiere zuhause mit Übungen mit dem eigenen Körpergewicht.",
            sample_exercise_name: "Sport",
            sample_exercise_desc: "Ein kurzes Workout, um in Bewegung zu kommen.",

            //Creative
            drawing_name: "Zeichnen",
            drawing_desc: "Zeichne oder skizziere, was dir gerade einfällt.",
            diy_project_name: "DIY-Projekt",
            diy_project_desc: "Erstelle etwas Kleines mit Materialien, die du zur Verfügung hast.",
            crafting_name: "Bastelzeit",
            crafting_desc: "Mach ein kreatives Bastel- oder Handarbeitsprojekt.",
            sample_creative_name: "Kreatives Projekt",
            sample_creative_desc: "Zeichne, bastle oder baue etwas Kleines.",

            //Social
            meet_friends_name: "Freunde treffen",
            meet_friends_desc: "Verbringe Zeit mit Freunden oder Familie.",
            phone_call_name: "Telefonat",
            phone_call_desc: "Ruf jemanden an, mit dem du schon lange nicht gesprochen hast.",
            game_night_name: "Spieleabend",
            game_night_desc: "Organisiere einen kleinen Spieleabend mit anderen.",
            sample_social_name: "Freunde treffen",
            sample_social_desc: "Verbringe Zeit mit Freunden oder Familie.",

            //Relaxation
            meditation_name: "Meditationspause",
            meditation_desc: "Nimm dir ein paar Minuten zum Meditieren und Abschalten.",
            breathing_name: "Atemübung",
            breathing_desc: "Mach eine kurze Atemübung, um dich zu entspannen.",
            quiet_time_name: "Ruhezeit",
            quiet_time_desc: "Sitz ruhig da und gönn dir eine Pause von Bildschirmen.",
            sample_relaxation_name: "Entspannung",
            sample_relaxation_desc: "Mach eine Pause und entspanne dich.",

            //Music
            listen_music_name: "Musik hören",
            listen_music_desc: "Hör deine Lieblingssongs oder -alben.",
            discover_music_name: "Neue Musik entdecken",
            discover_music_desc: "Entdecke neue Künstler oder Musikrichtungen.",
            music_practice_name: "Musik üben",
            music_practice_desc: "Übe ein Instrument zu spielen oder zu singen.",
            sample_music_name: "Musik",
            sample_music_desc: "Hör Musik oder lerne einen neuen Song.",

            //Art
            visit_exhibition_name: "Ausstellung besuchen",
            visit_exhibition_desc: "Besuche eine Kunstausstellung oder Galerie (online oder vor Ort).",
            art_creation_name: "Kunst gestalten",
            art_creation_desc: "Erstelle dein eigenes Kunstwerk mit einem Medium deiner Wahl.",
            art_inspiration_name: "Kunst-Inspiration",
            art_inspiration_desc: "Schau dir Kunstwerke an und lass dich inspirieren.",
            sample_art_name: "Kunst",
            sample_art_desc: "Besuche eine Ausstellung oder gestalte Kunst.",

            //Writing
            journal_writing_name: "Tagebuch schreiben",
            journal_writing_desc: "Schreib deine Gedanken oder Gefühle auf.",
            short_story_name: "Kurzgeschichte",
            short_story_desc: "Schreibe eine kurze Geschichte oder einen kreativen Text.",
            planning_notes_name: "Planungsnotizen",
            planning_notes_desc: "Schreibe Notizen, um deinen Tag oder deine Woche zu planen.",
            sample_writing_name: "Schreiben",
            sample_writing_desc: "Schreibe einen kurzen Tagebucheintrag oder eine Geschichte.",

            //Travel
            plan_trip_name: "Reise planen",
            plan_trip_desc: "Plane eine zukünftige Reise oder einen Wochenendausflug.",
            explore_destinations_name: "Reiseziele entdecken",
            explore_destinations_desc: "Recherchiere interessante Reiseziele.",
            travel_memories_name: "Reiseerinnerungen",
            travel_memories_desc: "Schau dir Fotos von vergangenen Reisen an.",
            sample_travel_name: "Reiseplanung",
            sample_travel_desc: "Plane eine kleine Reise oder entdecke einen neuen Ort.",



            filter_min: "Min. Minuten",
            filter_max: "Max. Minuten",
            no_match_duration: "Keine Aktivitäten passen zu diesem Dauer-Filter.",

            stat_random: "Zufalls-Auswahlen",
            stat_total: "Aktivitäten gesamt",
            stat_avg: "Ø Bewertung",

            history_title: "Zuletzt ausgewählt",
            history_empty: "Noch keine Aktivität ausgewählt.",

            delete_btn: "Löschen",
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