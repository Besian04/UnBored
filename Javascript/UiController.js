class UiController {
    activityForm;
    activityRepository;

    constructor(activityRepository) {
        this.activityRepository = activityRepository;
        this.activityForm = document.getElementById("activityForm");
    }

    reloadUi() {
        this.renderDashboard();
    }

    // ====== FORM ======
    getActivityInput() {
        let values = {
            name: document.getElementById("activityName").value.trim(),
            type: document.getElementById("activityType").value,
            description: document.getElementById("activityDescription").value.trim(),
            time: document.getElementById("activityTime").value,
            rating: parseInt(document.getElementById("activityRating").value, 10),
            link: document.getElementById("activityLink").value.trim(),
            image: document.getElementById("activityImage").value.trim()
        };

        return new Activity(
            values.type,
            values.name,
            values.description,
            values.time,
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
            this.activityRepository.localStorageManager.updateLocalStorage();
            this.activityForm.reset();
            this.reloadUi();
            document.getElementById("modalForm")?.classList.add("hidden");
        });
    }

    // ====== DASHBOARD RENDER ======
    renderDashboard() {
        this.renderSidebarCategories();
        this.renderHighlyRated();
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
          ${this.activityRepository.getActivityByType(cat).length}
        </span>
      `;

            a.addEventListener("click", () => {
                this.renderBrowse(cat);
                document.getElementById("modalBrowse")?.classList.remove("hidden");
            });

            wrap.appendChild(a);
        }
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
      <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded">${activity.time || "—"}</div>
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
    renderBrowse(filterType = null) {
        const grid = document.getElementById("browseGrid");
        if (!grid) return;

        grid.innerHTML = "";

        const all = this.activityRepository.getActivityList() || [];
        const items = filterType ? all.filter(a => a.type === filterType) : all;

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

        document.getElementById("randomName").textContent = a.name || "—";
        document.getElementById("randomDescription").textContent = a.description || "—";
        document.getElementById("randomTime").textContent = a.time || "—";
        document.getElementById("randomRating").textContent = a.rating ?? "—";
    }
}