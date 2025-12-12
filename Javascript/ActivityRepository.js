class ActivityRepository {
    activityList = []
    localStorageManager;

    constructor(localStorage) {
        this.localStorageManager = localStorage
    }

    getActivityList() {
        return this.activityList
    }

    getCategoryList() {
        return [...new Set(this.getActivityList().map(activity => activity.type))];
    }

    getActivityByType(type) {
        let foundActivityList = this.activityList.filter(x => x.type === type)

        if (foundActivityList.length < 1) {
            return "no activities with given type found";
        } else {
            return foundActivityList;
        }
    }

    addActivityToRepository(activity) {
        this.activityList.push(activity)
    }

    deleteActivity(targetId) {
        let foundActivity = this.activityList.find(x => x.id === targetId);
        let foundActivityIndex = this.activityList.findIndex(x => x.id === targetId);

        if (foundActivity === undefined) {
            return "Activity not found";
        } else {
            this.activityList.splice(foundActivityIndex, 1);
            this.localStorageManager.updateLocalStorage()
            return "removed index:" + foundActivityIndex +" id: " + foundActivity.id + " name: " + foundActivity.name
        }
    }

    getActivityAmount() {
        return this.activityList.length;
    }
}