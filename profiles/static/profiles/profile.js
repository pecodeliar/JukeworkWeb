document.addEventListener('DOMContentLoaded', function() {

    const check = document.getElementById("user-menu");
    if (check !== null) {
        loggedInUser = parseInt(check.dataset.user);
    };

    const profileId = parseInt(document.getElementById("profile-cont").dataset.profile);

    loadProfileInfo(profileId);
    profileNavBar(profileId);
    loadActions("posts", profileId);

});

function loadProfileInfo(profileId) {

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
    const followEditBtn = document.createElement("button");
    followEditBtn.setAttribute("id", "profile-fllw-btn");
    followEditBtn.setAttribute("class", "round-btn");

    firstTextDiv.append(username, followEditBtn);

    // 2nd text div that should have post, follower and following count

    const secTextDiv = document.createElement("div");
    secTextDiv.setAttribute("class", "profile-info");
    secTextDiv.setAttribute("id", "sec-info");
    textInfo.append(secTextDiv);

    const postCount = document.createElement("p");
    postCount.setAttribute("class", "profile-count");

    const followerCount = document.createElement("p");
    followerCount.setAttribute("class", "profile-count");
    followerCount.setAttribute("id", "followers-cnt");

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
    fetch(`/profiles/api/profile/${profileId}`)
    .then(response => response.json() )
    .then(user => {

        fetchedUser = user;
        bannerImg.src = user.banner_url;
        pfp.src = user.pfp_url;
        username.innerText = user.username;
        followerCount.innerText = `${user.followers.length} followers`;
        followingCount.innerText = `${user.following.length} following`;
        fullname.innerText = user.first_name;
        genre.innerText = user.genre;

        // Check if logged in user is profile or follows and is followed by user
        if (loggedInUser === user.id) {

            followEditBtn.innerText = "Edit Profile";
            followEditBtn.addEventListener('click', () => editProfile());

        } else if (loggedInUser !== null && user.followers.includes(loggedInUser)) {

            followEditBtn.innerText = "Unfollow";
            followEditBtn.addEventListener('click', () => follow(followEditBtn));

        } else {

            followEditBtn.innerText = "Follow";
            followEditBtn.addEventListener('click', () => follow(followEditBtn));

        }


        // Check if profile user follows logged in user
        if (user.following.includes(loggedInUser)) {
            // Tag for if the profile visiting follows logged in user
            const followsTag = document.createElement("p");
            followsTag.setAttribute("id", "follows-tag");
            followsTag.setAttribute("class", "tag");
            followsTag.innerText = "Follows You";
            firstTextDiv.append(followsTag);
        }

    })
    .catch(error => {
        console.log(error);
    });

    fetch(`/profiles/api/profile/${profileId}/posts`)
    .then(response => response.json())
    .then(json => {

        const data = JSON.parse(json)
        postCount.innerText = `${data.length} posts`;

    });

}

function profileNavBar(profileId) {

    const nav = document.querySelector("#profile-nav");

    const navBar = document.createElement("div");
    navBar.setAttribute("id", "profile-nav-bar");
    nav.append(navBar);

    const unOrLi = document.createElement("ul");
    navBar.append(unOrLi);

    // Posts
    const postsLi = document.createElement("li");
    const postsBtn = document.createElement("a");
    postsBtn.setAttribute("class", "profile-nav-btn");
    postsBtn.setAttribute("id", "profile-nav-posts-btn");
    postsBtn.innerText = "Posts";
    postsBtn.style.borderBottom = "solid white 1px";
    const postsBtnIcon = document.createElement("i");
    postsBtnIcon.setAttribute("class", "bx bx-grid");
    postsBtnIcon.setAttribute("aria-hidden", "true");
    postsBtn.prepend(postsBtnIcon);
    postsLi.append(postsBtn);

    // Comments
    const commentsLi = document.createElement("li");
    const commentsBtn = document.createElement("a");
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
    const likesBtn = document.createElement("a");
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
        loadActions("posts", profileId);
        postsBtn.style.borderBottom = "solid white 1px";
        likesBtn.style.borderBottom = "";
        commentsBtn.style.borderBottom = "";
    });
    commentsBtn.addEventListener('click', () => {
        loadActions("comments", profileId);
        postsBtn.style.borderBottom = "";
        likesBtn.style.borderBottom = "";
        commentsBtn.style.borderBottom = "solid white 1px";
    });
    likesBtn.addEventListener('click', () => {
        loadActions("likes", profileId);
        postsBtn.style.borderBottom = "";
        likesBtn.style.borderBottom = "solid white 1px";
        commentsBtn.style.borderBottom = "";
    });

}

function loadActions(type, profileId) {
    console.log(profileId)

    const actionsDiv = document.getElementById("profile-actions");
    actionsDiv.innerText = "";

    if (!history.state || window.location.pathname !== `/profiles/${profileId}/${type}`) {
        window.history.pushState({view: type, profile: profileId}, '', `/profiles/${profileId}/${type}`);
    };

    const oldIndicator = document.querySelector('a[style*="border-bottom: 1px solid white;"]');
    if (oldIndicator !== null) {
        oldIndicator.style.borderBottom = "";
    }
    const newIndicator = document.getElementById(`profile-nav-${type}-btn`);
    newIndicator.style.borderBottom = "solid white 1px";

    if (loggedInUser === profileId && type === "posts") {
        const postForm = compose("post");
        postForm.classList.add("profile-post-form");
        actionsDiv.append(postForm);
    }

    fetch(`/profiles/api/profile/${profileId}/${type}`)
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

                const postCard = completeCard("post", item);
                actionsDiv.append(postCard);

            });

        };

    });

}

function follow (button, id) {

    const csrftoken = getCookie('csrftoken');
    console.log(button.innerText)

    fetch(`/profiles/api/follow`, {
        method: 'PUT',
        headers: {'X-CSRFToken': csrftoken},
        body: JSON.stringify({
            profile_id: profileId,
            follower: loggedInUser,
            action: button.innerText
        })
    }).then(() => {
            console.log("In then statement")
            const count = document.querySelector('#followers-cnt').innerText.split(" ");
            var count_num = parseInt(count[0]);
            console.log(count_num)


            if (button.value == "Unfollow") {
                button.innerText = "Follow";
                document.querySelector('#followers-cnt').innerText = (count_num-=1) + " " + count[1]
            } else {
                button.innerText = "Unfollow";
                document.querySelector('#followers-cnt').innerText = (count_num+=1) + " " + count[1]
            };
    });

}

function profilePostView() {

    const parent = document.querySelector('#post-view');

    // Show the post full view and hide other posts
    parent.style.display = "block";

    const info = document.querySelector('#profile-view');
    info.style.display = "none";
    const nav = document.querySelector('#profile-nav');
    nav.style.display = "none";
    const action = document.querySelector('#profile-actions');
    action.style.display = "none";

    // Change title and store for Later
    const user = document.querySelector("#info-username");
    //const titleText = title.innerText;
    //title.innerText = `Profile - Post`;

    // Add a back button
    const backBtn = backButton("profile", window.location.pathname, user.innerText);
    parent.append(backBtn);

}