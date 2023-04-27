function backButton(page, pageTitle) {

    /* Back Button for Full Post Views */

    const button = document.createElement("button");
    button.setAttribute("class", "round-btn back-btn");
    const icon = document.createElement("i");
    icon.setAttribute("class", "bx bx-left-arrow-alt");
    icon.setAttribute("aria-hidden", "true");
    button.prepend(icon);
    const text = document.createElement("span");
    text.innerText = `Back to ${pageTitle}`;
    button.append(text);

    button.addEventListener("click", () => {

        const parent = document.querySelector('#post-view');
        const container = parent.parentElement;

        container.classList.add("posts-container");

        // For All Posts Page
        if (page === "all") {
            document.querySelector('#posts-view').style.display = "block";
            document.querySelector('#side-view').style.display = "block";
            const postForm = document.querySelector('#post-form');
            if (postForm !== null) {
                postForm.style.display = "block";
            };
            document.querySelector('#post-view').style.display = "none";
            document.querySelector('#post-view').innerText = "";
            document.querySelector("#posts-title").innerText = pageTitle;
        }

        // For Search Page
        if (page === "search") {
            document.querySelector('#profiles-view').style.display = "block";
            document.querySelector('#search-posts-view').style.display = "block";
            document.querySelector("#search-title").innerText = pageTitle;
        }

        // For Profile Page

        if (page === "profile") {
            container.classList.remove("posts-container");
            document.querySelector('#profile-view').removeAttribute("style");
            document.querySelector('#profile-nav').removeAttribute("style");
            document.querySelector("#profile-actions").removeAttribute("style");
        }

        // For Following Page

        document.querySelector('#post-view').style.display = "none";
        document.querySelector('#post-view').innerText = "";


    });

    return button;
}

function completeCard(type, json) {

    const card = postElement(type, json.fields, json.pk);
    const likeBtn = likeButton(type, json.fields, json.pk);
    card.querySelector(".misc-div").append(likeBtn);
    if (type === "post") {
        const commentBtn = seeCommentsButton(json.fields, json.pk);
        card.querySelector(".misc-div").append(commentBtn);
    };
    likeBtn.addEventListener("click", () => {
        likeAction(likeBtn);
    });

    if (loggedInUser === json.fields.creator) {

        const saveBtn = document.createElement("button");
        saveBtn.setAttribute("class", "float-right round-btn post-crt-btn");
        saveBtn.setAttribute("data-post", json.pk);
        saveBtn.innerText = "Save Edit";
        card.querySelector(".misc-div").append(saveBtn);
        saveBtn.style.display = "none";

    };

    return card;

}

function postElement(type, fields, id) {

    // Make parent
    const card = document.createElement("article");
    card.setAttribute("class", "post-card");


    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "round-pfp post-pfp");
    const pfpLink = document.createElement("a");
    const pfp = document.createElement("img");
    pfpLink.append(pfp);
    pfpDiv.append(pfpLink);

    // Everything else div
    const miscDiv = document.createElement("div");
    miscDiv.setAttribute("class", "misc-div");

    // Top of post div that will have details and edit button
    const top = document.createElement("div");
    top.setAttribute("class", "post-top");

    // Top of the card with user's names and post creation date
    const topDeets = document.createElement("div");
    topDeets.setAttribute("class", "post-top-deets");
    const fullName = document.createElement("a");
    fullName.setAttribute("class", "post-full-name");
    const userAndCreation = document.createElement("span");
    userAndCreation.setAttribute("class", "post-user-create");
    topDeets.append(fullName, userAndCreation)
    top.append(topDeets)

    // Edit button
    if (loggedInUser === fields.creator) {

        const editBtn = editButton(type, fields, id);
        editBtn.addEventListener("click", () => {
            editAction(type, editBtn);
        })
        const edittingForm = editForm("post", id);
        edittingForm.style.display = "none";
        top.append(editBtn, edittingForm);
    };

    // Checking if this is the profiles page, search page or index
    let check = "";
    const titleCheck = document.querySelector("#posts-title");
    const searchCheck = document.querySelector("#search-cont");
    if (titleCheck !== null || searchCheck !== null) {
        check = "profiles/";
    };

    // Get user information
    fetch(`${check}api/profile/${fields.creator}`)
    .then(response => response.json() )
    .then(user => {

        pfp.alt = "";
        pfp.src = user.pfp_url;
        fullName.innerText = `${user.first_name}`
        fullName.setAttribute("href", `/profiles/${user.id}`);
        pfpLink.setAttribute("href", `/profiles/${user.id}`);
        const dateObj = new Date(fields.creation_date);
        let dateConv = dateObj.toDateString();
        // Subtracing 4 to get the year and replace space with a comma
        const dateIndex = dateConv.length-5;
        dateConv = dateConv.slice(3, dateIndex) + "," + dateConv.slice(dateIndex);
        userAndCreation.innerText = ` @${user.username} • ${dateConv}`;

    })
    .catch(error => {
        console.log(error);
    });

    // Post Content
    const postContentDiv = document.createElement("div");
    postContentDiv.setAttribute("class", "post-content-cont");
    const postContent = document.createElement("span");
    postContent.setAttribute("class", "post-content-text");
    postContent.setAttribute("data-post", id);
    postContent.innerText = fields.content;
    postContentDiv.append(postContent);

    miscDiv.append(top, postContentDiv)

    // Appendings
    card.append(pfpDiv, miscDiv);

    // Card Click Even to Show Full Post View
    if (type === "Post") {

        postContentDiv.addEventListener("click", () => {

            const fullView = fullPostView(fields, id);

        });

    }

    return card;

}

