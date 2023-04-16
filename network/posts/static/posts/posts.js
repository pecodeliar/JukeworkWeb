let loggedInUser = null

document.addEventListener('DOMContentLoaded', function() {

    const postForm = document.querySelector('#post-form')
    if (postForm !== null) {
        loggedInUser = parseInt(postForm.dataset.user)
        const form = composePost();
        document.querySelector('#post-form').append(form);
    };

    const title = document.querySelector("#posts-title");
    if (title !== null) {
        loadPosts();
        genreSideBarSelect();
    };

});

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function composePost() {

    // Make div
    const formDiv = document.createElement("div");
    formDiv.setAttribute("class", "form-div");
    formDiv.setAttribute("onsubmit", "event.preventDefault();");

    var form = document.createElement("form");
    form.setAttribute("method", "post");

    var formRow = document.createElement("div");
    formRow.setAttribute("class", "post-form-row")

    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "create-post-pfp round-pfp");
    const pfp = document.createElement("img");
    pfpDiv.append(pfp)
    formRow.append(pfpDiv)

    // Get user information for PFP
    fetch(`profiles/api/profile/${loggedInUser}`)
    .then(response => response.json() )
    .then(user => {

        pfp.alt = user.username;
        pfp.src = user.pfp_url;
        fetchedUser = user;

    })
    .catch(error => {
        console.log(error);
    });

    const formTextDiv = document.createElement("div");
    formTextDiv.setAttribute("class", "form-text-div");
    const formText = document.createElement("textarea");
    formText.setAttribute("id", "form-text");
    formText.placeholder = "Enter post content..."
    const formTextLabel = document.createElement("label");
    formTextLabel.setAttribute("for", "form-text");
    formTextLabel.innerText = "Enter text for a new post:";
    formTextDiv.append(formTextLabel, formText)
    formRow.append(formTextDiv)

    const csrftoken = getCookie('csrftoken');

    const postButton = document.createElement("button");
    postButton.setAttribute("class", "float-right round-btn post-crt-btn");
    postButton.innerText = "Create Post";
    postButton.addEventListener("click", () => {

        fetch('/posts/api/create', {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
                type: 'Post',
                content: formText.value,
            })
          })
          .then(response => response.json())
          .then(result => {
                // Print result
                post = JSON.parse(result)
                formText.value = "";

                const postCard = postElement(post[0].fields, post[0].pk, fetchedUser)
                const help = likePostButton(post[0].fields, post[0].pk, loggedInUser)
                postCard.querySelector(".misc-div").append(help)
                document.querySelector('#posts-cont').prepend(postCard);
                help.addEventListener("click", () => {
                    like(help)
                })
          })

    });

    form.append(formRow, postButton)
    formDiv.append(form);
    return formDiv;

}

