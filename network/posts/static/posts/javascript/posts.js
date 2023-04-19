document.addEventListener('DOMContentLoaded', function() {

    const postForm = document.querySelector('#post-form')
    if (postForm !== null) {
        loggedInUser = parseInt(postForm.dataset.user)
        const form = composePost();
        document.querySelector('#post-form').append(form);
    };

    const title = document.querySelector("#posts-title");
    if (title !== null && title.dataset.page === "all") {
        title.innerHTML = "Home"
        loadPosts();
        genreSideBarSelect();
    } else if (title !== null && title.dataset.page === "following") {
        title.innerHTML = "Following";
        loadPosts("following");
        const parent = document.querySelector(".posts-container");
        const side = document.querySelector("#side-view");
        parent.removeChild(side);
        document.querySelector("#posts-view").style.width = "100%";
        document.querySelector("#posts-cont").style.marginLeft = "0";
        document.querySelector("#posts-cont").style.padding = "0";
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

async function loadPosts(request="") {

    // Select posts div and empty it
    const parent = document.querySelector("#posts-view");
    parent.innerText = ""

    // Add link for skipping to main content
    const mainContentSkip = document.createElement("a");
    mainContentSkip.setAttribute("id", "maincontent");
    mainContentSkip.setAttribute("class", "main-skip");
    mainContentSkip.innerHTML = "Hello!"
    parent.append(mainContentSkip);

    if (request !== "following") {

    }

    const innerParent = document.createElement("div");
    innerParent.setAttribute("id", "posts-cont");
    innerParent.setAttribute("class", "posts-child container");
    parent.append(innerParent);

    // https://webdesign.tutsplus.com/tutorials/how-to-implement-a-load-more-button-with-vanilla-javascript--cms-42080
    let allPosts = null

    const postIncrease = 15;
    let currentPage = 1;

    if (request === "") {

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

    } else if (request === "following") {

        const response = await fetch(`/posts/api/following`)
        .then(response => response.json() )
        .then(json => {
            //allPosts = shuffleArray(JSON.parse(json))
            allPosts = JSON.parse(json)
            postLimit = allPosts.length
        })
        .catch(error => {
            console.log(error);
        });

    } else {

        const response = await fetch(`/posts/api/genre/${request}`)
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

            const postCard = completePostCard(allPosts[i]);
            innerParent.append(postCard);

        }
    };

    addPosts(currentPage);

    loadMoreDiv.append(loadMore);
    parent.append(loadMoreDiv);
    loadMore.addEventListener("click", () => {

        addPosts(currentPage + 1);

    });

}


function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function fullPostView(post) {

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
        title.innerText = "Home";
        loadPosts();

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

        genreDiv.append(genreInput, genreInputLabel);
        sidebarFS.append(genreDiv);

    })

}

function allPostsPostView () {

    const parent = document.querySelector('#post-view');
    const container = parent.parentElement
    container.classList.remove("posts-container");

    // Show the post full view and hide other posts
    parent.style.display = "block";

    const allPosts = document.querySelector('#posts-view');
    allPosts.style.display = "none";

    const sideBar = document.querySelector('#side-view');
    if (sideBar !== null) {
        sideBar.style.display = "none";
    };

    const postForm = document.querySelector('#post-form')
    if (postForm !== null) {
        postForm.style.display = "none";
    };

    // Change title and store for Later
    const title = document.querySelector("#posts-title");
    const titleText = title.innerText;
    title.innerText = `${titleText} - Post`;

    // Add a back button
    const backBtn = backButton("all", titleText);
    parent.append(backBtn);

}

function searchPostView() {

    const parent = document.querySelector('#post-view');
    const container = parent.parentElement
    container.classList.remove("posts-container");

    // Show the post full view and hide other posts
    parent.style.display = "block";

    const users = document.querySelector('#profiles-view');
    users.style.display = "none";
    const posts = document.querySelector('#search-posts-view');
    posts.style.display = "none";

    // Change title and store for Later
    const title = document.querySelector("#search-title");
    const titleText = title.innerText;
    title.innerText = `${titleText} - Post`;

    // Add a back button
    const backBtn = backButton("search", titleText);
    parent.append(backBtn);

}
