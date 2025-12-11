class LocalStorageManager {
        /**
     * Say hello
     */
    testFunction() {
        console.log("import worked")
    }

    getStoredData() {

    }

    deleteStoredData() {

    }

    overwriteStoredData() {

    }

    checkIfDataAlreadyExists() {
        const stored = localStorage.getItem("activities");

        if (stored) {
           return true
        } else {
            return false
        }
    }
    

    exportDataAsTextFile() {

    }

    importDataAsTextFile() {

    }
}