function searchResults() {

    const search = document.querySelector("#search-cont").dataset.query;

    const searchBody = document.querySelector("body");
    const searchTitle = document.createElement("h1");
    searchTitle.setAttribute("class", "container");
    searchTitle.setAttribute("id", "search-title");
    searchTitle.innerText = `Search results for "${search}"...`;
    searchBody.prepend(searchTitle);

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
    postsDiv.append(postsTitle)

    // Get user results
    fetch(`api/search/users/${search}`)
    .then(response => response.json() )
    .then(json => {

        if (json.length === 0) {

            const notifyNone = document.createElement("p");
            notifyNone.setAttribute("id", "profile-creations-none");
            notifyNone.innerText = `No users match this search.`;
            usersDiv.append(notifyNone);

        } else {

            json.forEach(user => {

                const card = userCard(user);
                usersDiv.append(card);

            })
        }

    })
    .catch(error => {
        console.log(error);
    });


    // Get post results
    fetch(`api/search/posts/${search}`)
    .then(response => response.json() )
    .then(json => {

        const data = JSON.parse(json)
        if (data.length === 0) {

            const notifyNone = document.createElement("p");
            notifyNone.setAttribute("id", "profile-creations-none");
            notifyNone.innerText = `No posts match this search.`;
            postsDiv.append(notifyNone);

        } else {

            data.forEach(post => {

                const postCard = completePostCard(post);
                postCard.classList.remove("post-card");
                postCard.classList.add("search-post-card");
                postsDiv.append(postCard);

            })
        }

    })
    .catch(error => {
        console.log(error);
    });

}

function userCard(user) {

    // Make parent
    const userLink = document.createElement("a");
    userLink.setAttribute("href", `profiles/${user.id}`);
    userLink.setAttribute("class", "search-user-link");
    const card = document.createElement("div");
    card.setAttribute("class", "user-card");
    userLink.append(card)


    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "round-pfp search-user-pfp");
    const pfp = document.createElement("img");
    pfp.src = user.pfp_url;
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