const profileId = parseInt(document.getElementById("profile-cont").dataset.profile);

document.addEventListener('DOMContentLoaded', function() {

    loadProfileInfo();
    profileNavBar();
    loadActions("posts");

});

function loadProfileInfo() {

    let fetchedUser = null;

    // Banner Display
    const bannerDiv = document.querySelector("#banner-row");
    const bannerImg = document.createElement("img");
    bannerImg.alt = "";
    bannerDiv.append(bannerImg);

    const parent = document.querySelector("#profile-view");

    // Top User Information Container
    const infoDiv = document.createElement("div");
    infoDiv.setAttribute("id", "profile-info-cont");
    parent.append(infoDiv);

    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "round-pfp");
    pfpDiv.setAttribute("id", "profile-info-pfp");
    const pfp = document.createElement("img");
    pfp.alt = "";
    pfpDiv.append(pfp);
    infoDiv.append(pfpDiv);

    // Div that will hold mostly text info and follow indications
    const textInfo = document.createElement("div");
    textInfo.setAttribute("class", "profile-info-text-cont");
    infoDiv.append(textInfo);

    // 1st mostly text div that should include username, follow button and follows you tag

    const firstTextDiv = document.createElement("div");
    firstTextDiv.setAttribute("class", "profile-info");
    firstTextDiv.setAttribute("id", "first-info");
    textInfo.append(firstTextDiv);

    const username = document.createElement("h1");
    username.setAttribute("id", "info-username");

    // Have to check if user is on their own profile. If so, add edit button, not follow
    const followBtn = document.createElement("button");
    followBtn.setAttribute("id", "profile-fllw-btn");
    followBtn.setAttribute("class", "round-btn");

    firstTextDiv.append(username, followBtn);

    // 2nd text div that should have post, follower and following count

    const secTextDiv = document.createElement("div");
    secTextDiv.setAttribute("class", "profile-info");
    secTextDiv.setAttribute("id", "sec-info");
    textInfo.append(secTextDiv);

    const postCount = document.createElement("p");
    postCount.setAttribute("class", "profile-count");

    const followerCount = document.createElement("p");
    followerCount.setAttribute("class", "profile-count");

    const followingCount = document.createElement("p");
    followingCount.setAttribute("class", "profile-count");

    secTextDiv.append(postCount, followerCount, followingCount);

    // 2nd text div that should have full name and genre

    const thirdTextDiv = document.createElement("div");
    thirdTextDiv.setAttribute("class", "profile-info");
    thirdTextDiv.setAttribute("id", "third-info");
    textInfo.append(thirdTextDiv);

    const fullname = document.createElement("p");
    fullname.setAttribute("id", "profile-full");

    const genre = document.createElement("p");
    genre.setAttribute("id", "profile-genre");

    thirdTextDiv.append(fullname, genre);


    // Get user information
    fetch(`api/profile/${profileId}`)
    .then(response => response.json() )
    .then(user => {

        fetchedUser = user;
        bannerImg.src = user.banner_url;
        pfp.src = user.pfp_url;
        username.innerText = user.username;
        followerCount.innerHTML = `${user.followers.length} followers`;
        followingCount.innerHTML = `${user.following.length} following`;
        fullname.innerText = user.first_name;
        genre.innerText = user.genre;

        // Check if logged in user follows and is followed by user
        if (loggedInUser !== null && loggedInUser in user.followers) {
            followBtn.innerHTML = "Unfollow";
        } else {
            followBtn.innerHTML = "Follow";
        }

    })
    .catch(error => {
        console.log(error);
    });

    // Check if profile follows logged in user
    /*fetch(`api/profile/${loggedInProUser}`)
    .then(response => response.json() )
    .then(user => {

        bannerImg.src = user.banner_url;
        pfp.src = user.pfp_url;
        username.innerText = user.username;

        // Check if logged in user follows and is followed by user
        if (loggedInProUser in user.followers) {
            followBtn.innerHTML = "Unfollow";
        } else {
            followBtn.innerHTML = "Follow";
        }

    })
    .catch(error => {
        console.log(error);
    });*/

    fetch(`api/profile/${profileId}/posts`)
    .then(response => response.json())
    .then(json => {

        const data = JSON.parse(json)
        postCount.innerHTML = `${data.length} posts`;


    });

}

