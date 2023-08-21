document.addEventListener('DOMContentLoaded', function() {

    const title = document.querySelector("#posts-title");

    if (title !== null && title.dataset.page === "all") {

        title.innerHTML = "Home";
        loadPosts();
        genreSideBarSelect();

    } else if (title !== null && title.dataset.page !== "all" && title.dataset.page !== "following" && title.dataset.page !== "post") {

        const genres = {
            "JZ": "Jazz",
            "RB": "R&B / Soul",
            "HH": "Hip-Hop",
            "IN": "Classical",
            "FK": "Folk / Acoustic",
            "IE": "Indie / Alternative",
            "PP": "Pop"
        };

        title.innerHTML = genres[title.dataset.page];
        loadPosts(title.dataset.page);
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
        const postId = document.getElementById("post-view").dataset.postReq;

        if (sessionData.getItem("posts") === null) {

            const setPosts = async () => {
                await getPosts(request);
            }

            const waitForPosts = async() => {
                await setPosts();

            }
            waitForPosts();

        }

        const gettingPosts = async () => {

            fetch(`/posts/api/posts/${postId}/comments`)
            .then(response => response.json() )
            .then(comments => {

                fullPostView(post, comments.results);

            })
            .catch(error => {
                console.log(error);
            });

        }

        setTimeout(gettingPosts, 2000);

    };

    const makePostForm = async () => {

        const postForm = document.querySelector('#post-form')
        if (postForm !== null) {
            const form = compose("post");
            document.querySelector('#post-form').append(form);
        };

    }

    setTimeout(makePostForm, 3000);

});

async function loadPosts(request="") {

    //console.log(request)

    if (!history.state || window.location.pathname !== `/posts/${request}`) {
        window.history.pushState({page: request}, '', `/posts/${request}`);
    }

    document.getElementById("post-view").style.display = "none";
    const pageTitle = document.getElementById("posts-title");
    if (pageTitle.innerText.includes("Post")) {
        // Removing the world post inluding the dash and spaces
        document.getElementById("posts-title").innerText = pageTitle.innerText.slice(0,-7);
    };
    // Select posts div and empty it
    const parent = document.getElementById("posts-view");
    parent.style.display = "";
    parent.innerText = "";
    // Need to make sure this is here since the class if removed for post detail views
    const parentCont = parent.parentElement;
    parentCont.classList.add("posts-container");

    const postForm = document.querySelector('#post-form');
    if (postForm !== null) {
        postForm.style.display = "block";
    };

    const sidebar = document.getElementById("side-view");
    if (sidebar !== null) {
        sidebar.style.display = "block";
    }

    const innerParent = document.createElement("div");
    innerParent.setAttribute("id", "posts-cont");
    innerParent.setAttribute("class", "posts-child container");
    parent.append(innerParent);

    // https://webdesign.tutsplus.com/tutorials/how-to-implement-a-load-more-button-with-vanilla-javascript--cms-42080
    let allPosts = null;

    const postIncrease = 15;
    let currentPage = 1;

    if (sessionStorage.getItem(`posts${request}`) === null) {

        const setPosts = async () => {
            await getPosts(request);
            setTimeout(getPosts, 5000);
        }

        const waitForPosts = async() => {
            await setPosts();

        }
        waitForPosts();

    }

    const gettingPosts = async () => {

        const posts = JSON.parse(sessionStorage.getItem(`posts${request}`));

        if (Object.keys(posts).length > 0) {
            allPosts = posts;
        }
        postLimit = Object.keys(allPosts).length - 1;

        // Load More Button
        const loadMoreDiv = document.createElement("div");
        loadMoreDiv.setAttribute("id", "load-btn-div");
        const loadMore = document.createElement("button");
        loadMore.setAttribute("id", "load-btn");
        loadMore.setAttribute("class", "")
        loadMore.innerText = "Load More Posts";

        if (Object.keys(allPosts).length > 0) {

            const addPosts = (pageIndex) => {

                currentPage = pageIndex;

                const startRange = (pageIndex - 1) * postIncrease;
                let endRange = pageIndex * postIncrease;

                if (Object.keys(allPosts).length - 1 < endRange) {
                    endRange = Object.keys(allPosts).length;
                    loadMore.classList.add("disabled");
                    loadMore.setAttribute("disabled", true);
                    loadMore.innerText = "No More Posts";
                }

                for (const key in allPosts) {
                    const postCard = completeCard("post", allPosts[key]);
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

    }

    setTimeout(gettingPosts, 2000);

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
    parent.append(sidebarDiv);

    const sidebarFS = document.createElement("fieldset");
    sidebarDiv.append(sidebarFS);

    const legend = document.createElement("legend");
    sidebarFS.append(legend);
    legend.innerText = "Filter By Genre:";

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
            title.dataset.page = `${genre[1]}`;
            loadPosts(genre[1]);

        });

        genreDiv.append(genreInput, genreInputLabel);
        sidebarFS.append(genreDiv);

    })

}

function allPostsPostView (singlePage=true) {

    const parent = document.querySelector('#post-view');
    const container = parent.parentElement;
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
    let backBtn = null;
    if (singlePage === true) {
        backBtn = backButton(title.dataset.page, window.location.pathname, titleText);
    } else {
        backBtn = backButton("render", window.location.pathname, "All Posts");
    }
    parent.append(backBtn);

}