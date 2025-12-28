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
}