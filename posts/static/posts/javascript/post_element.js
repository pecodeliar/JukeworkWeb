function backButton(page, path, pageTitle="") {

    //console.log(page, path)

    /* Back Button for Full Post Views */

    const button = document.createElement("a");
    button.setAttribute("class", "back-btn");
    button.setAttribute("href", "javascript:void(0);");
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
        if (page === "all" || page === "render" || page === "following") {
            if (!history.state || window.location.pathname !== path) {
                window.history.pushState({page: page}, '', path);
            }

            document.querySelector('#posts-view').style.display = "block";
            const genreBar = document.querySelector('#side-view');
            if (genreBar !== null) {
                genreBar.style.display = "block";
            }
            const postForm = document.querySelector('#post-form');
            if (postForm !== null) {
                postForm.style.display = "block";
            };
            document.querySelector('#post-view').style.display = "none";
            document.querySelector('#post-view').innerText = "";
            document.querySelector("#posts-title").innerText = pageTitle;

            // For when the post is rendered via a direct link
            if (page === "render") {
                document.querySelector("#posts-title").innerText = "Home";
                loadPosts();
                genreSideBarSelect();
            };
        }

        // For Search Page
        if (page === "search") {
            if (!history.state || window.location.pathname !== path) {
                //window.history.pushState({page: page}, '', path);
            }
            document.querySelector('#profiles-view').style.display = "block";
            document.querySelector('#search-posts-view').style.display = "block";
            document.querySelector("#search-title").innerText = pageTitle;
        }

        // For Profile Page

        if (page === "profile") {
            //window.history.pushState('', '', path);
            if (!history.state || window.location.pathname !== `/posts/${request}`) {
                //window.history.pushState({profile: profile}, '', `/users/${request}`);
            }


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

function completeCard(type, json, postId=null) {

    /** If the type is a comment, postId should be added to properly ping API. */

    //console.log(json);

    let loggedInUser = null;
    const check = document.getElementById("user-menu");
    if (check !== null) {
        loggedInUser = parseInt(check.dataset.user);
        //console.log(loggedInUser)
    };

    const card = postElement(type, json);
    const likeBtn = likeButton(type, json, postId);

    card.querySelector(`.${type}-btn-cont`).append(likeBtn);
    likeBtn.addEventListener("click", () => {
        likeAction(likeBtn);
    });

    if (loggedInUser === json.creator) {

        const editBtn = editButton(type, json, postId);
        editBtn.addEventListener("click", () => {
            editAction(type, editBtn);
        })
        card.querySelector(`.${type}-btn-cont`).append(editBtn);

        const cancelBtn = document.createElement("button");
        cancelBtn.setAttribute("class", "float-right round-btn post-crt-btn");
        cancelBtn.setAttribute(`data-${type}`, json.id);
        cancelBtn.innerText = "Cancel Edit";
        card.querySelector(`.${type}-btn-cont`).append(cancelBtn);
        cancelBtn.style.display = "none";

        const saveBtn = document.createElement("button");
        saveBtn.setAttribute("class", "float-right round-btn post-crt-btn");
        saveBtn.setAttribute(`data-${type}`, json.id);
        saveBtn.innerText = "Save Edit";
        card.querySelector(`.${type}-btn-cont`).append(saveBtn);
        saveBtn.style.display = "none";

    };

    if (type === "post") {
        const commentBtn = seeCommentsButton(json);
        card.querySelector(`.${type}-btn-cont`).append(commentBtn);
    };

    return card;

}

function postElement(type, data, postId=null) {

    // Make parent
    const card = document.createElement("article");
    card.setAttribute("class", `${type}-card`);

    let loggedInUser = null;
    const check = document.getElementById("user-menu");
    if (check !== null) {
        loggedInUser = parseInt(check.dataset.user);
        //console.log(loggedInUser)
    };

    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", `round-pfp ${type}-pfp`);
    const pfpLink = document.createElement("a");
    // Screen readers and keyboard navigators don't need redundant links
    pfpLink.setAttribute("tabindex", -1);
    pfpLink.setAttribute("aria-hidden", "true");
    const pfp = document.createElement("img");
    pfpLink.append(pfp);
    pfpDiv.append(pfpLink);

    // Everything else div
    const miscDiv = document.createElement("div");
    miscDiv.setAttribute("class", `${type}-misc-div`);

    // Top of post div that will have details and edit button
    const top = document.createElement("div");
    top.setAttribute("class", `${type}-top`);

    // Top of the card with user's names and post creation date
    const topDeets = document.createElement("div");
    topDeets.setAttribute("class", `${type}-top-deets`);
    const fullName = document.createElement("a");
    fullName.setAttribute("class", `${type}-full-name`);
    const userAndCreation = document.createElement("span");
    userAndCreation.setAttribute("class", `${type}-user-create`);
    topDeets.append(fullName, userAndCreation)
    top.append(topDeets)

    // Edit form
    if (loggedInUser === data.creator) {

        const edittingForm = editForm(type, data.id);
        edittingForm.style.display = "none";
        top.append(edittingForm);
    };

    const user = JSON.parse(sessionStorage.getItem("users"))[data.creator];

    pfp.alt = `${user.first_name}'s Profile Picture`;
    pfp.src = user.profile_picture;
    fullName.innerText = `${user.first_name}`
    fullName.setAttribute("href", `/users/${data.creator}`);
    pfpLink.setAttribute("href", `/users/${data.creator}`);
    const dateObj = new Date(data.creation_date);
    let dateConv = dateObj.toDateString();
    // Subtracing 4 to get the year and replace space with a comma
    const dateIndex = dateConv.length-5;
    dateConv = dateConv.slice(3, dateIndex) + "," + dateConv.slice(dateIndex);
    userAndCreation.innerText = ` @${user.username} • ${dateConv}`;

    // Post Content
    const postContentDiv = document.createElement("div");
    postContentDiv.setAttribute("class", `${type}-content-cont`);
    const postContent = document.createElement("span");
    postContent.setAttribute("class", `${type}-content-text`);
    postContent.setAttribute(`data-${type}`, data.id);
    if (type === "comment") {
        postContent.setAttribute(`data-post`, postId);
    }
    postContent.innerText = data.content;
    postContentDiv.append(postContent);

    const postBtnContDiv = document.createElement("div");
    postBtnContDiv.setAttribute("class", `${type}-btn-cont`);

    miscDiv.append(top, postContentDiv, postBtnContDiv);

    // Appendings
    card.append(pfpDiv, miscDiv);

    // Card Click Even to Show Full Post View
    if (type === "Post") {

        postContentDiv.addEventListener("click", () => {

            const fullView = fullPostView(data);

        });

    }

    return card;

}

function likeButton(type, data, postId=null) {

    /** If the type is a comment, postId should be added to ping API. */

    const upperType = titleCase(type);

    let loggedInUser = null;
    const check = document.getElementById("user-menu");
    if (check !== null) {
        loggedInUser = parseInt(check.dataset.user);
        //console.log(loggedInUser)
    };

    const likeBtn = document.createElement("button");
    likeBtn.setAttribute("class", `round-btn ${type}-like-btn`);
    likeBtn.setAttribute("data-id", data.id);
    likeBtn.setAttribute("data-type", `${type}`);
    const likeIcon = document.createElement("i");
    likeIcon.setAttribute("class", "bx bxs-heart ${type}-like-heart");
    likeIcon.setAttribute("data-id", data.id);
    likeIcon.setAttribute("data-type", `${type}`);
    likeIcon.setAttribute("aria-hidden", "true");
    const likeCount = document.createElement("p");
    likeCount.setAttribute("class", "like-cnt");
    likeCount.innerText = data.likers.length;
    likeCount.setAttribute("data-id", data.id);
    likeCount.setAttribute("data-type", `${type}`);
    const liked = data.likers.includes(loggedInUser);

    // Check if user has logged in
    if (loggedInUser === null) {
        likeBtn.disabled = "true";
        likeIcon.style.color = "white";
        likeBtn.innerText = `Like(s)`;
    } else {
        if (liked === false) {
            likeBtn.innerText = `Like ${upperType}`;
            likeIcon.style.color = "white";
        } else {
            likeBtn.innerText = `Unlike ${upperType}`;
            likeIcon.style.color = "var(--primary-container)";
        }
    }


    likeBtn.setAttribute("data-id", data.id);
    likeBtn.setAttribute(`data-${type}`, data.id);
    likeBtn.setAttribute("data-type", `${type}`);
    if (type === "comment") {
        likeBtn.setAttribute("data-parent", postId);
    }
    likeBtn.prepend(likeIcon, likeCount);

    return likeBtn;

}

function likeAction(button) {

    const csrftoken = getCookie('csrftoken');

    // Get id and like type (post or comment) from dataset
    const type = button.dataset.type;
    let postId = null;
    if (type === "comment") {
        postId = button.dataset.parent;
    }
    const id = button.dataset.id;
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

    let url = null;

    if (type === "comment") {
        url = `/posts/api/posts/${postId}/comments/${id}/like`
    } else if (type === "post") {
        url = `/posts/api/posts/${id}/like`
    }

    return fetch(url, {
        method: 'PATCH',
        headers: {
            'X-CSRFToken': csrftoken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        mode: 'same-origin',
        body: JSON.stringify({
            action: action
        })
    })
    .then(() => {

        var count = parseInt(elements.item(2).textContent);

        if (btnOne.childNodes[2].nodeValue === `Like ${titleCase(type)}`) {
            btnOne.childNodes[2].nodeValue = `Unlike ${titleCase(type)}`;
            elements.item(1).style.color = "var(--primary-container)";
            elements.item(2).textContent = count += 1;
            if (btnTwo !== null) {
                btnTwo.childNodes[2].nodeValue = `Unlike ${titleCase(type)}`;
                elements.item(4).style.color = "var(--primary-container)";
                elements.item(5).textContent = count;
            }
        } else {
            btnOne.childNodes[2].nodeValue = `Like ${titleCase(type)}`;
            elements.item(1).style.color = "white";
            elements.item(2).textContent = count -= 1;
            if (btnTwo !== null) {
                btnTwo.childNodes[2] = `Like ${titleCase(type)}`;
                elements.item(4).style.color = "white";
                elements.item(5).textContent = count;
            }
        }
    })
    .catch(error => {
        console.log(error);
    })

}

function fullPostView(post, comments) {

    const parent = document.querySelector('#post-view');
    const container = parent.parentElement;
    parent.innerText = "";

    let loggedInUser = null;
    const check = document.getElementById("user-menu");
    if (check !== null) {
        loggedInUser = parseInt(check.dataset.user);
        //console.log(loggedInUser)
    };

    // Check what page is displayed
    const titleCheck = document.querySelector("#posts-title");
    if (document.querySelector("#posts-title") !== null) {
        // Check if it is and empty string which would indicate is being rendered by Django
        if (document.querySelector("#posts-title").innerText === "") {
            allPostsPostView(singlePage=false);
        } else {
            allPostsPostView();
        }
    } else if (document.querySelector("#search-cont") !== null) {
        searchPostView();
        //window.history.pushState('', '', '/');
    } else if (document.querySelector("#banner-row") !== null) {
        profilePostView();
        console.log(post.id)
        if (!history.state || window.location.pathname !== `/profiles/post/${post.id}`) {
            //window.history.pushState({post: id}, '', `/profiles/post/${id}`);
        }
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

    const user = JSON.parse(sessionStorage.getItem("users"))[post.creator];

    pfp.alt = "";
    pfp.src = user.profile_picture;
    fullName.innerText = `${user.first_name}`;
    username.innerText = `@${user.username}`;
    fullName.setAttribute("href", `/users/${post.creator}`);
    pfpLink.setAttribute("href", `/users/${post.creator}`);

    // Post Content Div
    const postContentDiv = document.createElement("div");
    postContentDiv.setAttribute("class", "post-view-content-cont");
    const postContent = document.createElement("p");
    postContent.setAttribute("class", "post-view-content-text");
    postContent.setAttribute("data-post", post.id);
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
    const likeBtn = likeButton("post", post)
    buttonsDiv.append(likeBtn);
    likeBtn.addEventListener("click", () => {
        likeAction(likeBtn);
    })

    /*if (loggedInUser === post.creator) {

        const saveBtn = document.createElement("button");
        saveBtn.setAttribute("class", "float-right round-btn post-crt-btn");
        saveBtn.setAttribute("data-post", post.id);
        saveBtn.innerText = "Save Edit";
        saveBtn.style.display = "None";
        buttonsDiv.append(saveBtn);

        const cancelBtn = document.createElement("button");
        cancelBtn.setAttribute("class", "float-right round-btn post-crt-btn");
        cancelBtn.setAttribute(`data-${type}`, post.id);
        cancelBtn.innerText = "Cancel Edit";
        cancelBtn.style.display = "none";

    };*/

    // Edit button
    if (loggedInUser === post.creator) {

        const editBtn = editButton("post", post, post.id);
        editBtn.addEventListener("click", () => {
            editAction("post", editBtn, true);
        })
        const edittingForm = editForm("post", post.id);
        edittingForm.style.display = "none";
        postUserDiv.append(edittingForm);

        const cancelBtn = document.createElement("button");
        cancelBtn.setAttribute("class", "float-right round-btn post-crt-btn");
        cancelBtn.setAttribute(`data-post`, post.id);
        cancelBtn.innerText = "Cancel Edit";
        cancelBtn.style.display = "none";

        const saveBtn = document.createElement("button");
        saveBtn.setAttribute("class", "float-right round-btn post-crt-btn");
        saveBtn.setAttribute("data-post", post.id);
        saveBtn.innerText = "Save Edit";
        saveBtn.style.display = "None";

        buttonsDiv.append(editBtn, cancelBtn, saveBtn);

    };

    postParent.append(postUserDiv, postContentDiv, postTimestampDiv, buttonsDiv);

    parent.append(postParent);

    // Comments Display
    const commentsSection = document.createElement("div");
    postParent.append(commentsSection);
    commentsSection.setAttribute("id", "comment-cont");

    const commentsHeading = document.createElement("h2");
    commentsSection.append(commentsHeading);
    commentsHeading.innerText = "Comments";

    if (loggedInUser !== null) {
        const cmntCompose = compose("comment", post.id);
        commentsSection.append(cmntCompose);
    }
    //const cmntJson = JSON.parse(comments);

    //console.log(comments)

    if (comments["length"] === 0) {

        const noComments = document.createElement("p");
        noComments.innerText = "No one has commented under this post.";
        commentsSection.append(noComments);

    } else {

        comments.forEach(comment => {
            const cmntCard = completeCard("comment", comment, post.id);
            commentsSection.append(cmntCard);
        })

    }

}

function seeCommentsButton(post) {

    const commentsBtn = document.createElement("button");
    commentsBtn.setAttribute("class", "round-btn post-like-btn");
    commentsBtn.setAttribute("data-type", "comment");
    commentsBtn.setAttribute("data-post", post.id);
    commentsBtn.innerText = "Comment(s)";
    const commentsIcon = document.createElement("i");
    commentsIcon.setAttribute("class", "bx bxs-comment post-like-heart");
    commentsIcon.setAttribute("aria-hidden", "true");
    commentsIcon.style.color = "white";
    const commentsCount = document.createElement("p");
    commentsCount.setAttribute("class", "like-cnt");

    // Check if user has logged in
    commentsBtn.setAttribute("data-type", "comment");
    commentsBtn.prepend(commentsIcon, commentsCount);

    fetch(`/posts/api/posts/${post.id}/comments`)
    .then(response => response.json() )
    .then(comments => {

        //console.log(comments)

        commentsCount.innerText = comments.results.length;

        commentsBtn.addEventListener("click", () => {

            const fullView = fullPostView(post, comments.results);
            // Add the current state to the history
            history.pushState({post: post.id}, "", `${post.id}`);

        });

    })
    .catch(error => {
        console.log(error);
    });

    return commentsBtn;

}