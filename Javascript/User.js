class User {
    static instance = null;

    activityRepository;
    localStorageManager;
    uiController;

    constructor() {

        this.activityRepository = new ActivityRepository();
        this.localStorageManager = new LocalStorageManager(this.activityRepository);
        this.uiController = new UiController(this.activityRepository);

        this.activityRepository.localStorageManager = this.localStorageManager

        this.loadUser();
    }

    loadUser() {
        if (this.localStorageManager.checkIfDataAlreadyExistsInLocalStorage()) {
            this.localStorageManager.importDataFromLocalStorage();
            console.log("loading from local storage");
        } else {
            this.localStorageManager.importStandardData(this.activityRepository);
            console.log("loading from standard data");
        }


        this.uiController.activityForm.addEventListener("submit", e => {
            e.preventDefault();
            this.addActivity(this.uiController.getActivityInput())
            this.uiController.reloadUi()
        });
    }

    addActivity(activity) {
        this.activityRepository.addActivityToRepository(activity)
        this.localStorageManager.updateLocalStorage()
    }
}