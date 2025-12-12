class UiController {
    activityForm;
    user;

    constructor() {
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


}