function profileNavBar() {

    const nav = document.querySelector("#profile-nav");

    const navBar = document.createElement("div");
    navBar.setAttribute("id", "profile-nav-bar");
    nav.append(navBar);

    const unOrLi = document.createElement("ul");
    navBar.append(unOrLi);

    // Posts
    const postsLi = document.createElement("li");
    const postsBtn = document.createElement("button");
    postsBtn.setAttribute("class", "profile-nav-btn");
    postsBtn.setAttribute("id", "profile-nav-posts-btn");
    postsBtn.innerText = "Posts";
    postsBtn.style.backgroundColor = "grey";
    const postsBtnIcon = document.createElement("i");
    postsBtnIcon.setAttribute("class", "bx bx-grid");
    postsBtnIcon.setAttribute("aria-hidden", "true");
    postsBtn.prepend(postsBtnIcon);
    postsLi.append(postsBtn);

    // Comments
    const commentsLi = document.createElement("li");
    const commentsBtn = document.createElement("button");
    commentsBtn.setAttribute("class", "profile-nav-btn");
    commentsBtn.setAttribute("id", "profile-nav-comments-btn");
    commentsBtn.innerText = "Comments";
    const commentsBtnIcon = document.createElement("i");
    commentsBtnIcon.setAttribute("class", "bx bx-message-rounded");
    commentsBtnIcon.setAttribute("aria-hidden", "true");
    commentsBtn.prepend(commentsBtnIcon);
    commentsLi.append(commentsBtn);

    // Likes
    const likesLi = document.createElement("li");
    const likesBtn = document.createElement("button");
    likesBtn.setAttribute("class", "profile-nav-btn");
    likesBtn.setAttribute("id", "profile-nav-likes-btn");
    likesBtn.innerText = "Likes";
    const likesBtnIcon = document.createElement("i");
    likesBtnIcon.setAttribute("class", "bx bx-heart");
    likesBtnIcon.setAttribute("aria-hidden", "true");
    likesBtn.prepend(likesBtnIcon);
    likesLi.append(likesBtn);

    unOrLi.append(postsLi, commentsLi, likesLi);

    // Use buttons to toggle between views
    postsBtn.addEventListener('click', () => {
        loadActions("posts");
        postsBtn.style.backgroundColor = "grey";
        commentsBtn.style.backgroundColor = "";
        likesBtn.style.backgroundColor = "";
    });
    commentsBtn.addEventListener('click', () => {
        loadActions("comments");
        postsBtn.style.backgroundColor = "";
        commentsBtn.style.backgroundColor = "grey";
        likesBtn.style.backgroundColor = "";
    });
    likesBtn.addEventListener('click', () => {
        loadActions("likes");
        postsBtn.style.backgroundColor = "";
        commentsBtn.style.backgroundColor = "";
        likesBtn.style.backgroundColor = "grey";
    });

}

function loadActions(type) {

    const actionsDiv = document.querySelector("#profile-actions");
    actionsDiv.innerHTML = "";

    fetch(`api/profile/${profileId}/${type}`)
    .then(response => response.json())
    .then(json => {

        const data = JSON.parse(json)
        if (data.length === 0) {

            const notifyNone = document.createElement("p");
            notifyNone.setAttribute("id", "profile-creations-none");
            notifyNone.innerText = `This user has no ${type}.`;
            actionsDiv.append(notifyNone);

        } else {

            data.forEach(item => {

                const postCard = postElement(item.fields, item.pk)
                const help = likePostButton(item.fields, item.pk, loggedInUser)
                postCard.querySelector(".misc-div").append(help)
                actionsDiv.append(postCard)
                help.addEventListener("click", () => {
                    like(help)
                })

            })

        }

    });

}