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

        this.uiController.loadButtons()
    }
}