let loggedInProUser = null

document.addEventListener('DOMContentLoaded', function() {

    const check = document.getElementById("profile-view").dataset.user;
    if (check !== undefined) {
        loggedInProUser = parseInt(check)
    };

    loadProfile();

});

function loadProfile() {

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
    fetch(`api/profile/21`)
    .then(response => response.json() )
    .then(user => {

        console.log(user)

        fetchedUser = user;
        bannerImg.src = user.banner_url;
        pfp.src = user.pfp_url;
        username.innerText = user.username;
        postCount.innerHTML = `0 posts`;
        followerCount.innerHTML = `${user.followers.length} followers`;
        followingCount.innerHTML = `${user.following.length} following`;
        fullname.innerText = user.first_name;
        genre.innerText = user.genre;

        // Check if logged in user follows and is followed by user
        if (loggedInProUser !== null && loggedInProUser in user.followers) {
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

}