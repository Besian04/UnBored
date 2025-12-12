class LocalStorageManager {
    getStoredData() {
        console.log(localStorage.getItem("userData"))
        return localStorage.getItem("userData")
    }

    deleteStoredData() {

    }

    overwriteStoredData() {

    }

    checkIfDataAlreadyExistsInLocalStorage() {
        const stored = localStorage.getItem("userData");
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

    importDataFromLocalStorage() {

    }

    importStandardData() {
        try {
            const data = this.getStandardData();
            localStorage.setItem('userData', JSON.stringify(data));
        } catch (error) {
            console.error('Error importing standard data:', error);
        }
    }

    getStandardData() {
        return [
            {
                id: "a1",
                type: "music",
                name: "Jazz Night",
                description: "Live jazz at a local bar",
                time: "20:00",
                rating: 4,
                link: "",
                image: ""
            },
            {
                id: "a2",
                type: "outdoor",
                name: "Hiking Trail",
                description: "Scenic mountain hike",
                time: "08:30",
                rating: 5,
                link: "",
                image: ""
            },
            {
                id: "a3",
                type: "game",
                name: "Board Game Night",
                description: "Strategy games with friends",
                time: "19:00",
                rating: 3,
                link: "",
                image: ""
            },
            {
                id: "a4",
                type: "movie",
                name: "Sci-Fi Film",
                description: "Futuristic action story",
                time: "21:15",
                rating: 4,
                link: "",
                image: ""
            },
            {
                id: "a5",
                type: "show",
                name: "Stand-Up Comedy",
                description: "Local comedian performing live",
                time: "18:45",
                rating: 5,
                link: "",
                image: ""
            }
        ]
    }
}