async function loadPosts(genre="") {

    // Select posts div and empty it
    const parent = document.querySelector("#posts-view");
    parent.innerText = ""

    // Add link for skipping to main content
    const mainContentSkip = document.createElement("a");
    mainContentSkip.setAttribute("id", "maincontent");
    mainContentSkip.setAttribute("class", "main-skip");
    mainContentSkip.innerHTML = "Hello!"
    parent.append(mainContentSkip);

    const innerParent = document.createElement("div");
    innerParent.setAttribute("id", "posts-cont");
    innerParent.setAttribute("class", "posts-child container");
    parent.append(innerParent);

    // https://webdesign.tutsplus.com/tutorials/how-to-implement-a-load-more-button-with-vanilla-javascript--cms-42080
    let allPosts = null

    const postIncrease = 15;
    let currentPage = 1;

    if (genre === "") {

        const response = await fetch('/posts/api/all')
        .then(response => response.json() )
        .then(json => {
            // allPosts = shuffleArray(JSON.parse(json))
            allPosts = JSON.parse(json)
            postLimit = allPosts.length
        })
        .catch(error => {
            console.log(error);
        });

    } else {

        const response = await fetch(`/posts/api/genre/${genre}`)
        .then(response => response.json() )
        .then(json => {
            //allPosts = shuffleArray(JSON.parse(json))
            allPosts = JSON.parse(json)
            postLimit = allPosts.length
        })
        .catch(error => {
            console.log(error);
        });

    }

    // Load More Button
    const loadMoreDiv = document.createElement("div");
    loadMoreDiv.setAttribute("id", "load-btn-div");
    const loadMore = document.createElement("button");
    loadMore.setAttribute("id", "load-btn");
    loadMore.setAttribute("class", "")
    loadMore.innerText = "Load More Posts";

    const addPosts = (pageIndex) => {

        currentPage = pageIndex;

        const startRange = (pageIndex - 1) * postIncrease;
        let endRange = pageIndex * postIncrease;

        if (allPosts.length - 1 < endRange) {
            endRange = allPosts.length;
            loadMore.classList.add("disabled");
            loadMore.setAttribute("disabled", true);
            loadMore.innerText = "No More Posts"
        }

        for (let i = startRange; i <= endRange - 1; i++) {
            const postCard = postElement(allPosts[i].fields, allPosts[i].pk)
            const help = likePostButton(allPosts[i].fields, allPosts[i].pk, loggedInUser)
            postCard.querySelector(".misc-div").append(help)
            innerParent.append(postCard)
            help.addEventListener("click", () => {
                like(help)
            })

        }
    };

    addPosts(currentPage);

    loadMoreDiv.append(loadMore);
    parent.append(loadMoreDiv);
    loadMore.addEventListener("click", () => {

        addPosts(currentPage + 1);

    });

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

    // Checking if this is the profiles page or index
    let check = ""
    const title = document.querySelector("#posts-title");
    if (title !== null) {
        check = "profiles/"
    };

    // Get user information
    fetch(`${check}api/profile/${post.creator}`)
    .then(response => response.json() )
    .then(user => {

        pfp.alt = "";
        pfp.src = user.pfp_url;
        fullName.innerText = `${user.first_name}`
        fullName.setAttribute("href", `profiles/${user.id}`);
        pfpLink.setAttribute("href", `profiles/${user.id}`);
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
        const container = parent.parentElement
        container.classList.remove("posts-container");

        // Show the post full view and hide other posts
        parent.style.display = "block";
        const allPosts = document.querySelector('#posts-view');
        allPosts.style.display = "none";
        const sideBar = document.querySelector('#side-view');
        sideBar.style.display = "none";
        const postForm = document.querySelector('#post-form');
        postForm.style.display = "none";

        // Change title and store for Later
        const title = document.querySelector("#posts-title");
        const titleText = title.innerText;
        title.innerText = `${titleText} - Post`

        // Add a back button
        const backButton = document.createElement("button");
        backButton.setAttribute("class", "round-btn back-btn");
        //backButton.innerText = "Back to All Posts";
        const backBtnIcon = document.createElement("i");
        backBtnIcon.setAttribute("class", "bx bx-left-arrow-alt");
        backBtnIcon.setAttribute("aria-hidden", "true");
        backButton.prepend(backBtnIcon);
        const btnText = document.createElement("span");
        btnText.innerText = "Back to All Posts";
        backButton.append(btnText);
        parent.append(backButton);

        backButton.addEventListener("click", () => {
            container.classList.add("posts-container");
            allPosts.style.display = "block";
            sideBar.style.display = "block";
            postForm.style.display = "block";
            parent.style.display = "none";
            parent.innerText = "";
            title.innerText = titleText
        })

        const fullView = postView(post)
        const buttonsDiv = fullView.querySelector(".full-buttons-div")

        // Adding Like functionality
        const likeBtn = likePostButton(post, id, loggedInUser)
        buttonsDiv.append(likeBtn)
        parent.append(fullView);
        likeBtn.addEventListener("click", () => {
            like(likeBtn)
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

function like(button) {

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

function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function postView(post) {

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

    postParent.append(postUserDiv, postContentDiv, postTimestampDiv, buttonsDiv);

    return postParent;

}

function genreSideBarSelect() {

    const genres = {
        "Jazz": "JZ",
        "R&B / Soul": "RB",
        "Hip-Hop": "HH",
        "Classical": "IN",
        "Folk / Acoustic": "FK",
        "Indie / Alternative": "IE",
        "Pop": "PP"
    };

    const parent = document.querySelector("#side-view");

    const sidebarDiv = document.createElement("div");
    sidebarDiv.setAttribute("id", "genre-sidebar");
    //sidebarDiv.setAttribute("class", "posts-child");
    parent.append(sidebarDiv);

    const sidebarFS = document.createElement("fieldset");
    //sidebarFS.setAttribute("class", "genre-sidebar");
    sidebarDiv.append(sidebarFS);

    const allPostsDiv = document.createElement("div");
    allPostsDiv.setAttribute("class", "sb-genre-cont");
    const allPostsInput = document.createElement("input");
    allPostsInput.setAttribute("class", "sb-genre-item");
    allPostsInput.setAttribute("checked" ,"");
    allPostsInput.setAttribute("type", "radio");
    allPostsInput.setAttribute("name", "genre");
    allPostsInput.setAttribute("id", "all");
    allPostsInput.setAttribute("value", "All");
    const allPostsInputLabel = document.createElement("label");
    allPostsInputLabel.setAttribute("for", `all`);
    allPostsInputLabel.innerText = `All Posts`;
    allPostsInput.addEventListener("click", () => {

        const title = document.querySelector("#posts-title");
        title.innerText = "Home"
        loadPosts()

    });
    allPostsDiv.append(allPostsInput, allPostsInputLabel)
    sidebarFS.append(allPostsDiv)

    Object.entries(genres).forEach(genre => {

        const genreDiv = document.createElement("div");
        genreDiv.setAttribute("class", "sb-genre-cont")
        const genreInput = document.createElement("input");
        genreInput.setAttribute("class", "sb-genre-item");
        genreInput.setAttribute("type", "radio");
        genreInput.setAttribute("name", "genre");
        genreInput.setAttribute("id", `${genre[1]}`);
        genreInput.setAttribute("value", `${genre[1]}`);
        const genreInputLabel = document.createElement("label");
        genreInputLabel.setAttribute("for", `${genre[1]}`);
        genreInputLabel.innerText = `${genre[0]}`;

        genreInput.addEventListener("click", () => {

            const title = document.querySelector("#posts-title");
            title.innerText = `${genre[0]}`;
            loadPosts(genre[1]);

        });

        genreDiv.append(genreInput, genreInputLabel)
        sidebarFS.append(genreDiv)

    })

}