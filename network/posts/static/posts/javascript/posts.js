// When back arrow is clicked, show previous section
window.onpopstate = function() {
    console.log("Pop state initiated");
 }

document.addEventListener('DOMContentLoaded', function() {

    const postForm = document.querySelector('#post-form')
    if (postForm !== null) {
        loggedInUser = parseInt(postForm.dataset.user);
        const form = compose("post");
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

    } else if (title !== null && title.dataset.page === "post") {

        title.innerHTML = "";
        // Slicing 'posts/post/' which is 12 characters out of pathname and converting to int
        const post_id = window.location.pathname.slice(12);

        fetch(`/posts/api/post/${post_id}`)
        .then(response => response.json() )
        .then(json => {

            const post = JSON.parse(json);

            fetch(`/posts/api/post/${post_id}/comments`)
            .then(response => response.json() )
            .then(json => {

                const comments = JSON.parse(json);

                fullPostView(post[0].fields, post[0].id, comments);



            })
            .catch(error => {
                console.log(error);
            });

        })
        .catch(error => {
            console.log(error);
        });

        //fullPostView(post, id, comments);

    };

});

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

            const postCard = completeCard("post", allPosts[i]);
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

function allPostsPostView (singlePage=true) {

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
    if (singlePage === true) {
        title.innerText = `${titleText} - Post`;
    } else {
        title.innerText = `Post`;
    }
    // Add a back button
    let backBtn = null
    if (singlePage === true) {
        backBtn = backButton("all", window.location.pathname, titleText);
    } else {
        backBtn = backButton("render", window.location.pathname, "All Posts");
    }
    parent.append(backBtn);

}