function searchResults() {

    const search = document.querySelector("#search-cont").dataset.query;

    const navBar = document.querySelector("header");
    const searchTitle = document.createElement("h1");
    searchTitle.setAttribute("class", "container");
    searchTitle.setAttribute("id", "search-title");
    searchTitle.innerText = `Search results for "${search}"...`;
    navBar.after(searchTitle);

    const usersDiv = document.querySelector("#profiles-view");
    usersDiv.innerHTML = "";
    const usersTitle = document.createElement("h2");
    usersTitle.setAttribute("id", "search-users-title");
    usersTitle.setAttribute("class", "search-htwo-title");
    usersTitle.innerText = "Users";
    usersDiv.append(usersTitle)

    const postsDiv = document.querySelector("#search-posts-view");
    postsDiv.innerHTML = "";
    const postsTitle = document.createElement("h2");
    postsTitle.setAttribute("id", "search-posts-title");
    postsTitle.setAttribute("class", "search-htwo-title");
    postsTitle.innerText = "Posts";
    postsDiv.append(postsTitle);

    const csrftoken = getCookie('csrftoken');

    // Getting search results
    fetch(`api/search/${search}`)
    .then(response => response.json())
    .then(json => {

        console.log(json)

        if (json.users.length === 0) {

            const notifyNone = document.createElement("p");
            notifyNone.setAttribute("id", "profile-creations-none");
            notifyNone.innerText = `No users match this search.`;
            usersDiv.append(notifyNone);

        } else {

            json.users.forEach(user => {

                const card = userCard(user);
                usersDiv.append(card);

            })
        }

        if (json.posts.length === 0) {

            const notifyNone = document.createElement("p");
            notifyNone.setAttribute("id", "profile-creations-none");
            notifyNone.innerText = `No posts match this search.`;
            postsDiv.append(notifyNone);

        } else {

            json.posts.forEach(postId => {

                const posts = JSON.parse(sessionStorage.getItem("posts"));
                let postData = null;
                for (const key in posts) {
                    if (posts[key].id === postId) {
                        postData = posts[key];
                        console.log(postData)
                        break;
                    }
                }

                const postCard = completeCard("post", postData);
                postsDiv.append(postCard);

            })
        }

    })
    .catch(error => {
        console.log(error);
    });

}

function userCard(userId) {

    const user = JSON.parse(sessionStorage.getItem("users"))[userId];

    // Make parent
    const userLink = document.createElement("a");
    userLink.setAttribute("href", `/users/${userId}`);
    userLink.setAttribute("class", "search-user-link");
    const card = document.createElement("div");
    card.setAttribute("class", "user-card");
    userLink.append(card)


    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "round-pfp search-user-pfp");
    const pfp = document.createElement("img");
    pfp.src = user.profile_picture;
    pfp.alt = "";
    pfpDiv.append(pfp);

    // Top of the card with user's names and post creation date
    const infoDiv = document.createElement("div");
    infoDiv.setAttribute("class", "search-user-info");
    const fullname = document.createElement("p");
    fullname.setAttribute("class", "post-full-name");
    fullname.innerText = user.first_name;
    const username = document.createElement("p");
    username.setAttribute("class", "post-user-create");
    username.innerText = `@${user.username}`;
    infoDiv.append(fullname, username);


    card.append(pfpDiv, infoDiv);

    return userLink;

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