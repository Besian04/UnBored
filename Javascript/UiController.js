class UiController {
    activityForm;
    activityRepository;


    constructor(activityRepository) {
        this.activityRepository = activityRepository
        this.activityForm = document.getElementById("activityForm")
    }

    reloadUi() {
        let categoryDiv = document.getElementById("categories")

        categoryDiv.replaceChildren()
        this.loadCategories()
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
            heading.classList.add("header", "hello")

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
            let deleteButton = document.createElement("button")
            deleteButton.id = "delete" + activity.id
            deleteButton.addEventListener("click", () => {
                this.activityRepository.deleteActivity(activity.id)
                this.reloadUi()
            })

            name.innerHTML = activity.name
            domElement.append(name)
            name.append(deleteButton)
        }

    }

    loadButtons() {
        //add activity button
        this.activityForm.addEventListener("submit", e => {
            e.preventDefault();
            this.activityRepository.addActivityToRepository(this.getActivityInput())
            this.reloadUi()
        });

        //load random activity button
        let button = document.getElementById("randomActivityButton")
        button.innerHTML = "random activity"
        button.addEventListener("click", () => {
            let activity = this.activityRepository.suggestionService.getRandomActivity();
            document.getElementById("randomActivity").append(this.outputFullActivityAsDiv(activity))
        });
    }

    outputFullActivityAsDiv(activity) {
        let activityContainer = document.createElement("div")
        let name = document.createElement("div")
        let description = document.createElement("div")
        let time = document.createElement("div")
        let link = document.createElement("a")
        let image = document.createElement("img")

        name.innerHTML = activity.name
        description.innerHTML = activity.description
        time.innerHTML = activity.time
        link.innerHTML = activity.link
        image.innerHTML = activity.image

        activityContainer.append(name, description, time, link, image)
        return activityContainer
    }



}