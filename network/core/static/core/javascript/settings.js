document.addEventListener('DOMContentLoaded', function() {

    const check = document.getElementById("settings-form");
    if (check !== null) {
        loggedInUser = parseInt(check.dataset.user);
    };

    editProfileForm();
    console.log(loggedInUser)

});

function editProfileForm() {

    const formDiv = document.getElementById("settings-form");
    formDiv.setAttribute("onsubmit", "event.preventDefault();");

    const form = document.createElement("form");
    form.setAttribute("method", "post");
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

    const bannerDiv = document.createElement("div");
    bannerDiv.setAttribute("id", "settings-banner");
    const bannerLabel = document.createElement("label");
    bannerLabel.setAttribute("for", "settings-banner");
    bannerLabel.innerText = "Banner:";
    const banner = document.createElement("img");
    banner.alt = "";
    bannerDiv.append(bannerLabel, banner);

    picsDiv.append(pfpDiv, bannerDiv);


    // Row for changing Profile Picture and/or Banner
    const firstFormRow = document.createElement("div");
    firstFormRow.setAttribute("class", "form-row");
    form.append(firstFormRow);

    const pfpURLDiv = document.createElement("div");
    pfpURLDiv.setAttribute("class", "col auth-item reg-item");
    const pfpURLLabel = document.createElement("label");
    pfpURLLabel.setAttribute("for", "pfp-url");
    pfpURLLabel.innerText = "URL for Profile Picture:";
    const pfpURLInput = document.createElement("input");
    pfpURLInput.setAttribute("id", "pfp-url");
    pfpURLDiv.append(pfpURLLabel, pfpURLInput);

    const bannerURLDiv = document.createElement("div");
    bannerURLDiv.setAttribute("class", "col auth-item reg-item");
    const bannerURLLabel = document.createElement("label");
    bannerURLLabel.setAttribute("for", "banner-url");
    bannerURLLabel.innerText = "URL for Banner:";
    const bannerURLInput = document.createElement("input");
    bannerURLInput.setAttribute("id", "banner-url");
    bannerURLDiv.append(bannerURLLabel, bannerURLInput);

    firstFormRow.append(pfpURLDiv, bannerURLDiv);

    // Row for changing first name and/or genre
    const secondFormRow = document.createElement("div");
    secondFormRow.setAttribute("class", "form-row");
    form.append(secondFormRow);

    const nameDiv = document.createElement("div");
    nameDiv.setAttribute("class", "col auth-item reg-item");
    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "full-name");
    nameLabel.innerText = "Displayed Name:";
    const nameInput = document.createElement("input");
    nameInput.setAttribute("id", "full-name");
    nameDiv.append(nameLabel, nameInput);

    const genreDiv = document.createElement("div");
    genreDiv.setAttribute("class", "col auth-item reg-item");
    const genreLabel = document.createElement("label");
    genreLabel.setAttribute("for", "genre");
    genreLabel.innerText = "User Genre:";
    genreDiv.append(genreLabel);

    secondFormRow.append(nameDiv, genreDiv);

    // Save Changes Button
    const saveBtn = document.createElement("button");
    saveBtn.setAttribute("class", "round-btn auth-btn float-right");
    saveBtn.innerText = "Save Profile Changes";
    saveBtn.addEventListener('click', () => saveEdit());
    form.append(saveBtn);


    // Row for deleting all posts and/or deleting profile
    const thirdFormRow = document.createElement("div");
    thirdFormRow.setAttribute("class", "form-row btn-row");
    form.append(thirdFormRow);

    const deletePostsDiv = document.createElement("div");
    deletePostsDiv.setAttribute("class", "col auth-item reg-item set-btn-col");
    const deletePostsBtn = document.createElement("button");
    deletePostsBtn.setAttribute("class", "set-btn");
    deletePostsBtn.setAttribute("id", "dlt-posts-btn");
    deletePostsBtn.innerText = "Delete All Posts";
    deletePostsDiv.append(deletePostsBtn);

    const deleteAccountDiv = document.createElement("div");
    deleteAccountDiv.setAttribute("class", "col auth-item reg-item set-btn-col");
    const deleteAccountBtn = document.createElement("button");
    deleteAccountBtn.setAttribute("class", "set-btn");
    deleteAccountBtn.setAttribute("id", "dlt-accnt-btn");
    deleteAccountBtn.innerText = "Delete User Account";
    deleteAccountDiv.append(deleteAccountBtn)

    thirdFormRow.append(deletePostsDiv, deleteAccountDiv);

    // Get user information for default data input
    fetch(`/profiles/api/profile/${loggedInUser}`)
    .then(response => response.json() )
    .then(user => {

        pfp.src = user.pfp_url;
        pfpURLInput.value = user.pfp_url;
        banner.src = user.banner_url;
        bannerURLInput.value = user.banner_url;
        nameInput.value = user.first_name;

        const selectMenu = genreSelect(user.genre);
        genreDiv.append(selectMenu);

    })
    .catch(error => {
        console.log(error);
    });

}

function genreSelect(userGenre) {

    //https://stackoverflow.com/questions/17001961/how-to-add-drop-down-list-select-programmatically

    const genres = {
        "Jazz": "JZ",
        "R&B / Soul": "RB",
        "Hip-Hop": "HH",
        "Classical": "IN",
        "Folk / Acoustic": "FK",
        "Indie / Alternative": "IE",
        "Pop": "PP"
    };

    //Create and append select list
    var selectList = document.createElement("select");
    selectList.setAttribute("id", "genre");

    //Create and append the options
    for (let key in genres) {

        var option = document.createElement("option");
        option.value = genres[key];
        option.text = key;
        selectList.appendChild(option);

        // Selecting default
        if (userGenre === genres[key]) {
            option.setAttribute("selected", "");
        };

    };

    return selectList;

}

function saveEdit() {

    // Getting input values
    const pfpURL = document.getElementById("pfp-url").value;
    const bannerURL = document.getElementById("banner-url").value;
    const name = document.getElementById("full-name").value;
    const genre = document.getElementById("genre").value;

    const csrftoken = getCookie('csrftoken');

    fetch(`/api/settings/edit`, {
        method: 'PUT',
        headers: {'X-CSRFToken': csrftoken},
        body: JSON.stringify({
            pfp_url: pfpURL,
            banner_url: bannerURL,
            first_name: name,
            genre: genre,
            action: "edit"
        })
    })
    .then(() => {

        //Changing the pfp and/or banner to reflect any changes that may have been made
        document.querySelectorAll("img")[0].src = pfpURL;
        document.querySelectorAll("img")[1].src = pfpURL;
        document.querySelectorAll("img")[2].src = bannerURL;

        console.log("Things saved successfully");

    })
    .catch(error => {
        console.log(error);
    });

}