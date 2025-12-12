let userInstance;

window.addEventListener("load", (event) => {
    userInstance = new User();

    userInstance.uiController.loadCategories()


    //load base activities into manager (check beforehand if local data already exists)
    //load user settings

    //load playlists

    //load data into ui
});