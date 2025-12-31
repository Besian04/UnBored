// ActivityRepository: manages activities, categories and playlists
class ActivityRepository {
    activities = [];
    categories = [];
    playlists = []; // { id, name, activityIds: [] }

    localStorageManager;
    suggestionService;

    // Setup repository and helper services
    constructor(localStorageManager = null) {
        this.localStorageManager = localStorageManager;
        this.suggestionService = new SuggestionService(this);
    }

    // Getter for raw activity list
    get activityList() {
        return this.activities;
    }
    // Setter with safety check
    set activityList(v) {
        this.activities = Array.isArray(v) ? v : [];
    }

    // Returns all activities
    getActivityList() {
        return this.activities;
    }

    // Returns categories (fallback: derive from activities)
    getCategoryList() {
        // Fallback for legacy data: derive categories from activities
        if (!this.categories || this.categories.length === 0) {
            return [...new Set((this.activities || []).map(a => a.type))].filter(Boolean);
        }
        return this.categories;
    }

    // Filter activities by type
    getActivityByType(type) {
        const list = (this.activities || []).filter(x => x.type === type);
        if (list.length < 1) return "no activities with given type found";
        return list;
    }

    // Alias for addActivity (legacy usage)
    addActivityToRepository(activity) {
        this.addActivity(activity);
    }

    addActivity(activity) {
        if (!activity) return;

        // Auto-add category to keep data consistent
        if (activity.type && !this.categories.includes(activity.type)) {
            this.categories.push(activity.type);
        }

        this.activities.push(activity);

        // Persist changes
        this.localStorageManager?.updateLocalStorage();
    }

    // Remove activity and clean up playlists
    deleteActivity(targetId) {
        const foundIndex = (this.activities || []).findIndex(x => x.id === targetId);
        if (foundIndex === -1) return "Activity not found";

        const removed = this.activities.splice(foundIndex, 1)[0];

        // Remove activity from all playlists
        for (const pl of (this.playlists || [])) {
            if (!pl || !Array.isArray(pl.activityIds)) continue;
            pl.activityIds = pl.activityIds.filter(id => id !== targetId);
        }

        // Persist changes
        this.localStorageManager?.updateLocalStorage();

        return "removed index:" + foundIndex + " id: " + removed.id + " name: " + removed.name;
    }

    // Total activity count
    getActivityAmount() {
        return (this.activities || []).length;
    }

    // Add new category
    addCategory(name) {
        const n = String(name || "").trim();
        if (!n) return { ok: false, error: "empty" };
        if (this.categories.includes(n)) return { ok: false, error: "exists" };

        this.categories.push(n);
        this.localStorageManager?.updateLocalStorage();
        return { ok: true };
    }

    // Create new playlist
    createPlaylist(name) {
        const n = String(name || "").trim();
        if (!n) return { ok: false, error: "empty" };

        const id = "pl_" + Date.now().toString(36) + Math.random().toString(36).substring(2);
        this.playlists.push({ id, name: n, activityIds: [] });

        this.localStorageManager?.updateLocalStorage();
        return { ok: true, id };
    }

    // Return all playlists
    getPlaylists() {
        return this.playlists;
    }

    // Add activity reference to playlist
    addActivityToPlaylist(playlistId, activityId) {
        const pl = this.playlists.find(p => p.id === playlistId);
        if (!pl) return { ok: false, error: "playlist_not_found" };

        if (!pl.activityIds.includes(activityId)) {
            pl.activityIds.push(activityId);
            this.localStorageManager?.updateLocalStorage();
        }
        return { ok: true };
    }

    // Resolve activities belonging to a playlist
    getActivitiesForPlaylist(playlistId) {
        const pl = this.playlists.find(p => p.id === playlistId);
        if (!pl) return [];

        const set = new Set(pl.activityIds);
        return (this.activities || []).filter(a => set.has(a.id));
    }
}