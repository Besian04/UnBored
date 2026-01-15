class UiController {
    // UI Controller: kümmert sich um Events + Rendering (Dashboard/Modals)
    activityForm;
    activityRepository;
    timerInterval = null;
    timerSeconds = 0;

    // Setup: speichert Repo-Referenz und cached wichtige DOM-Elemente
    constructor(activityRepository) {
        this.activityRepository = activityRepository;
        this.activityForm = document.getElementById("activityForm");

        this.categoryForm = document.getElementById("categoryForm");
        this.typeSelect = document.getElementById("activityType");

        this.playlistForm = document.getElementById("playlistForm");
        this.currentModalActivity = null;
        this.playlistSelect = document.getElementById("playlistSelect");

        this.sortBySelect = document.getElementById("sortBy");
        this.sortOrderSelect = document.getElementById("sortOrder");
        this.sortState = { by: "rating", order: "desc" };
        this.currentBrowsePlaylistId = null;

        // Timer button event listeners
        this.setupTimerButtons();
    }

    // ===== Helpers (i18n + Display) =====
    t(key, vars = {}) {
        return window.LanguageService?.t ? window.LanguageService.t(key, vars) : key;
    }

    displayType(type) {
        return window.LanguageService?.typeLabel
            ? window.LanguageService.typeLabel(type)
            : String(type || "—");
    }

    displayActivityName(a) {
        if (a?.nameKey) return this.t(a.nameKey);
        return a?.name || "—";
    }

    displayActivityDesc(a) {
        if (a?.descKey) return this.t(a.descKey);
        return a?.description || "—";
    }

    // ===== Timer Methods =====
    setupTimerButtons() {
        const btnStart = document.getElementById("btnStartTimer");
        const btnStop = document.getElementById("btnStopTimer");
        
        if (btnStart) {
            btnStart.addEventListener("click", () => this.startTimer());
        }
        if (btnStop) {
            btnStop.addEventListener("click", () => this.stopTimer());
        }
    }

    startTimer() {
        if (this.timerInterval) return; // Already running
        
        const btnStart = document.getElementById("btnStartTimer");
        const btnStop = document.getElementById("btnStopTimer");
        
        if (btnStart) btnStart.classList.add("hidden");
        if (btnStop) btnStop.classList.remove("hidden");

        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            this.updateTimerDisplay();
            
            if (this.timerSeconds <= 0) {
                this.stopTimer();
                this.playTimerNotification();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const btnStart = document.getElementById("btnStartTimer");
        const btnStop = document.getElementById("btnStopTimer");
        
        if (btnStart) btnStart.classList.remove("hidden");
        if (btnStop) btnStop.classList.add("hidden");
    }

    updateTimerDisplay() {
        const timerValue = document.getElementById("timerValue");
        if (timerValue) {
            const minutes = Math.floor(this.timerSeconds / 60);
            const seconds = this.timerSeconds % 60;
            timerValue.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        }
    }

    playTimerNotification() {
        // Simple notification (can be enhanced with audio/visual alerts)
        const timerValue = document.getElementById("timerValue");
        if (timerValue) {
            timerValue.classList.add("animate-pulse");
            setTimeout(() => timerValue.classList.remove("animate-pulse"), 2000);
        }
    }

    // Formular: Activity anlegen
    // Liest die Formfelder aus und baut ein Activity-Objekt (inkl. Dauer parsing)
    getActivityInput() {
        const rawDuration = document.getElementById("activityTime").value;

        let durationMinutes = 0;

        if (typeof rawDuration === "string" && rawDuration.includes(":")) {
            const [hh, mm] = rawDuration.split(":").map((x) => parseInt(x, 10));
            durationMinutes = (isNaN(hh) ? 0 : hh) * 60 + (isNaN(mm) ? 0 : mm);
        } else {
            durationMinutes = parseInt(rawDuration, 10);
            if (isNaN(durationMinutes)) durationMinutes = 0;
        }

        const values = {
            name: document.getElementById("activityName").value.trim(),
            type: document.getElementById("activityType").value,
            description: document.getElementById("activityDescription").value.trim(),
            duration: durationMinutes, // minutes
            rating: (() => {
                let r = parseInt(document.getElementById("activityRating").value, 10);
                if (isNaN(r)) r = 0;
                if (r < 0) r = 0;
                if (r > 10) r = 10;
                return r;
            })(),
            link: document.getElementById("activityLink").value.trim(),
            image: document.getElementById("activityImage").value.trim(),
        };

        return new Activity(
            values.type,
            values.name,
            values.description,
            values.duration,
            values.rating,
            values.link,
            values.image
        );
    }

    // Event Listener: Form submits, Modals, Search + Sorting
    loadButtons() {
        if (!this.activityForm) return;

        this.activityForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.activityRepository.addActivityToRepository(this.getActivityInput());
            this.activityForm.reset();
            this.renderDashboard();
            document.getElementById("modalForm")?.classList.add("hidden");
        });

        if (this.categoryForm) {
            this.categoryForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const name = document
                    .getElementById("categoryName")
                    .value.trim()
                    .toLowerCase();
                const res = this.activityRepository.addCategory(name);

                if (!res.ok) {
                    if (res.error === "exists") alert(this.t("category_exists"));
                    else alert(this.t("invalid_category"));
                    return;
                }

                this.renderSidebarCategories();
                this.renderTypeSelectOptions();

                this.categoryForm.reset();
                document.getElementById("modalCategory")?.classList.add("hidden");
            });
        }

        this.renderTypeSelectOptions();
        this.renderSidebarCategories();

        // Playlist Template
        if (this.playlistForm) {
            this.playlistForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const name = document.getElementById("playlistName").value.trim();
                const res = this.activityRepository.createPlaylist(name);

                if (!res.ok) {
                    alert(this.t("invalid_playlist"));
                    return;
                }

                this.renderSidebarPlaylists();
                this.renderPlaylistSelectOptions();

                this.playlistForm.reset();
                document.getElementById("modalPlaylist")?.classList.add("hidden");
            });
        }

        // initial
        this.renderSidebarPlaylists();
        this.renderPlaylistSelectOptions();

        // Search Funktion
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const q = searchInput.value || "";

                if (q.trim().length > 0) {
                    this.renderBrowse(null, q);
                    document.getElementById("modalBrowse")?.classList.remove("hidden");
                } else {
                    this.renderBrowse();
                }
            });
        }

        // Sorting (Browse Modal)
        if (this.sortBySelect) {
            this.sortBySelect.addEventListener("change", () => {
                this.sortState.by = this.sortBySelect.value;
                this.refreshBrowseIfOpen();
            });
        }
        if (this.sortOrderSelect) {
            this.sortOrderSelect.addEventListener("change", () => {
                this.sortState.order = this.sortOrderSelect.value;
                this.refreshBrowseIfOpen();
            });
        }
    }

    // Dashboard Render
    // Rendert alle Dashboard-Teile neu (Sidebar, Stats, History etc.)
    renderDashboard() {
        this.renderSidebarCategories();
        this.renderHighlyRated();

        this.renderSidebarPlaylists();
        this.renderPlaylistSelectOptions();

        this.renderStats();
        this.renderHistory();
    }

    // History Box: zeigt die letzten zufällig ausgewählten Activities
    renderHistory() {
        const box = document.getElementById("historyBox");
        if (!box) return;

        const stats = this.activityRepository.stats || { history: [] };
        const history = Array.isArray(stats.history) ? stats.history : [];

        if (history.length === 0) {
            box.innerHTML = `
      <div class="rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#483923] p-4">
        <h3 class="text-sm font-black mb-1" data-i18n="history_title">Recently picked</h3>
        <p class="text-xs text-slate-500 dark:text-[#c9b292]" data-i18n="history_empty">
          No activity picked yet.
        </p>
      </div>
    `;
            window.LanguageService.applyTranslations(box);
            return;
        }

        // Map ID -> Activity (falls gelöscht, dann skip)
        const all = this.activityRepository.getActivityList() || [];
        const byId = new Map(all.map(a => [a.id, a]));

        const items = history
            .map(h => ({ h, a: byId.get(h.id) }))
            .filter(x => x.a); // skip deleted

        const rows = items.map(({ h, a }) => {
            const date = new Date(h.ts);
            const timeStr = date.toLocaleString(window.LanguageService.getLang() || "en");

            return `
      <div class="flex items-center justify-between py-2 border-t border-slate-100 dark:border-[#483923]">
        <div>
          <p class="text-sm font-bold">${this.displayActivityName(a)}</p>
          <p class="text-[11px] text-slate-500 dark:text-[#c9b292]">${this.displayType(a.type)} · ${a.duration ?? "—"} ${this.t("minutes_short")}</p>
        </div>
        <p class="text-[11px] text-slate-400 dark:text-[#887050]">${timeStr}</p>
      </div>
    `;
        }).join("");

        box.innerHTML = `
    <div class="rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#483923] p-4">
      <h3 class="text-sm font-black" data-i18n="history_title">Recently picked</h3>
      ${rows}
    </div>
  `;

        window.LanguageService.applyTranslations(box);
    }

    // Dropdown für Activity-Typen (kommt aus Kategorien)
    renderTypeSelectOptions() {
        if (!this.typeSelect) return;

        const cats = this.activityRepository.getCategoryList() || [];
        this.typeSelect.innerHTML = "";

        const fallback = ["movie", "game", "outdoor", "lofi-music"];
        const finalCats = cats.length ? cats : fallback;

        for (const c of finalCats) {
            const opt = document.createElement("option");
            opt.value = c;
            opt.textContent = window.LanguageService.typeLabel(c);
            this.typeSelect.appendChild(opt);
        }
    }

    // Sidebar: Kategorienliste + Klick öffnet Browse-Modal
    renderSidebarCategories() {
        const wrap = document.getElementById("sidebarCategories");
        if (!wrap) return;

        wrap.innerHTML = "";

        const categories = this.activityRepository.getCategoryList();
        for (let cat of categories) {
            const a = document.createElement("button");
            a.className =
                "flex items-center justify-between py-2 text-sm text-slate-600 dark:text-[#c9b292] hover:text-primary transition-colors w-full text-left";
            a.innerHTML = `
        <span>${window.LanguageService.typeLabel(cat)}</span>
        <span class="text-xs bg-slate-100 dark:bg-[#332819] px-2 py-0.5 rounded-full">
          ${(this.activityRepository.getActivityList() || []).filter((x) => x.type === cat).length}
        </span>
      `;

            a.addEventListener("click", () => {
                this.renderBrowse(cat);
                document.getElementById("modalBrowse")?.classList.remove("hidden");
            });

            wrap.appendChild(a);
        }
    }

    // Sidebar: Playlists anzeigen (inkl. Count)
    renderSidebarPlaylists() {
        const wrap = document.getElementById("sidebarPlaylists");
        if (!wrap) return;

        wrap.innerHTML = "";

        const playlists = this.activityRepository.getPlaylists() || [];

        if (playlists.length === 0) {
            const empty = document.createElement("p");
            empty.className = "text-xs text-slate-500 dark:text-[#c9b292] px-1";
            empty.textContent = this.t("no_playlists_yet");
            wrap.appendChild(empty);
            return;
        }

        for (const pl of playlists) {
            const btn = document.createElement("button");
            btn.className =
                "flex items-center justify-between py-2 text-sm text-slate-600 dark:text-[#c9b292] hover:text-primary transition-colors w-full text-left";

            const count = (pl.activityIds || []).length;

            btn.innerHTML = `
          <span>${pl.name}</span>
          <span class="text-xs bg-slate-100 dark:bg-[#332819] px-2 py-0.5 rounded-full">
            ${count}
          </span>
        `;

            btn.addEventListener("click", () => {
                this.renderBrowsePlaylist(pl.id);
                document.getElementById("modalBrowse")?.classList.remove("hidden");
            });

            wrap.appendChild(btn);
        }
    }

    // Dropdown im Random-Modal: welche Playlist soll die Activity bekommen?
    renderPlaylistSelectOptions() {
        const sel = document.getElementById("playlistSelect");
        if (!sel) return;

        const playlists = this.activityRepository.getPlaylists() || [];
        sel.innerHTML = "";

        if (playlists.length === 0) {
            const opt = document.createElement("option");
            opt.value = "";
            opt.textContent = this.t("create_playlist_first");
            sel.appendChild(opt);
            sel.disabled = true;
            return;
        }

        sel.disabled = false;

        for (const pl of playlists) {
            const opt = document.createElement("option");
            opt.value = pl.id;
            opt.textContent = pl.name;
            sel.appendChild(opt);
        }
    }

    // Stats Kacheln (Random picks / Total / Avg rating)
    renderStats() {
        const box = document.getElementById("statsBox");
        if (!box) return;

        const all = this.activityRepository.getActivityList() || [];
        const stats = this.activityRepository.stats || { randomClicks: 0 };

        const avg = all.length
            ? Math.round((all.reduce((sum, a) => sum + (Number(a.rating) || 0), 0) / all.length) * 10) / 10
            : 0;

        box.innerHTML = `
    <div class="rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#483923] p-4">
      <p class="text-xs text-slate-500 dark:text-[#c9b292]" data-i18n="stat_random">Random picks</p>
      <p class="text-2xl font-black text-primary">${stats.randomClicks || 0}</p>
    </div>

    <div class="rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#483923] p-4">
      <p class="text-xs text-slate-500 dark:text-[#c9b292]" data-i18n="stat_total">Total activities</p>
      <p class="text-2xl font-black">${all.length}</p>
    </div>

    <div class="rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#483923] p-4">
      <p class="text-xs text-slate-500 dark:text-[#c9b292]" data-i18n="stat_avg">Avg rating</p>
      <p class="text-2xl font-black">⭐ ${avg}</p>
    </div>
  `;

        window.LanguageService.applyTranslations(box);
    }

    // Browse-Modal: zeigt Activities einer Playlist (mit aktuellem Sort)
    renderBrowsePlaylist(playlistId) {
        const grid = document.getElementById("browseGrid");
        if (!grid) return;

        grid.innerHTML = "";
        this.currentBrowsePlaylistId = playlistId;

        let items = this.activityRepository.getActivitiesForPlaylist(playlistId) || [];
        items = this.sortItems(items);

        const title = document.getElementById("browseTitle");
        if (title) {
            const pl = (this.activityRepository.getPlaylists() || []).find((p) => p.id === playlistId);
            title.textContent = pl
                ? this.t("playlist_prefix", { name: pl.name })
                : this.t("playlist_fallback");
        }

        if (items.length === 0) {
            const msg = document.createElement("div");
            msg.className = "text-[#c9b292] text-sm";
            msg.textContent = this.t("playlist_empty");
            grid.appendChild(msg);
            return;
        }

        for (const a of items) {
            grid.appendChild(this.createBrowseCard(a));
        }
    }

    // Action: aktuelle (Random/Modal) Activity zur ausgewählten Playlist hinzufügen
    addCurrentRandomToSelectedPlaylist() {
        const sel = document.getElementById("playlistSelect");
        if (!sel) return;

        const playlistId = sel.value;
        if (!playlistId) {
            alert(this.t("select_playlist_first"));
            return;
        }

        const a = this.currentModalActivity;
        if (!a || !a.id) {
            alert(this.t("no_activity_selected"));
            return;
        }

        const res = this.activityRepository.addActivityToPlaylist(playlistId, a.id);
        if (!res.ok) {
            alert(this.t("could_not_add"));
            return;
        }

        this.renderSidebarPlaylists();
        alert(this.t("added_to_playlist"));
    }

    // Action: aktuelle Activity löschen (mit Confirm)
    deleteCurrentModalActivity() {
        const a = this.currentModalActivity;
        if (!a || !a.id) {
            alert(this.t("no_activity_selected"));
            return;
        }

        const ok = confirm(this.t("delete_confirm", { name: a.name || "—" }));
        if (!ok) return;

        this.activityRepository.deleteActivity(a.id);

        this.currentModalActivity = null;
        this.renderDashboard();

        document.getElementById("modalRandom")?.classList.add("hidden");
    }

    // Wenn Browse-Modal offen ist: nochmal rendern (bei Sort/Search Änderungen)
    refreshBrowseIfOpen() {
        const modal = document.getElementById("modalBrowse");
        const isOpen = modal && !modal.classList.contains("hidden");
        if (!isOpen) return;

        if (this.currentBrowsePlaylistId) {
            this.renderBrowsePlaylist(this.currentBrowsePlaylistId);
            return;
        }

        const searchInput = document.getElementById("searchInput");
        const q = searchInput ? searchInput.value || "" : "";
        this.renderBrowse(null, q);
    }

    // Sort Helper für Listen (name/type/duration/rating)
    sortItems(items) {
        const by = this.sortState?.by || "rating";
        const order = this.sortState?.order || "desc";
        const dir = order === "asc" ? 1 : -1;

        const safeStr = (v) => String(v ?? "").toLowerCase();
        const safeNum = (v) => {
            const n = Number(v);
            return isNaN(n) ? 0 : n;
        };

        const copy = [...(items || [])];

        copy.sort((a, b) => {
            let va, vb;

            if (by === "name") {
                va = safeStr(a.name);
                vb = safeStr(b.name);
            } else if (by === "type") {
                va = safeStr(a.type);
                vb = safeStr(b.type);
            } else if (by === "duration") {
                va = safeNum(a.duration);
                vb = safeNum(b.duration);
            } else {
                va = safeNum(a.rating);
                vb = safeNum(b.rating);
            }

            if (va < vb) return -1 * dir;
            if (va > vb) return 1 * dir;
            return 0;
        });

        return copy;
    }

    // Dashboard: Top 6 Activities nach Rating
    renderHighlyRated() {
        const list = document.getElementById("highlyRatedList");
        if (!list) return;

        list.innerHTML = "";

        const all = this.activityRepository.getActivityList() || [];
        const sorted = [...all].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);

        for (let a of sorted) {
            list.appendChild(this.createBigRowCard(a));
        }
    }

    // UI Card (groß): wird im "Highly Rated" Bereich benutzt
    createBigRowCard(activity) {
        const row = document.createElement("div");
        row.className =
            "flex flex-col sm:flex-row bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-[#332819] group cursor-pointer min-h-[11rem]";

        const imgUrl = activity.image && activity.image.length > 5 ? activity.image : "";
        const imagePart = document.createElement("div");
        imagePart.className = "w-full sm:w-64 bg-cover bg-center relative shrink-0 h-48 sm:h-auto";
        imagePart.style.backgroundImage = imgUrl ? `url('${imgUrl}')` : "none";
        imagePart.innerHTML = `
      <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
      <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
        ${(activity.duration ?? "—")} ${this.t("minutes_short")}
      </div>    
    `;

        const content = document.createElement("div");
        content.className = "p-5 flex flex-col flex-1 justify-between";
        content.innerHTML = `
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-primary text-xs font-bold uppercase tracking-wide">${this.displayType(activity.type)}</span>
          <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span class="text-slate-500 dark:text-[#c9b292] text-xs font-bold uppercase tracking-wide">⭐ ${activity.rating || 0}</span>
        </div>
        <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">${this.displayActivityName(activity)}</h4>
        <p class="text-sm text-slate-500 dark:text-[#c9b292] line-clamp-2 leading-relaxed">${this.displayActivityDesc(activity)}</p>
      </div>

      <div class="flex items-center justify-between border-t border-slate-100 dark:border-[#332819] pt-4 mt-2">
        <button class="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1">
          ${this.t("view")} <span class="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    `;

        row.addEventListener("click", () => {
            this.showRandom(activity);
            document.getElementById("modalRandom")?.classList.remove("hidden");
        });

        row.append(imagePart, content);
        return row;
    }

    // Browse-Modal Render: Filter nach Typ + optional Suche
    renderBrowse(filterType = null, searchQuery = "") {
        const grid = document.getElementById("browseGrid");
        if (!grid) return;

        grid.innerHTML = "";
        this.currentBrowsePlaylistId = null;

        const q = String(searchQuery || "").trim().toLowerCase();
        const all = this.activityRepository.getActivityList() || [];

        let items = all;

        if (filterType) {
            items = items.filter((a) => a.type === filterType);
        }

        if (q) {
            items = items.filter((a) => {
                const name = String(a.name || "").toLowerCase();
                const desc = String(a.description || "").toLowerCase();
                const type = String(a.type || "").toLowerCase();
                return name.includes(q) || desc.includes(q) || type.includes(q);
            });
        }

        const title = document.getElementById("browseTitle");
        if (title) {
            if (q) title.textContent = this.t("search_title", { q: searchQuery });
            else title.textContent = this.t("browse_title");
        }

        if (items.length === 0) {
            const msg = document.createElement("div");
            msg.className = "text-[#c9b292] text-sm";
            msg.textContent = this.t("no_results");
            grid.appendChild(msg);
            return;
        }

        items = this.sortItems(items);

        for (let a of items) {
            grid.appendChild(this.createBrowseCard(a));
        }
    }

    // UI Card (Grid): Activity Vorschau im Browse-Modal
    createBrowseCard(activity) {
        const card = document.createElement("article");
        card.className =
            "group relative flex flex-col rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-[#483923] overflow-hidden hover:border-primary hover:shadow-[0_0_20px_rgba(238,157,43,0.15)] transition-all duration-300 hover:-translate-y-1";

        const imgUrl = activity.image && activity.image.length > 5 ? activity.image : "";
        card.innerHTML = `
      <div class="relative h-48 w-full overflow-hidden ${imgUrl ? "" : "bg-[#332819]"}">
        ${imgUrl ? `<img class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="${imgUrl}" alt="">` : ""}
        <div class="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent opacity-60"></div>
        <div class="absolute bottom-3 left-3 flex gap-2">
          <span class="px-2 py-1 rounded-md bg-background-dark/80 backdrop-blur-sm text-xs font-bold text-primary border border-primary/20">
            ${this.displayType(activity.type)}
          </span>
        </div>
      </div>

      <div class="flex flex-col flex-1 p-4 gap-3">
        <div class="flex justify-between items-start">
          <h3 class="text-slate-900 dark:text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">
            ${this.displayActivityName(activity)}
          </h3>
          <div class="flex items-center gap-1 text-primary text-sm font-bold">
            <span class="material-symbols-outlined text-[16px] fill-[1]">star</span>
            ${activity.rating || 0}
          </div>
        </div>

        <p class="text-slate-600 dark:text-text-secondary text-xs font-medium">${this.displayActivityDesc(activity)}</p>

        <button class="mt-auto w-full py-2.5 rounded-lg bg-slate-100 dark:bg-background-dark border border-slate-200 dark:border-[#483923] text-slate-900 dark:text-white text-sm font-bold hover:bg-primary hover:text-background-dark hover:border-primary transition-all duration-300">
          ${this.t("view_activity")}
        </button>
      </div>
    `;

        card.addEventListener("click", () => {
            this.showRandom(activity);
            document.getElementById("modalBrowse")?.classList.add("hidden");
            document.getElementById("modalRandom")?.classList.remove("hidden");
        });

        return card;
    }

    // Random Modal
    // Pickt eine zufällige Activity (optional forciert), speichert History und updated Modal
    showRandom(forceActivity = null) {
        const picked = forceActivity || (() => {
            const all = this.activityRepository.getActivityList() || [];

            const minEl = document.getElementById("filterMin");
            const maxEl = document.getElementById("filterMax");

            const min = minEl ? Number(minEl.value) : 0;
            const max = maxEl ? Number(maxEl.value) : Infinity;

            const safeMin = isNaN(min) ? 0 : min;
            const safeMax = isNaN(max) ? Infinity : max;

            const filtered = all.filter(a => {
                const d = Number(a?.duration);
                if (isNaN(d)) return false;
                return d >= safeMin && d <= safeMax;
            });

            if (filtered.length === 0) return null;

            return filtered[Math.floor(Math.random() * filtered.length)];
        })();

        if (!picked) {
            alert(this.t("no_match_duration"));
            return;
        }

        this.currentModalActivity = picked;
        this.renderPlaylistSelectOptions();

        // History speichern
        this.activityRepository.stats = this.activityRepository.stats || { randomClicks: 0, history: [] };
        this.activityRepository.stats.history = Array.isArray(this.activityRepository.stats.history)
            ? this.activityRepository.stats.history
            : [];

        this.activityRepository.stats.history.unshift({
            id: picked.id,
            ts: Date.now()
        });

        // max 5 Einträge
        this.activityRepository.stats.history = this.activityRepository.stats.history.slice(0, 5);

        // persist
        if (window.userInstance?.localStorageManager?.updateLocalStorage) {
            window.userInstance.localStorageManager.updateLocalStorage();
        }

        document.getElementById("randomName").textContent = this.displayActivityName(picked);
        document.getElementById("randomDescription").textContent = this.displayActivityDesc(picked);
        document.getElementById("randomTime").textContent = (picked.duration ?? "—") + " " + this.t("minutes_short");
        document.getElementById("randomRating").textContent = picked.rating ?? "—";

        // Handle link display
        const linkContainer = document.getElementById("randomLinkContainer");
        const linkElement = document.getElementById("randomLink");
        if (picked.link && picked.link.trim().length > 0) {
            linkElement.href = picked.link;
            linkElement.textContent = picked.link;
            linkContainer.classList.remove("hidden");
        } else {
            linkContainer.classList.add("hidden");
        }

        // Initialize timer
        this.stopTimer();
        const timerDisplay = document.getElementById("timerDisplay");
        if (picked.duration && picked.duration > 0) {
            this.timerSeconds = picked.duration * 60; // Convert minutes to seconds
            this.updateTimerDisplay();
            if (timerDisplay) timerDisplay.classList.remove("hidden");
        } else {
            if (timerDisplay) timerDisplay.classList.add("hidden");
        }

        // History sofort im Dashboard aktualisieren (synchron)
        this.renderHistory();
    }
}