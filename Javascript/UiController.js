class UiController {
    activityForm;
    activityRepository;

    constructor(activityRepository) {
        this.activityRepository = activityRepository;
        this.activityForm = document.getElementById("activityForm");

        this.categoryForm = document.getElementById("categoryForm");

        this.typeSelect = document.getElementById("activityType");

        this.playlistForm = document.getElementById("playlistForm");
        this.currentModalActivity = null;
        this.playlistSelect = document.getElementById("playlistSelect");
    }

    // ====== FORM ======
    getActivityInput() {
        const rawDuration = document.getElementById("activityTime").value;

        let durationMinutes = 0;

        if (typeof rawDuration === "string" && rawDuration.includes(":")) {
            const [hh, mm] = rawDuration.split(":").map(x => parseInt(x, 10));
            durationMinutes = (isNaN(hh) ? 0 : hh) * 60 + (isNaN(mm) ? 0 : mm);
        } else {
            durationMinutes = parseInt(rawDuration, 10);
            if (isNaN(durationMinutes)) durationMinutes = 0;
        }

        const values = {
            name: document.getElementById("activityName").value.trim(),
            type: document.getElementById("activityType").value,
            description: document.getElementById("activityDescription").value.trim(),
            duration: durationMinutes, // NEU: Minuten
            rating: parseInt(document.getElementById("activityRating").value, 10),
            link: document.getElementById("activityLink").value.trim(),
            image: document.getElementById("activityImage").value.trim()
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

                const name = document.getElementById("categoryName").value.trim().toLowerCase();
                const res = this.activityRepository.addCategory(name);

                if (!res.ok) {
                    if (res.error === "exists") alert("Category already exists.");
                    else alert("Invalid category name.");
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

        // ===== Playlist Template =====
        if (this.playlistForm) {
            this.playlistForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const name = document.getElementById("playlistName").value.trim();
                const res = this.activityRepository.createPlaylist(name);

                if (!res.ok) {
                    alert("Invalid playlist name.");
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

        // ===== Search =====
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const q = searchInput.value || "";

                // Wenn Suchtext vorhanden: Browse öffnen + gefiltert anzeigen
                if (q.trim().length > 0) {
                    this.renderBrowse(null, q);
                    document.getElementById("modalBrowse")?.classList.remove("hidden");
                } else {
                    // wenn leer: wieder normal rendern (optional)
                    this.renderBrowse();
                }
            });
        }
    }

    // ====== DASHBOARD RENDER ======
    renderDashboard() {
        this.renderSidebarCategories();
        this.renderHighlyRated();

        this.renderSidebarPlaylists();
        this.renderPlaylistSelectOptions();
    }

    renderTypeSelectOptions() {
        if (!this.typeSelect) return;

        const cats = this.activityRepository.getCategoryList() || [];
        this.typeSelect.innerHTML = "";

        const fallback = ["movie", "game", "outdoor"];
        const finalCats = cats.length ? cats : fallback;

        for (const c of finalCats) {
            const opt = document.createElement("option");
            opt.value = c;
            opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
            this.typeSelect.appendChild(opt);
        }
    }

    renderSidebarCategories() {
        const wrap = document.getElementById("sidebarCategories");
        if (!wrap) return;

        wrap.innerHTML = "";

        const categories = this.activityRepository.getCategoryList();
        for (let cat of categories) {
            const a = document.createElement("button");
            a.className = "flex items-center justify-between py-2 text-sm text-slate-600 dark:text-[#c9b292] hover:text-primary transition-colors w-full text-left";
            a.innerHTML = `
        <span>${cat}</span>
        <span class="text-xs bg-slate-100 dark:bg-[#332819] px-2 py-0.5 rounded-full">
          ${(this.activityRepository.getActivityList() || []).filter(x => x.type === cat).length}
        </span>
      `;

            a.addEventListener("click", () => {
                this.renderBrowse(cat);
                document.getElementById("modalBrowse")?.classList.remove("hidden");
            });

            wrap.appendChild(a);
        }
    }

    renderSidebarPlaylists() {
        const wrap = document.getElementById("sidebarPlaylists");
        if (!wrap) return;

        wrap.innerHTML = "";

        const playlists = this.activityRepository.getPlaylists() || [];

        if (playlists.length === 0) {
            const empty = document.createElement("p");
            empty.className = "text-xs text-slate-500 dark:text-[#c9b292] px-1";
            empty.textContent = "No playlists yet.";
            wrap.appendChild(empty);
            return;
        }

        for (const pl of playlists) {
            const btn = document.createElement("button");
            btn.className = "flex items-center justify-between py-2 text-sm text-slate-600 dark:text-[#c9b292] hover:text-primary transition-colors w-full text-left";

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

    renderPlaylistSelectOptions() {
        const sel = document.getElementById("playlistSelect");
        if (!sel) return;

        const playlists = this.activityRepository.getPlaylists() || [];
        sel.innerHTML = "";

        if (playlists.length === 0) {
            const opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "Create a playlist first";
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

    renderBrowsePlaylist(playlistId) {
        const grid = document.getElementById("browseGrid");
        if (!grid) return;

        grid.innerHTML = "";

        const items = this.activityRepository.getActivitiesForPlaylist(playlistId) || [];

        const title = document.getElementById("browseTitle");
        if (title) {
            const pl = (this.activityRepository.getPlaylists() || []).find(p => p.id === playlistId);
            title.textContent = pl ? `Playlist: ${pl.name}` : "Playlist";
        }

        if (items.length === 0) {
            const msg = document.createElement("div");
            msg.className = "text-[#c9b292] text-sm";
            msg.textContent = "This playlist is empty. Add activities from the Random modal.";
            grid.appendChild(msg);
            return;
        }

        for (const a of items) {
            grid.appendChild(this.createBrowseCard(a));
        }
    }

    addCurrentRandomToSelectedPlaylist() {
        const sel = document.getElementById("playlistSelect");
        if (!sel) return;

        const playlistId = sel.value;
        if (!playlistId) {
            alert("Please create/select a playlist first.");
            return;
        }

        const a = this.currentModalActivity;
        if (!a || !a.id) {
            alert("No activity selected.");
            return;
        }

        const res = this.activityRepository.addActivityToPlaylist(playlistId, a.id);
        if (!res.ok) {
            alert("Could not add to playlist.");
            return;
        }

        // refresh sidebar counts etc.
        this.renderSidebarPlaylists();
        alert("Added to playlist!");
    }

    deleteCurrentModalActivity() {
        const a = this.currentModalActivity;
        if (!a || !a.id) {
            alert("No activity selected.");
            return;
        }

        const ok = confirm(`Delete "${a.name || "this activity"}"?\nThis will also remove it from all playlists.`);
        if (!ok) return;

        this.activityRepository.deleteActivity(a.id);

        // UI refresh
        this.currentModalActivity = null;
        this.renderDashboard();

        // Modal schließen
        document.getElementById("modalRandom")?.classList.add("hidden");
    }

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

    createBigRowCard(activity) {
        const row = document.createElement("div");
        row.className = "flex flex-col sm:flex-row bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-[#332819] group cursor-pointer min-h-[11rem]";

        const imgUrl = activity.image && activity.image.length > 5 ? activity.image : "";
        const imagePart = document.createElement("div");
        imagePart.className = "w-full sm:w-64 bg-cover bg-center relative shrink-0 h-48 sm:h-auto";
        imagePart.style.backgroundImage = imgUrl ? `url('${imgUrl}')` : "none";
        imagePart.innerHTML = `
      <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
        <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded">${(activity.duration ?? "—")} min</div>    
      `;

        const content = document.createElement("div");
        content.className = "p-5 flex flex-col flex-1 justify-between";
        content.innerHTML = `
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-primary text-xs font-bold uppercase tracking-wide">${activity.type || "unknown"}</span>
          <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span class="text-slate-500 dark:text-[#c9b292] text-xs font-bold uppercase tracking-wide">⭐ ${activity.rating || 0}</span>
        </div>
        <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">${activity.name || "—"}</h4>
        <p class="text-sm text-slate-500 dark:text-[#c9b292] line-clamp-2 leading-relaxed">${activity.description || ""}</p>
      </div>

      <div class="flex items-center justify-between border-t border-slate-100 dark:border-[#332819] pt-4 mt-2">
        <button class="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1">
          View <span class="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    `;

        row.addEventListener("click", () => {
            this.showRandom(activity); // reuse modal, aber mit genau dem item
            document.getElementById("modalRandom")?.classList.remove("hidden");
        });

        row.append(imagePart, content);
        return row;
    }

    // ====== BROWSE MODAL ======
    renderBrowse(filterType = null, searchQuery = "") {
        const grid = document.getElementById("browseGrid");
        if (!grid) return;

        grid.innerHTML = "";

        const q = String(searchQuery || "").trim().toLowerCase();
        const all = this.activityRepository.getActivityList() || [];

        let items = all;

        // Category filter
        if (filterType) {
            items = items.filter(a => a.type === filterType);
        }

        // Search filter (Name/Description/Type)
        if (q) {
            items = items.filter(a => {
                const name = String(a.name || "").toLowerCase();
                const desc = String(a.description || "").toLowerCase();
                const type = String(a.type || "").toLowerCase();
                return name.includes(q) || desc.includes(q) || type.includes(q);
            });
        }

        // Titel setzen
        const title = document.getElementById("browseTitle");
        if (title) {
            if (q) title.textContent = `Search: "${searchQuery}"`;
            else if (filterType) title.textContent = `Browse: ${filterType}`;
            else title.textContent = "Browse Activities";
        }

        if (items.length === 0) {
            const msg = document.createElement("div");
            msg.className = "text-[#c9b292] text-sm";
            msg.textContent = "No matching activities found.";
            grid.appendChild(msg);
            return;
        }

        for (let a of items) {
            grid.appendChild(this.createBrowseCard(a));
        }
    }

    createBrowseCard(activity) {
        const card = document.createElement("article");
        card.className = "group relative flex flex-col rounded-xl bg-surface-dark border border-[#483923] overflow-hidden hover:border-primary hover:shadow-[0_0_20px_rgba(238,157,43,0.15)] transition-all duration-300 hover:-translate-y-1";

        const imgUrl = activity.image && activity.image.length > 5 ? activity.image : "";
        card.innerHTML = `
      <div class="relative h-48 w-full overflow-hidden ${imgUrl ? "" : "bg-[#332819]"}">
        ${imgUrl ? `<img class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="${imgUrl}" alt="">` : ""}
        <div class="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent opacity-60"></div>
        <div class="absolute bottom-3 left-3 flex gap-2">
          <span class="px-2 py-1 rounded-md bg-background-dark/80 backdrop-blur-sm text-xs font-bold text-primary border border-primary/20">${activity.type || "unknown"}</span>
        </div>
      </div>

      <div class="flex flex-col flex-1 p-4 gap-3">
        <div class="flex justify-between items-start">
          <h3 class="text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">${activity.name || "—"}</h3>
          <div class="flex items-center gap-1 text-primary text-sm font-bold">
            <span class="material-symbols-outlined text-[16px] fill-[1]">star</span>
            ${activity.rating || 0}
          </div>
        </div>

        <p class="text-text-secondary text-xs font-medium">${activity.description || ""}</p>

        <button class="mt-auto w-full py-2.5 rounded-lg bg-background-dark border border-[#483923] text-white text-sm font-bold hover:bg-primary hover:text-background-dark hover:border-primary transition-all duration-300">
          View Activity
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

    // ====== RANDOM MODAL ======
    showRandom(forceActivity = null) {
        const a = forceActivity || this.activityRepository.suggestionService.getRandomActivity();
        if (!a) return;

        this.currentModalActivity = a;
        this.renderPlaylistSelectOptions();

        document.getElementById("randomName").textContent = a.name || "—";
        document.getElementById("randomDescription").textContent = a.description || "—";
        document.getElementById("randomTime").textContent = (a.duration ?? "—") + " min";
        document.getElementById("randomRating").textContent = a.rating ?? "—";
    }
}