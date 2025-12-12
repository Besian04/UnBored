class User {
    static instance = null;

    activityRepository;
    localStorageManager;
    uiController;
    testInt;

    constructor() {

        this.activityRepository = new ActivityRepository();
        this.localStorageManager = new LocalStorageManager(this.activityRepository);
        this.uiController = new UiController(this);

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

        this.localStorageManager.getStoredData();

        this.uiController.activityForm.addEventListener("submit", e => {
            e.preventDefault();
            this.addActivity(this.uiController.getActivityInput())
        });
    }

    addActivity(activity) {
        this.activityRepository.addActivityToRepository(activity)
        this.localStorageManager.updateLocalStorage()
    }
}