function likeButton(type, fields, id) {

    const upperType = titleCase(type);

    const likeBtn = document.createElement("button");
    likeBtn.setAttribute("class", "post-like-btn");
    likeBtn.setAttribute("data-id", id);
    likeBtn.setAttribute("data-type", `${type}`);
    const likeIcon = document.createElement("i");
    likeIcon.setAttribute("class", "bx bxs-heart post-like-heart");
    likeIcon.setAttribute("data-id", id);
    likeIcon.setAttribute("data-type", `${type}`);
    likeIcon.setAttribute("aria-hidden", "true");
    const likeCount = document.createElement("p");
    likeCount.setAttribute("class", "like-cnt");
    likeCount.innerText = fields.likers["length"]
    likeCount.setAttribute("data-id", id);
    likeCount.setAttribute("data-type", `${type}`);
    const liked = fields.likers.includes(loggedInUser);

    // Check if user has logged in
    if (loggedInUser === null) {
        likeBtn.disabled = "true";
        likeIcon.style.color = "grey";
        likeBtn.innerText = `Like(s)`;
    } else {
        if (liked === false) {
            likeBtn.innerText = `Like ${upperType}`;
            likeIcon.style.color = "grey";
        } else {
            likeBtn.innerText = `Unlike ${upperType}`;
            likeIcon.style.color = "red";
        }
    }


    likeBtn.setAttribute("data-id", id);
    likeBtn.setAttribute(`data-${type}`, id);
    likeBtn.setAttribute("data-type", `${type}`);
    likeBtn.prepend(likeIcon, likeCount);

    return likeBtn;

}

function likeAction(button) {

    const csrftoken = getCookie('csrftoken');

    // Get id and like type (post or comment) from dataset
    const id = button.dataset.id;
    const type = button.dataset.type;
    const elements = document.querySelectorAll(`[data-id='${id}']`);
    const btnOne = elements.item(0);
    let btnTwo = null
    let action = "";
    if (btnOne.innerText.includes("Unlike")) {
        action = "Unlike";
    } else {
        action = "Like";
    }
    if (elements.item(3) !== undefined) {
        btnTwo = elements.item(3)
    }

    fetch(`/posts/api/${type}/${id}`)
    .then(response => {
        if (!response.ok) return response.json().then(response => {throw new Error(response.error)})
    })
    .then(post => {

        var count = parseInt(elements.item(2).textContent)

        return fetch(`/posts/api/${type}/${id}`, {
            method: 'PUT',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
                action: action
            })
        })
        .then(() => {
            if (btnOne.childNodes[2].nodeValue === `Like ${titleCase(type)}`) {
                btnOne.childNodes[2].nodeValue = `Unlike ${titleCase(type)}`;
                elements.item(1).style.color = "red";
                elements.item(2).textContent = count += 1;
                if (btnTwo !== null) {
                    btnTwo.childNodes[2].nodeValue = `Unlike ${titleCase(type)}`;
                    elements.item(4).style.color = "red";
                    elements.item(5).textContent = count;
                }
            } else {
                btnOne.childNodes[2].nodeValue = `Like ${titleCase(type)}`;
                elements.item(1).style.color = "grey";
                elements.item(2).textContent = count -= 1;
                if (btnTwo !== null) {
                    btnTwo.childNodes[2] = `Like ${titleCase(type)}`;
                    elements.item(4).style.color = "grey";
                    elements.item(5).textContent = count;
                }
            }
        })
        .catch(error => {
            console.log(error);
        })

    })
    .catch(error => {
            console.log(error);
    });

}

