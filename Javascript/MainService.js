// MainService: app bootstrap + global event bindings
let userInstance;

// App entry point (init user, UI, language)
window.addEventListener("load", () => {
    userInstance = new User();

    // Bind modal open/close handlers
    bindModals();

    // Bind top-level buttons (Random, Browse, Add, Settings)
    bindTopButtons();

    // Apply translations on initial load
    window.LanguageService.applyTranslations();

    // Initial dashboard render
    userInstance.uiController.renderDashboard();

    // Expose instance for debugging
    window.userInstance = userInstance;
});

// Global modal close handling (data-close)
function bindModals() {
    document.addEventListener("click", (e) => {
        const target = e.target.closest("[data-close]");
        if (!target) return;
        const id = target.getAttribute("data-close");
        closeModal(id);
    });
}

// Open modal by id
function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

// Close modal by id
function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}

// Top bar + modal action buttons
function bindTopButtons() {
    document.getElementById("btnAdd").addEventListener("click", () => openModal("modalForm"));

    document.getElementById("btnBrowse").addEventListener("click", () => {
        userInstance.uiController.renderBrowse();
        openModal("modalBrowse");
    });

    document.getElementById("btnRandom").addEventListener("click", () => {
        userInstance.activityRepository.stats = userInstance.activityRepository.stats || { randomClicks: 0 };
        userInstance.activityRepository.stats.randomClicks = (userInstance.activityRepository.stats.randomClicks || 0) + 1;

        userInstance.localStorageManager.updateLocalStorage();

        userInstance.uiController.showRandom();
        openModal("modalRandom");
    });

    document.getElementById("btnReroll").addEventListener("click", () => {
        userInstance.uiController.showRandom();
    });

    // Export / Import (Local Mode)
    const btnExport = document.getElementById("btnExport");
    const btnImport = document.getElementById("btnImport");
    const importFile = document.getElementById("importFile");

    if (btnExport) {
        btnExport.addEventListener("click", () => {
            userInstance.localStorageManager.exportDataAsTextFile();
        });
    }

    if (btnImport && importFile) {
        btnImport.addEventListener("click", () => {
            importFile.click();
        });

        importFile.addEventListener("change", async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
                await userInstance.localStorageManager.importDataAsTextFile(file);
                userInstance.uiController.renderDashboard();
                alert(window.LanguageService.t("import_success"));
            } catch (err) {
                alert(window.LanguageService.t("import_failed", { msg: (err?.message || err) }));
            } finally {
                // allow re-importing the same file later
                e.target.value = "";
            }
        });
    }

    const btnAddCategory = document.getElementById("btnAddCategory");
    if (btnAddCategory) {
        btnAddCategory.addEventListener("click", () => openModal("modalCategory"));
    }

    // Add playlist modal
    const btnAddPlaylist = document.getElementById("btnAddPlaylist");
    if (btnAddPlaylist) {
        btnAddPlaylist.addEventListener("click", () => openModal("modalPlaylist"));
    }

    // Add current random activity to playlist
    const btnAddToPlaylist = document.getElementById("btnAddToPlaylist");
    if (btnAddToPlaylist) {
        btnAddToPlaylist.addEventListener("click", () => {
            userInstance.uiController.addCurrentRandomToSelectedPlaylist();
        });
    }

    // Delete current random activity
    const btnDeleteActivity = document.getElementById("btnDeleteActivity");
    if (btnDeleteActivity) {
        btnDeleteActivity.addEventListener("click", () => {
            userInstance.uiController.deleteCurrentModalActivity();
        });
    }

    // Theme toggle (dark / light)
    const btnTheme = document.getElementById("btnTheme");
    if (btnTheme) {
        btnTheme.addEventListener("click", () => {
            const root = document.documentElement; // <html>
            const isDark = root.classList.toggle("dark"); // togglet und gibt true/false zurück
            localStorage.setItem("unboredTheme", isDark ? "dark" : "light");
        });
    }

    // Language toggle (EN / DE)
    const btnLang = document.getElementById("btnLang");
    if (btnLang) {
        // initial label
        btnLang.textContent = (window.LanguageService.getLang() || "en").toUpperCase();

        btnLang.addEventListener("click", () => {
            const next = window.LanguageService.getLang() === "en" ? "de" : "en";
            window.LanguageService.setLang(next);

            window.LanguageService.applyTranslations();
            btnLang.textContent = next.toUpperCase();

            // refresh UI texts that are created dynamically
            userInstance.uiController.renderDashboard();
            // refresh browse modal if open
            userInstance.uiController.refreshBrowseIfOpen();
        });
    }

    // Reset all local data
    const btnReset = document.getElementById("btnReset");
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            const ok = confirm(window.LanguageService.t("reset_confirm"));
            if (!ok) return;

            const res = userInstance.localStorageManager.resetAllData();
            if (!res.ok) {
                alert(window.LanguageService.t("import_failed", { msg: res.error?.message || res.error }));
                return;
            }
            userInstance.uiController.renderDashboard();
            userInstance.uiController.refreshBrowseIfOpen();
            alert(window.LanguageService.t("reset_done"));
        });
    }

}