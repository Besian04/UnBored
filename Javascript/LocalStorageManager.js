// LocalStorageManager: handles persistence, import/export, migrations
class LocalStorageManager {
    activityRepository;

    constructor(activityRepository) {
        this.activityRepository = activityRepository;
        this.storageKey = "unboredState";
        this.legacyKey = "userData";
    }

    // i18n helper
    t(key, vars = {}) {
        return window.LanguageService?.t ? window.LanguageService.t(key, vars) : key;
    }

    // Returns raw JSON string of current app state
    getStoredData() {
        // Für Kompatibilität: liefert raw JSON string des NEUEN states
        return localStorage.getItem(this.storageKey);
    }

    // Internal: get raw state from localStorage
    getStoredStateRaw() {
        return localStorage.getItem(this.storageKey);
    }

    // Parse stored state (safe JSON parse)
    getStoredState() {
        const raw = this.getStoredStateRaw();
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    // Build current state from repository and persist it
    updateLocalStorage() {
        const state = {
            version: 1,
            categories: this.activityRepository.categories || [],
            activities: this.activityRepository.activities || [],
            playlists: this.activityRepository.playlists || [],
            stats: this.activityRepository.stats || { randomClicks: 0, history: [] }
        };

        localStorage.setItem(this.storageKey, JSON.stringify(state, null, 2));
        return this.getStoredData();
    }

    // Check if app data (new or legacy) exists
    checkIfDataAlreadyExistsInLocalStorage() {
        if (localStorage.getItem(this.storageKey)) return true;
        if (localStorage.getItem(this.legacyKey)) return true;
        return false;
    }

    importDataFromLocalStorage() {
        // New format
        const state = this.getStoredState();
        if (state) {
            this.applyStateToRepository(state);
            return;
        }

        // Legacy migration: userData -> unboredState
        const legacyRaw = localStorage.getItem(this.legacyKey);
        if (legacyRaw) {
            try {
                const legacyActivities = JSON.parse(legacyRaw);
                const migrated = {
                    version: 1,
                    categories: [...new Set((legacyActivities || []).map((a) => a.type))].filter(Boolean),
                    activities: Array.isArray(legacyActivities) ? legacyActivities : [],
                    playlists: [],
                };
                localStorage.setItem(this.storageKey, JSON.stringify(migrated, null, 2));
                this.applyStateToRepository(migrated);
                return;
            } catch (e) {
                console.error(this.t("legacy_migration_failed"), e);
            }
        }
    }

    // Apply persisted state to repository (incl. defaults)
    applyStateToRepository(state) {
        this.activityRepository.categories = Array.isArray(state.categories) ? state.categories : [];
        this.activityRepository.activities = Array.isArray(state.activities) ? state.activities : [];
        this.activityRepository.playlists = Array.isArray(state.playlists) ? state.playlists : [];
        this.activityRepository.stats = state.stats || { randomClicks: 0, history: [] };
        if (!Array.isArray(this.activityRepository.stats.history)) this.activityRepository.stats.history = [];

        /*const must = ["movie", "game", "outdoor", "lofi-music"];
        for (const m of must) {
            if (!this.activityRepository.categories.includes(m)) {
                this.activityRepository.categories.push(m);
            }
        }*/

        for (const a of this.activityRepository.activities || []) {
            if (a?.type && !this.activityRepository.categories.includes(a.type)) {
                this.activityRepository.categories.push(a.type);
            }
        }
    }

    importStandardData() {
        // Demo / default data (i18n based)
        const state = {
            version: 1,
            categories: ["movie", "game", "outdoor", "lofi", "reading", "cooking", "exercise", "creative", "social", "relaxation",
                "music", "art", "writing", "travel"
            ],
            stats: { randomClicks: 0, history: [] },
            activities: [
                {
                    id: "a1",
                    type: "movie",
                    nameKey: "sample_movie_name",
                    descKey: "sample_movie_desc",
                    duration: 120,
                    rating: 4,
                    link: "",
                    image: "",
                },
                {
                    id: "a2",
                    type: "game",
                    nameKey: "sample_game_name",
                    descKey: "sample_game_desc",
                    duration: 90,
                    rating: 3,
                    link: "",
                    image: "",
                },
                {
                    id: "a3",
                    type: "outdoor",
                    nameKey: "sample_outdoor_name",
                    descKey: "sample_outdoor_desc",
                    duration: 180,
                    rating: 5,
                    link: "",
                    image: "",
                },
                {
                    id: "a4",
                    type: "lofi",
                    nameKey: "sample_lofi_music_name",
                    descKey: "sample_lofi_music_desc",
                    duration: 120,
                    rating: 4,
                    link: "",
                    image: "",
                },
                {
                    id: "a5",
                    type: "reading",
                    nameKey: "sample_reading_name",
                    descKey: "sample_reading_desc",
                    duration: 60,
                    rating: 4,
                    link: "",
                    image: "",
                },
                {
                    id: "a6",
                    type: "cooking",
                    nameKey: "sample_cooking_name",
                    descKey: "sample_cooking_desc",
                    duration: 90,
                    rating: 3,
                    link: "",
                    image: "",
                },
                {
                    id: "a7",
                    type: "exercise",
                    nameKey: "sample_exercise_name",
                    descKey: "sample_exercise_desc",
                    duration: 45,
                    rating: 5,
                    link: "",
                    image: "",
                },
                {
                    id: "a8",
                    type: "creative",
                    nameKey: "sample_creative_name",
                    descKey: "sample_creative_desc",
                    duration: 120,
                    rating: 4,
                    link: "",
                    image: "",
                },
                {
                    id: "a9",
                    type: "social",
                    nameKey: "sample_social_name",
                    descKey: "sample_social_desc",
                    duration: 150,
                    rating: 5,
                    link: "",
                    image: "",
                },
                {
                    id: "a10",
                    type: "relaxation",
                    nameKey: "sample_relaxation_name",
                    descKey: "sample_relaxation_desc",
                    duration: 60,
                    rating: 4,
                    link: "",
                    image: "",
                },
                {
                    id: "a11",
                    type: "music",
                    nameKey: "sample_music_name",
                    descKey: "sample_music_desc",
                    duration: 90,
                    rating: 4,
                    link: "",
                    image: "",
                },
                {
                    id: "a12",
                    type: "art",
                    nameKey: "sample_art_name",
                    descKey: "sample_art_desc",
                    duration: 120,
                    rating: 5,
                    link: "",
                    image: "",
                },
                {
                    id: "a13",
                    type: "writing",
                    nameKey: "sample_writing_name",
                    descKey: "sample_writing_desc",
                    duration: 120,
                    rating: 4,
                    link: "",
                    image: "",
                },
                {
                    id: "a14",
                    type: "travel",
                    nameKey: "sample_travel_name",
                    descKey: "sample_travel_desc",
                    duration: 240,
                    rating: 5,
                    link: "",
                    image: "",
                },

                    // Movie
                    {
                    id: "a15",
                    type: "movie",
                    nameKey: "movie_night_name",
                    descKey: "movie_night_desc",
                    duration: 120,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a16",
                    type: "movie",
                    nameKey: "classic_movie_name",
                    descKey: "classic_movie_desc",
                    duration: 130,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a17",
                    type: "movie",
                    nameKey: "short_films_name",
                    descKey: "short_films_desc",
                    duration: 60,
                    rating: 3,
                    link: "",
                    image: "",
                    },

                    //Game
                    {
                    id: "a18",
                    type: "game",
                    nameKey: "board_game_name",
                    descKey: "board_game_desc",
                    duration: 90,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a19",
                    type: "game",
                    nameKey: "video_game_name",
                    descKey: "video_game_desc",
                    duration: 120,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a20",
                    type: "game",
                    nameKey: "puzzle_game_name",
                    descKey: "puzzle_game_desc",
                    duration: 45,
                    rating: 3,
                    link: "",
                    image: "",
                    },

                    //Outdoor
                    {
                    id: "a21",
                    type: "outdoor",
                    nameKey: "nature_walk_name",
                    descKey: "nature_walk_desc",
                    duration: 60,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a22",
                    type: "outdoor",
                    nameKey: "bike_ride_name",
                    descKey: "bike_ride_desc",
                    duration: 90,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a23",
                    type: "outdoor",
                    nameKey: "outdoor_photography_name",
                    descKey: "outdoor_photography_desc",
                    duration: 75,
                    rating: 3,
                    link: "",
                    image: "",
                    },

                    //Lofi
                    {
                    id: "a24",
                    type: "lofi",
                    nameKey: "lofi_study_name",
                    descKey: "lofi_study_desc",
                    duration: 120,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a25",
                    type: "lofi",
                    nameKey: "relax_music_name",
                    descKey: "relax_music_desc",
                    duration: 60,
                    rating: 3,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a26",
                    type: "lofi",
                    nameKey: "night_lofi_name",
                    descKey: "night_lofi_desc",
                    duration: 90,
                    rating: 4,
                    link: "",
                    image: "",
                    },

                    //Reading
                    {
                    id: "a27",
                    type: "reading",
                    nameKey: "reading_chapter_name",
                    descKey: "reading_chapter_desc",
                    duration: 45,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a28",
                    type: "reading",
                    nameKey: "article_reading_name",
                    descKey: "article_reading_desc",
                    duration: 30,
                    rating: 3,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a29",
                    type: "reading",
                    nameKey: "magazine_reading_name",
                    descKey: "magazine_reading_desc",
                    duration: 40,
                    rating: 3,
                    link: "",
                    image: "",
                    },

                    //Cooking
                    {
                    id: "a30",
                    type: "cooking",
                    nameKey: "simple_cooking_name",
                    descKey: "simple_cooking_desc",
                    duration: 60,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a31",
                    type: "cooking",
                    nameKey: "new_recipe_name",
                    descKey: "new_recipe_desc",
                    duration: 90,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a32",
                    type: "cooking",
                    nameKey: "baking_name",
                    descKey: "baking_desc",
                    duration: 120,
                    rating: 5,
                    link: "",
                    image: "",
                    },

                    //Exercise
                    {
                    id: "a33",
                    type: "exercise",
                    nameKey: "quick_workout_name",
                    descKey: "quick_workout_desc",
                    duration: 30,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a34",
                    type: "exercise",
                    nameKey: "stretching_name",
                    descKey: "stretching_desc",
                    duration: 20,
                    rating: 3,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a35",
                    type: "exercise",
                    nameKey: "home_training_name",
                    descKey: "home_training_desc",
                    duration: 45,
                    rating: 4,
                    link: "",
                    image: "",
                    },

                    //Creative
                    {
                    id: "a36",
                    type: "creative",
                    nameKey: "drawing_name",
                    descKey: "drawing_desc",
                    duration: 60,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a37",
                    type: "creative",
                    nameKey: "diy_project_name",
                    descKey: "diy_project_desc",
                    duration: 90,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a38",
                    type: "creative",
                    nameKey: "crafting_name",
                    descKey: "crafting_desc",
                    duration: 75,
                    rating: 3,
                    link: "",
                    image: "",
                    },

                    //Social
                    {
                    id: "a39",
                    type: "social",
                    nameKey: "meet_friends_name",
                    descKey: "meet_friends_desc",
                    duration: 120,
                    rating: 5,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a40",
                    type: "social",
                    nameKey: "phone_call_name",
                    descKey: "phone_call_desc",
                    duration: 30,
                    rating: 3,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a41",
                    type: "social",
                    nameKey: "game_night_name",
                    descKey: "game_night_desc",
                    duration: 150,
                    rating: 5,
                    link: "",
                    image: "",
                    },

                    //Relaxation
                    {
                    id: "a42",
                    type: "relaxation",
                    nameKey: "meditation_name",
                    descKey: "meditation_desc",
                    duration: 20,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a43",
                    type: "relaxation",
                    nameKey: "breathing_name",
                    descKey: "breathing_desc",
                    duration: 15,
                    rating: 3,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a44",
                    type: "relaxation",
                    nameKey: "quiet_time_name",
                    descKey: "quiet_time_desc",
                    duration: 30,
                    rating: 4,
                    link: "",
                    image: "",
                    },

                    //Music
                    {
                    id: "a45",
                    type: "music",
                    nameKey: "listen_music_name",
                    descKey: "listen_music_desc",
                    duration: 60,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a46",
                    type: "music",
                    nameKey: "discover_music_name",
                    descKey: "discover_music_desc",
                    duration: 90,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a47",
                    type: "music",
                    nameKey: "music_practice_name",
                    descKey: "music_practice_desc",
                    duration: 45,
                    rating: 3,
                    link: "",
                    image: "",
                    },

                    //Art
                    {
                    id: "a48",
                    type: "art",
                    nameKey: "visit_exhibition_name",
                    descKey: "visit_exhibition_desc",
                    duration: 120,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a49",
                    type: "art",
                    nameKey: "art_creation_name",
                    descKey: "art_creation_desc",
                    duration: 90,
                    rating: 5,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a50",
                    type: "art",
                    nameKey: "art_inspiration_name",
                    descKey: "art_inspiration_desc",
                    duration: 60,
                    rating: 3,
                    link: "",
                    image: "",
                    },

                    //Writing
                    {
                    id: "a51",
                    type: "writing",
                    nameKey: "journal_writing_name",
                    descKey: "journal_writing_desc",
                    duration: 30,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a52",
                    type: "writing",
                    nameKey: "short_story_name",
                    descKey: "short_story_desc",
                    duration: 90,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a53",
                    type: "writing",
                    nameKey: "planning_notes_name",
                    descKey: "planning_notes_desc",
                    duration: 20,
                    rating: 3,
                    link: "",
                    image: "",
                    },

                    //Travel
                    {
                    id: "a54",
                    type: "travel",
                    nameKey: "plan_trip_name",
                    descKey: "plan_trip_desc",
                    duration: 60,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a55",
                    type: "travel",
                    nameKey: "explore_destinations_name",
                    descKey: "explore_destinations_desc",
                    duration: 90,
                    rating: 4,
                    link: "",
                    image: "",
                    },
                    {
                    id: "a56",
                    type: "travel",
                    nameKey: "travel_memories_name",
                    descKey: "travel_memories_desc",
                    duration: 45,
                    rating: 3,
                    link: "",
                    image: "",
                    },

            ],
            playlists: [],
        };

        localStorage.setItem(this.storageKey, JSON.stringify(state, null, 2));
        this.applyStateToRepository(state);
    }

    // Export current state as text file
    exportDataAsTextFile() {
        const raw = localStorage.getItem(this.storageKey) || "";
        const blob = new Blob([raw], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;

        // i18n filename (fallback if missing)
        a.download = this.t("export_filename") || "unbored_state.txt";

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    }

    // Import state from text file
    importDataAsTextFile(file) {
        return new Promise((resolve, reject) => {
            if (!file) return reject(new Error(this.t("import_no_file")));

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const parsed = JSON.parse(String(reader.result || ""));

                    if (!parsed || typeof parsed !== "object") throw new Error(this.t("import_invalid_json"));
                    if (
                        !Array.isArray(parsed.categories) ||
                        !Array.isArray(parsed.activities) ||
                        !Array.isArray(parsed.playlists)
                    ) {
                        throw new Error(this.t("import_missing_keys"));
                    }

                    // Persist + apply
                    localStorage.setItem(this.storageKey, JSON.stringify(parsed, null, 2));
                    this.applyStateToRepository(parsed);

                    resolve(true);
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // Reset app data and restore default state
    resetAllData() {
        try {
            // Remove app state only (keep theme/lang)
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.legacyKey);

            // Re-seed default data
            this.importStandardData();

            return { ok: true };
        } catch (e) {
            return { ok: false, error: e };
        }
    }

    deleteStoredData() {}
    overwriteStoredData() {}
    exportDataAsTextFileOld() {}
    importDataAsTextFileOld() {}
}