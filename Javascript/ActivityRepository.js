class ActivityRepository {
    activityList = []

    getActivityList() {
        return this.activityList
    }

    getActivityByType(type) {
        foundActivityList = this.activityList.filter(x => x.type === type)

        if (foundActivityList.length < 1) {
            return "no activities with given type found";
        } else {
            return foundActivityList;
        }
    }

    addActivity(activity) {
        this.activityList.push(activity)
    }

    deleteActivity(targetId) {
        foundActivity = this.activityList.find(x => x.id === targetId);
        foundActivityIndex = this.activityList.findIndex(x => x.id === targetId);

        if (foundActivity === undefined) {
            return "Activity not found";
        } else {
            this.activityList.splice(foundActivityIndex, 1);
            return "removed index:" + foundActivityIndex +" id: " + foundActivity.id + " name: " + foundActivity.name
        }
    }

    getActivityAmount() {
        return this.activityList.length;
    }
}