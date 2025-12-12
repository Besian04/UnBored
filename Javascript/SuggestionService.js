class SuggestionService {
    activityRepository

    constructor(activityRepository) {
        this.activityRepository = activityRepository
    }

    getRandomActivity(){
        let list = this.activityRepository.getActivityList()

        if (!list || list.length === 0) return null; // handle empty array
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }


}