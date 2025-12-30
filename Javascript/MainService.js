let userInstance;

window.addEventListener("load", () => {
    userInstance = new User();

    bindModals();
    bindTopButtons();

    userInstance.uiController.renderDashboard();
});

function bindModals() {
    document.addEventListener("click", (e) => {
        const target = e.target.closest("[data-close]");
        if (!target) return;
        const id = target.getAttribute("data-close");
        closeModal(id);
    });
}

function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}

function bindTopButtons() {
    document.getElementById("btnAdd").addEventListener("click", () => openModal("modalForm"));

    document.getElementById("btnBrowse").addEventListener("click", () => {
        userInstance.uiController.renderBrowse();
        openModal("modalBrowse");
    });

    document.getElementById("btnRandom").addEventListener("click", () => {
        userInstance.uiController.showRandom();
        openModal("modalRandom");
    });

    document.getElementById("btnReroll").addEventListener("click", () => {
        userInstance.uiController.showRandom();
    });

    // ===== Export / Import Buttons (Local Mode box) =====
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
                alert("Import successful!");
            } catch (err) {
                alert("Import failed: " + (err?.message || err));
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

    // ===== Add Playlist =====
    const btnAddPlaylist = document.getElementById("btnAddPlaylist");
    if (btnAddPlaylist) {
        btnAddPlaylist.addEventListener("click", () => openModal("modalPlaylist"));
    }

    // ===== Add current activity to playlist (from Random modal) =====
    const btnAddToPlaylist = document.getElementById("btnAddToPlaylist");
    if (btnAddToPlaylist) {
        btnAddToPlaylist.addEventListener("click", () => {
            userInstance.uiController.addCurrentRandomToSelectedPlaylist();
        });
    }

    // ===== Delete current activity (Random modal) =====
    const btnDeleteActivity = document.getElementById("btnDeleteActivity");
    if (btnDeleteActivity) {
        btnDeleteActivity.addEventListener("click", () => {
            userInstance.uiController.deleteCurrentModalActivity();
        });
    }

    // Dark - Light Mode button
    const btnTheme = document.getElementById("btnTheme");
    if (btnTheme) {
        btnTheme.addEventListener("click", () => {
            const root = document.documentElement; // <html>
            const isDark = root.classList.toggle("dark"); // togglet und gibt true/false zurück
            localStorage.setItem("unboredTheme", isDark ? "dark" : "light");
        });
    }

    // Language button
    const btnLang = document.getElementById("btnLang");
    if (btnLang) {
        // initial label
        btnLang.textContent = (window.LanguageService.getLang() || "en").toUpperCase();

        btnLang.addEventListener("click", () => {
            const next = window.LanguageService.getLang() === "en" ? "de" : "en";
            window.LanguageService.setLang(next);

            // update html lang + button label
            document.documentElement.lang = next;
            btnLang.textContent = next.toUpperCase();

            // refresh UI texts that are created dynamically
            userInstance.uiController.renderDashboard();
            userInstance.uiController.refreshBrowseIfOpen(); // falls Browse/Search offen ist
        });
    }

}