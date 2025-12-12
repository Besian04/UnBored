class UiController {
    activityForm;
    activityRepository;

    constructor(activityRepository) {
        this.activityRepository = activityRepository
        this.activityForm = document.getElementById("activityForm")
    }

    getActivityInput() {
        let values = {
            name: document.getElementById("activityName").value.trim(),
            type: document.getElementById("activityType").value,
            description: document.getElementById("activityDescription").value.trim(),
            time: document.getElementById("activityTime").value,
            rating: parseInt(document.getElementById("activityRating").value, 10),
            link: document.getElementById("activityLink").value.trim(),
            image: document.getElementById("activityImage").value.trim()
        };

        return new Activity(
            values.type,
            values.name,
            values.description,
            values.time,
            values.rating,
            values.link,
            values.image
        )
    }

    loadCategories() {
        let categoryDiv = document.getElementById("categories")
        for (let category of this.activityRepository.getCategoryList()) {
            let heading = document.createElement("h2")
            heading.innerHTML = category
            categoryDiv.append(heading)

            let activityContainer = document.createElement("div")
            categoryDiv.append(activityContainer)
            this.loadActivitiesIntoCategory(activityContainer, category)
        }

    }

    loadActivitiesIntoCategory(domElement, categoryName) {
        let activityList = this.activityRepository.getActivityByType(categoryName)
        console.log(activityList)
        for (let activity of activityList) {
            let name = document.createElement("p")
            name.innerHTML = activity.name
            domElement.append(name)
        }

    }

    loadActivitiesIntoCategories() {

    }


}