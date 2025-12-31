class LocalStorageManager {
    activityRepository;

    constructor(activityRepository) {
        this.activityRepository = activityRepository;
        this.storageKey = "unboredState";
        this.legacyKey = "userData";
    }

    // Helper
    t(key, vars = {}) {
        return window.LanguageService?.t ? window.LanguageService.t(key, vars) : key;
    }

    getStoredData() {
        // Für Kompatibilität: liefert raw JSON string des NEUEN states
        return localStorage.getItem(this.storageKey);
    }

    getStoredStateRaw() {
        return localStorage.getItem(this.storageKey);
    }

    getStoredState() {
        const raw = this.getStoredStateRaw();
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

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

    checkIfDataAlreadyExistsInLocalStorage() {
        if (localStorage.getItem(this.storageKey)) return true;
        if (localStorage.getItem(this.legacyKey)) return true;
        return false;
    }

    importDataFromLocalStorage() {
        // Neues Format
        const state = this.getStoredState();
        if (state) {
            this.applyStateToRepository(state);
            return;
        }

        // Legacy Migration: "userData" -> "unboredState"
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

    applyStateToRepository(state) {
        this.activityRepository.categories = Array.isArray(state.categories) ? state.categories : [];
        this.activityRepository.activities = Array.isArray(state.activities) ? state.activities : [];
        this.activityRepository.playlists = Array.isArray(state.playlists) ? state.playlists : [];
        this.activityRepository.stats = state.stats || { randomClicks: 0, history: [] };
        if (!Array.isArray(this.activityRepository.stats.history)) this.activityRepository.stats.history = [];

        const must = ["movie", "game", "outdoor"];
        for (const m of must) {
            if (!this.activityRepository.categories.includes(m)) {
                this.activityRepository.categories.push(m);
            }
        }

        for (const a of this.activityRepository.activities || []) {
            if (a?.type && !this.activityRepository.categories.includes(a.type)) {
                this.activityRepository.categories.push(a.type);
            }
        }
    }

    importStandardData() {
        // Demo/Default Daten – jetzt i18n
        const state = {
            version: 1,
            categories: ["movie", "game", "outdoor"],
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
            ],
            playlists: [],
        };

        localStorage.setItem(this.storageKey, JSON.stringify(state, null, 2));
        this.applyStateToRepository(state);
    }

    exportDataAsTextFile() {
        const raw = localStorage.getItem(this.storageKey) || "";
        const blob = new Blob([raw], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;

        // Dateiname i18n (falls key fehlt -> fallback)
        a.download = this.t("export_filename") || "unbored_state.txt";

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    }

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

    resetAllData() {
        try {
            // löscht nur den App-State (nicht Theme/Lang)
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.legacyKey);

            // Standarddaten wieder einspielen
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