function fullPostView(post, id, comments) {

    const parent = document.querySelector('#post-view');
    const container = parent.parentElement;

    // Check what page is displayed
    const titleCheck = document.querySelector("#posts-title");
    if (document.querySelector("#posts-title") !== null) {
        allPostsPostView();
    } else if (document.querySelector("#search-cont") !== null) {
        searchPostView();
    } else if (document.querySelector("#banner-row") !== null) {
        profilePostView();
    };

    // Make post parent
    const postParent = document.createElement("article");
    postParent.setAttribute("class", "post-view-card");

    // Div to hold user information
    const postUserDiv = document.createElement("div");
    postUserDiv.setAttribute("class", "post-view-user-cont");

    // Post User Profile Picture Div
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "round-pfp post-view-pfp");
    const pfpLink = document.createElement("a");
    const pfp = document.createElement("img");
    pfpLink.append(pfp);
    pfpDiv.append(pfpLink);

    // Post User Info Div
    const postUserInfo = document.createElement("div");
    postUserInfo.setAttribute("class", "user-info-div");
    const fullName = document.createElement("a");
    fullName.setAttribute("class", "user-info-full-name");
    const username = document.createElement("p");
    username.setAttribute("class", "user-info-username");
    postUserInfo.append(fullName, username);

    postUserDiv.append(pfpDiv, postUserInfo);

    // Get user information
    fetch(`/profiles/api/profile/${post.creator}`)
    .then(response => response.json() )
    .then(user => {

       pfp.alt = "";
       pfp.src = user.pfp_url;
       fullName.innerText = `${user.first_name}`;
       username.innerText = `@${user.username}`;
       fullName.setAttribute("href", `profiles/${user.id}`);
    pfpLink.setAttribute("href", `profiles/${user.id}`);

    })
    .catch(error => {
        console.log(error);
    });

    // Post Content Div
    const postContentDiv = document.createElement("div");
    postContentDiv.setAttribute("class", "post-view-content-cont");
    const postContent = document.createElement("p");
    postContent.setAttribute("class", "post-view-content-text");
    postContent.setAttribute("data-post", id);
    postContent.innerText = post.content;
    postContentDiv.append(postContent);

    // Post Timestamp
    const postTimestampDiv = document.createElement("div");
    postTimestampDiv.setAttribute("class", "post-view-timestamp-cont");
    const postTimestamp = document.createElement("p");
    postTimestamp.setAttribute("class", "post-view-time");
    const dateObj = new Date(post.creation_date);
    let dateConv = dateObj.toDateString();
    // Subtracing 4 to get the year and replace space with a comma
    const dateIndex = dateConv.length-5;
    postTimestamp.innerText = dateConv.slice(0, 3) + " •" + dateConv.slice(3, dateIndex) + "," + dateConv.slice(dateIndex);;
    postTimestampDiv.append(postTimestamp);

    // Make Buttons Div
    const buttonsDiv = document.createElement("div");
    buttonsDiv.setAttribute("class", "full-buttons-div");
    // Adding Like functionality
    const likeBtn = likeButton("post", post, id)
    buttonsDiv.append(likeBtn);
    likeBtn.addEventListener("click", () => {
        likeAction(likeBtn);
    })

    if (loggedInUser === post.creator) {

        const saveBtn = document.createElement("button");
        saveBtn.setAttribute("class", "float-right round-btn post-crt-btn");
        saveBtn.setAttribute("data-post", id);
        saveBtn.innerText = "Save Edit";
        saveBtn.style.display = "None";
        buttonsDiv.append(saveBtn);

    };

    // Edit button
    if (loggedInUser === post.creator) {

        const editBtn = editButton("post", post, id);
        editBtn.addEventListener("click", () => {
            editAction("post", editBtn, true);
        })
        const edittingForm = editForm("post", id);
        edittingForm.style.display = "none";
        postUserDiv.append(editBtn, edittingForm);
    };

    postParent.append(postUserDiv, postContentDiv, postTimestampDiv, buttonsDiv);

    parent.append(postParent);

}

function seeCommentsButton(post, post_id) {

    const commentsBtn = document.createElement("button");
    commentsBtn.setAttribute("class", "post-like-btn");
    commentsBtn.setAttribute("data-type", "comment");
    commentsBtn.setAttribute("data-post", post_id);
    commentsBtn.innerText = "Comments";
    const commentsIcon = document.createElement("i");
    commentsIcon.setAttribute("class", "bx bxs-comment post-like-heart");
    commentsIcon.setAttribute("aria-hidden", "true");
    commentsIcon.style.color = "gray";
    const commentsCount = document.createElement("p");
    commentsCount.setAttribute("class", "like-cnt");

    // Check if user has logged in
    commentsBtn.setAttribute("data-type", "comment");
    commentsBtn.prepend(commentsIcon, commentsCount);

    fetch(`/posts/api/post/${post_id}/comments`)
    .then(response => response.json() )
    .then(comments => {

        const json = JSON.parse(comments);
        //console.log(json);
        commentsCount.innerText = json["length"];

        commentsBtn.addEventListener("click", () => {

            const fullView = fullPostView(post, post_id, comments);

        });

    })
    .catch(error => {
        console.log(error);
    });

    return commentsBtn;

}