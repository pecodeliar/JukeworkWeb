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
        const container = parent.parentElement

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

        document.querySelector('#post-view').style.display = "none";
        document.querySelector('#post-view').innerText = "";

        // For Profile Page

        // For Following Page



    });

    return button;
}

function postElement(post, id) {

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

    // Top of the card with user's names and post creation date
    const topDeets = document.createElement("div");
    topDeets.setAttribute("class", "post-top-deets");
    const fullName = document.createElement("a");
    fullName.setAttribute("class", "post-full-name");
    const userAndCreation = document.createElement("span");
    userAndCreation.setAttribute("class", "post-user-create");
    topDeets.append(fullName, userAndCreation)

    // Checking if this is the profiles page, search page or index
    let check = ""
    const titleCheck = document.querySelector("#posts-title");
    const searchCheck = document.querySelector("#search-cont");
    if (titleCheck !== null || searchCheck !== null) {
        check = "profiles/";
    };

    // Get user information
    fetch(`${check}api/profile/${post.creator}`)
    .then(response => response.json() )
    .then(user => {

        pfp.alt = "";
        pfp.src = user.pfp_url;
        fullName.innerText = `${user.first_name}`
        fullName.setAttribute("href", `/profiles/${user.id}`);
        pfpLink.setAttribute("href", `/profiles/${user.id}`);
        const dateObj = new Date(post.creation_date);
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
    postContent.innerText = post.content;
    postContentDiv.append(postContent);

    miscDiv.append(topDeets, postContentDiv)

    // Appendings
    card.append(pfpDiv, miscDiv);

    // Card Click Even to Show Full Post View
    postContentDiv.addEventListener("click", () => {

        const parent = document.querySelector('#post-view');
        const container = parent.parentElement;

        // Check what page is displayed
        const titleCheck = document.querySelector("#posts-title");
        if (document.querySelector("#posts-title") !== null) {
            allPostsPostView();
        } else if (document.querySelector("#search-cont") !== null) {
            searchPostView();
        };

        const fullView = fullPostView(post)
        const buttonsDiv = fullView.querySelector(".full-buttons-div")

        // Adding Like functionality
        const likeBtn = likePostButton(post, id, loggedInUser)
        buttonsDiv.append(likeBtn)
        parent.append(fullView);
        likeBtn.addEventListener("click", () => {
            likeAction(likeBtn)
        })

    })

    return card;

}

function likePostButton(post, id, creator) {

    const likeBtn = document.createElement("button");
    likeBtn.setAttribute("class", "post-like-btn");
    likeBtn.setAttribute("data-id", id);
    likeBtn.setAttribute("data-type", "post");
    const likeIcon = document.createElement("i");
    likeIcon.setAttribute("class", "bx bxs-heart post-like-heart");
    likeIcon.setAttribute("data-id", id);
    likeIcon.setAttribute("data-type", "post");
    likeIcon.setAttribute("aria-hidden", "true");
    const likeCount = document.createElement("p");
    likeCount.setAttribute("class", "like-cnt");
    likeCount.innerText = post.likers["length"]
    likeCount.setAttribute("data-id", id);
    likeCount.setAttribute("data-type", "post");
    const liked = post.likers.includes(loggedInUser);

    // Check if user has logged in
    if (loggedInUser === null) {
        likeBtn.disabled = "true";
        likeIcon.style.color = "grey";
        likeBtn.innerText = `Like(s)`;
    } else {
        if (liked === false) {
            likeBtn.innerText = `Like Post`;
            likeIcon.style.color = "grey";
        } else {
            likeBtn.innerText = `Unlike Post`;
            likeIcon.style.color = "red";
        }
    }


    likeBtn.setAttribute("data-id", id);
    likeBtn.setAttribute("data-type", "post");
    likeBtn.prepend(likeIcon, likeCount);
    //actions.append(likeBtn)

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

    fetch(`posts/api/${type}/${id}`)
    .then(response => {
        if (!response.ok) return response.json().then(response => {throw new Error(response.error)})
    })
    .then(post => {

        var count = parseInt(elements.item(2).textContent)

        return fetch(`posts/api/${type}/${id}`, {
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