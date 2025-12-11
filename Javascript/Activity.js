class Activity {
    id;
    type = "no type";
    name = "no name";
    description = "no description"
    time = "no time"
    rating = 0
    link = "no link"
    image = "no image"

    constructor(type, name, description, time, rating, link, image) {
        this.setBaseVariables(type, name, description, time, rating, link, image);
    }

    setBaseVariables(type, name, description, time, rating, link, image) {
        this.type = type;
        this.name = name;
        this.description = description;
        this.time = time;
        this.rating = rating;
        this.link = link;
        this.image = image;

        this.id = this.createRandomId
    }

    createRandomId() {
        const dateString = Date.now().toString(36);
        const randomness = Math.random().toString(36).substr(2);
        return dateString + randomness;
    }

    changeRating(newRating) {
        if (rating > 5) {
            return "rating too high";
        } else {
            this.rating = newRating;
            return "new rating = " + newRating;
        }
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

    getTime() {
        return this.time;
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