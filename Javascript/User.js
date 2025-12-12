class User {
    activityRepository
    localStorageManager
    uiController


    constructor() {
        this.activityRepository = new ActivityRepository()
        this.localStorageManager = new LocalStorageManager()
        this.uiController = new UiController

        this.loadUser()

    }

    loadUser() {
        if (this.localStorageManager.checkIfDataAlreadyExistsInLocalStorage()) {
            this.localStorageManager.importDataFromLocalStorage()
            console.log("loading from local storage")
        } else {
            this.localStorageManager.importStandardData(this.activityRepository)
            console.log("loading from standard data")
        }

        this.localStorageManager.getStoredData()
    }
}