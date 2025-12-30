class Activity {
    id;
    type = "no type";
    name = "no name";
    description = "no description"
    duration = 0   // CHANGED: was time
    rating = 0
    link = "no link"
    image = "no image"

    // CHANGED: parameter name time -> duration
    constructor(type, name, description, duration, rating, link, image) {
        this.setBaseVariables(type, name, description, duration, rating, link, image);
    }

    // CHANGED: parameter name time -> duration
    setBaseVariables(type, name, description, duration, rating, link, image) {
        this.type = type;
        this.name = name;
        this.description = description;
        this.duration = duration;   // CHANGED: was this.time
        this.rating = rating;
        this.link = link;
        this.image = image;

        this.id = this.createRandomId()
    }

    createRandomId() {
        const dateString = Date.now().toString(36);
        const randomness = Math.random().toString(36).substr(2);
        return dateString + randomness;
    }

    changeRating(newRating) {
        const n = parseInt(newRating, 10);

        if (isNaN(n)) return "rating invalid";
        if (n < 0) return "rating too low";
        if (n > 10) return "rating too high";

        this.rating = n;
        return "new rating = " + n;
    }

    getId() {
        return this.id;
    }

    getType() {
        return this.type;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    // CHANGED: was getTime()
    getDuration() {
        return this.duration;
    }

    getRating() {
        return this.rating;
    }

    getLink() {
        return this.link;
    }

    getImage() {
        return this.image;
    }

}

//i noticed that every extended activity has the same variables, so ill just use the base class for everything
/*class ActivitySong extends Activity {
    constructor(type, name, description, time, rating, link, image) {
        this.setBaseVariables(type, name, description, time, rating)

        this.link = link;
        this.image = image
    }
}

class ActivityGame {
    constructor(type, name, description, time, rating, link, image) {
        this.setBaseVariables(type, name, description, time, rating)

        this.link = link;
        this.image = image
    }
}

class ActivityMovie {
    constructor(type, name, description, time, rating, link, image) {
        this.setBaseVariables(type, name, description, time, rating)

        this.link = link;
        this.image = image
    }
}

class ActivityShow {
    constructor(type, name, description, time, rating, link, image) {
        this.setBaseVariables(type, name, description, time, rating)

        this.link = link;
        this.image = image
    }
}*/