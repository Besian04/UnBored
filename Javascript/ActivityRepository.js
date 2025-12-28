class ActivityRepository {
    activities = [];
    categories = [];
    playlists = []; // {id, name, activityIds:[]}

    localStorageManager;
    suggestionService;

    constructor(localStorageManager = null) {
        this.localStorageManager = localStorageManager;
        this.suggestionService = new SuggestionService(this);
    }

    get activityList() {
        return this.activities;
    }
    set activityList(v) {
        this.activities = Array.isArray(v) ? v : [];
    }

    getActivityList() {
        return this.activities;
    }

    getCategoryList() {
        // Wenn categories leer sind (z.B. aus altem Storage), aus activities ableiten
        if (!this.categories || this.categories.length === 0) {
            return [...new Set((this.activities || []).map(a => a.type))].filter(Boolean);
        }
        return this.categories;
    }

    getActivityByType(type) {
        const list = (this.activities || []).filter(x => x.type === type);
        if (list.length < 1) return "no activities with given type found";
        return list;
    }

    addActivityToRepository(activity) {
        this.addActivity(activity);
    }

    addActivity(activity) {
        if (!activity) return;

        // Auto-Category, damit Kategorien immer konsistent sind
        if (activity.type && !this.categories.includes(activity.type)) {
            this.categories.push(activity.type);
        }

        this.activities.push(activity);

        // Persist
        this.localStorageManager?.updateLocalStorage();
    }

    deleteActivity(targetId) {
        const foundIndex = (this.activities || []).findIndex(x => x.id === targetId);
        if (foundIndex === -1) return "Activity not found";

        const removed = this.activities.splice(foundIndex, 1)[0];

        // Entferne Activity aus ALLEN Playlists
        for (const pl of (this.playlists || [])) {
            if (!pl || !Array.isArray(pl.activityIds)) continue;
            pl.activityIds = pl.activityIds.filter(id => id !== targetId);
        }

        // Persist
        this.localStorageManager?.updateLocalStorage();

        return "removed index:" + foundIndex + " id: " + removed.id + " name: " + removed.name;
    }

    getActivityAmount() {
        return (this.activities || []).length;
    }

    addCategory(name) {
        const n = String(name || "").trim();
        if (!n) return { ok: false, error: "empty" };
        if (this.categories.includes(n)) return { ok: false, error: "exists" };

        this.categories.push(n);
        this.localStorageManager?.updateLocalStorage();
        return { ok: true };
    }

    createPlaylist(name) {
        const n = String(name || "").trim();
        if (!n) return { ok: false, error: "empty" };

        const id = "pl_" + Date.now().toString(36) + Math.random().toString(36).substring(2);
        this.playlists.push({ id, name: n, activityIds: [] });

        this.localStorageManager?.updateLocalStorage();
        return { ok: true, id };
    }

    getPlaylists() {
        return this.playlists;
    }

    addActivityToPlaylist(playlistId, activityId) {
        const pl = this.playlists.find(p => p.id === playlistId);
        if (!pl) return { ok: false, error: "playlist_not_found" };

        if (!pl.activityIds.includes(activityId)) {
            pl.activityIds.push(activityId);
            this.localStorageManager?.updateLocalStorage();
        }
        return { ok: true };
    }

    getActivitiesForPlaylist(playlistId) {
        const pl = this.playlists.find(p => p.id === playlistId);
        if (!pl) return [];

        const set = new Set(pl.activityIds);
        return (this.activities || []).filter(a => set.has(a.id));
    }
}