document.addEventListener('DOMContentLoaded', function() {

    const check = document.getElementById("settings-form");
    if (check !== null) {
        loggedInUser = parseInt(check.dataset.user);
    };

    editProfileForm();

});

function editProfileForm() {

    const formDiv = document.getElementById("settings-form");
    formDiv.setAttribute("onsubmit", "event.preventDefault();");

    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("id", "form-column");
    formDiv.append(form);

    // Showing the users pfp and banner images
    const picsDiv = document.createElement("div");
    picsDiv.setAttribute("class", "settings-pics-div");
    formDiv.prepend(picsDiv);

    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "round-pfp");
    pfpDiv.setAttribute("id", "settings-pfp");
    const pfpLabel = document.createElement("label");
    pfpLabel.setAttribute("for", "settings-pfp");
    pfpLabel.innerText = "Profile Picture:";
    const pfp = document.createElement("img");
    pfp.alt = "";
    pfpDiv.append(pfpLabel, pfp);

    picsDiv.append(pfpDiv);


    // Row for changing Profile Picture and/or Banner
    const firstFormRow = document.createElement("div");
    form.append(firstFormRow);

    const pfpURLDiv = document.createElement("div");
    pfpURLDiv.setAttribute("class", "col auth-group");
    const pfpURLLabel = document.createElement("label");
    pfpURLLabel.setAttribute("for", "pfp-url");
    pfpURLLabel.innerText = "URL for Profile Picture:";
    const pfpURLInput = document.createElement("input");
    pfpURLInput.setAttribute("id", "pfp-url");
    pfpURLDiv.append(pfpURLLabel, pfpURLInput);

    firstFormRow.append(pfpURLDiv);

    // Row for changing first name and/or genre
    /*const secondFormRow = document.createElement("div");
    secondFormRow.setAttribute("class", "form-row");
    form.append(secondFormRow);*/

    const nameDiv = document.createElement("div");
    nameDiv.setAttribute("class", "col auth-group");
    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "full-name");
    nameLabel.innerText = "Displayed Name:";
    const nameInput = document.createElement("input");
    nameInput.setAttribute("id", "full-name");
    nameDiv.append(nameLabel, nameInput);

    const genreDiv = document.createElement("div");
    genreDiv.setAttribute("class", "col auth-group");
    const genreLabel = document.createElement("label");
    genreLabel.setAttribute("for", "genre");
    genreLabel.innerText = "User Genre:";
    genreDiv.append(genreLabel);

    firstFormRow.append(nameDiv, genreDiv);

    // Save Changes Button
    const saveBtn = document.createElement("button");
    saveBtn.setAttribute("class", "round-btn auth-btn float-right");
    saveBtn.innerText = "Save Profile Changes";
    saveBtn.addEventListener('click', () => saveEdit());
    form.append(saveBtn);


    // Row for deleting all posts and/or deleting profile
    const pageCont = document.getElementById("settings-outer");

    const thirdFormRow = document.createElement("div");
    thirdFormRow.setAttribute("class", "form-row btn-row");
    pageCont.append(thirdFormRow);

    const deletePostsDiv = document.createElement("div");
    deletePostsDiv.setAttribute("class", "col auth-group set-btn-col");
    const deletePostsBtn = document.createElement("button");
    deletePostsBtn.setAttribute("class", "set-btn");
    deletePostsBtn.setAttribute("id", "dlt-posts-btn");
    deletePostsBtn.innerText = "Delete All Posts";
    deletePostsBtn.addEventListener('click', () => deleteAllPosts());
    deletePostsDiv.append(deletePostsBtn);

    const deleteAccountDiv = document.createElement("div");
    deleteAccountDiv.setAttribute("class", "col auth-group set-btn-col");
    const deleteAccountBtn = document.createElement("button");
    deleteAccountBtn.setAttribute("class", "set-btn");
    deleteAccountBtn.setAttribute("id", "dlt-accnt-btn");
    deleteAccountBtn.innerText = "Delete User Account";
    deleteAccountBtn.addEventListener('click', () => deleteAccount());
    deleteAccountDiv.append(deleteAccountBtn)

    thirdFormRow.append(deletePostsDiv, deleteAccountDiv);

    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));

    // Get user information for default data input
    pfp.src = user.profile_picture;
    pfpURLInput.value = user.profile_picture;
    nameInput.value = user.first_name;

    const selectMenu = genreSelect(user.genre);
    genreDiv.append(selectMenu);

}

function genreSelect(userGenre) {

    //https://stackoverflow.com/questions/17001961/how-to-add-drop-down-list-select-programmatically

    const genres = {
        0: ["Jazz", "JZ"],
        1: ["R&B / Soul", "RB"],
        2: ["Hip-Hop", "HH"],
        3: ["Classical", "IN"],
        4: ["Folk / Acoustic", "FK"],
        5: ["Indie / Alternative", "IE"],
        6: ["Pop", "PP"]
    };

    //Create and append select list
    var selectList = document.createElement("select");
    selectList.setAttribute("id", "genre");

    //Create and append the options
    for (let key in genres) {

        var option = document.createElement("option");
        option.value = genres[key][1];
        option.text = genres[key][0];
        selectList.appendChild(option);

        // Selecting default
        if (userGenre === parseInt(key)) {
            option.setAttribute("selected", "");
        };

    };

    return selectList;

}

function saveEdit() {

    // Getting input values
    const pfpURL = document.getElementById("pfp-url").value;
    const name = document.getElementById("full-name").value;

    const genres = {
        "JZ": 0,
        "RB": 1,
        "HH": 2,
        "IN": 3,
        "FK": 4,
        "IE": 5,
        "PP": 6
    };
    const genre = document.getElementById("genre").value;

    // Getting User ID
    const userId = JSON.parse(sessionStorage.getItem("loggedInUser")).id;

    const csrftoken = getCookie('csrftoken');

    fetch(`/users/api/users/${userId}/`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            profile_picture: pfpURL,
            first_name: name,
            genre: genres[genre]
        })
    })
    .then(response => response.json())
    .then(result => {

        //Changing the pfp and/or banner to reflect any changes that may have been made
        document.querySelectorAll("img")[0].src = pfpURL;
        document.querySelectorAll("img")[1].src = pfpURL;
        sessionStorage.setItem("loggedInUser", JSON.stringify(result));
        updateSessionData("settings","users", result, result.id);
        console.log("Changes saved successfully");
    })
    .catch(error => {
        console.log(error);
    });

}

function deleteAllPosts() {

    const csrftoken = getCookie('csrftoken');

    if (confirm("Are you sure you would like to delete all of your posts? This cannot be undone.")) {

        fetch(`/posts/api/purge`, {
            method: 'DELETE',
            headers: {'X-CSRFToken': csrftoken}
        })
        .then(() => {

            const message = document.getElementById("settings-alert");
            message.style.display = "block";
            message.classList.add("alert-success");
            message.innerText = "All posts have been deleted successfully.";

        })
        .catch(error => {
            console.log(error);
        });

    } else {

        console.log("They cancelled");

    }

}

function deleteAccount() {

    console.log("Danger! In Delete Account");

    if (confirm("Are you sure you would like to delete your account? This cannot be undone.")) {
        console.log("They said yes");
    } else {
        console.log("They cancelled");
    }

}