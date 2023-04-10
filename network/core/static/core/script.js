let loggedInBarUser = null

document.addEventListener('DOMContentLoaded', function() {

    const nav = document.querySelector('nav')
    nav.append(baseNavbar())

    const check = document.getElementById("user-menu");
    if (check !== null) {
        loggedInBarUser = parseInt(check.dataset.user)
    };

    //baseNavbar();

});

function baseNavbar() {

    const navBar = document.createElement("div");
    navBar.setAttribute("class", "nav-div");

    // Brand Div
    const brand = document.createElement("div");
    brand.setAttribute("class", "nb-brand");
    const brandLink = document.createElement("a");
    brandLink.setAttribute("href", "#");
    const brandIcon = document.createElement("i");
    brandIcon.setAttribute("class", "bx bxs-music brand-logo");
    const brandName = document.createElement("p");
    brandName.setAttribute("class", "brand-name");
    brandName.innerText = "Jukework";
    brandLink.append(brandIcon, brandName);
    brand.append(brandLink);
    navBar.append(brand);


    //const unOrLi = document.createElement("ul");
    //navBar.append(unOrLi);

    // Dropdown

    const genreDropdownDiv = genreDropdownMenu();
    navBar.append(genreDropdownDiv);

    // Check if user is logged in
    const check = document.getElementById("user-menu");
    if (check !== null) {
        const profileDropdownDiv = profileDropdownMenu();
        navBar.append(profileDropdownDiv);
    } else {
        // Make a sign in button
        const signInDiv = document.createElement("div");
        signInDiv.setAttribute("class", "nav-right");
        const signInLink = document.createElement("a");
        signInLink.setAttribute("href", `/users/login`);
        signInLink.setAttribute("class", "sign-in-link");
        signInLink.value = "Sign In"
        const signInIcon = document.createElement("i");
        signInIcon.setAttribute("class", "bx bx-user-circle");
        const signInText = document.createElement("p");
        signInText.setAttribute("class", "sign-in-text");
        signInText.innerText = "Log In"
        signInLink.append(signInIcon, signInText);
        signInDiv.append(signInLink);
        navBar.append(signInDiv);
    }

    return navBar;
}

function genreDropdownMenu() {

    const genres = {
        "Jazz": "JZ",
        "R&B / Soul": "RB",
        "Hip-Hop": "HH",
        "Classical": "IN",
        "Folk / Acoustic": "FK",
        "Indie / Alternative": "IE",
        "Pop": "PP"
    };

    const dropdownDiv = document.createElement("div");
    dropdownDiv.setAttribute("class", "gnr-dropdown");

    // Span button that once clicked will show dropdown
    const dropdownBtn = document.createElement("input");
    dropdownBtn.setAttribute("type", "button");
    dropdownBtn.setAttribute("class", "genre-btn");
    dropdownBtn.value = "Filter by Genres..."
    const dropdownIcon = document.createElement("i");
    dropdownIcon.setAttribute("class", "bx bx-chevron-down genre-arw");
    dropdownDiv.append(dropdownBtn, dropdownIcon);


    const dropdownCnt = document.createElement("div");
    dropdownCnt.setAttribute("id", "gnr-dropdown-cnt");
    dropdownDiv.append(dropdownCnt);

    Object.entries(genres).forEach(genre => {

        const genreLink = document.createElement("a");
        genreLink.setAttribute("class", "gnr-dropdown-item");
        genreLink.setAttribute("href", `posts/${genre[1]}`);
        genreLink.innerText = genre[0]
        dropdownCnt.append(genreLink)

    })
    dropdownDiv.addEventListener("click", () => {
        dropdownCnt.style.display = "block";
    });

    // https://www.techiedelight.com/hide-div-click-outside-javascript/

    document.addEventListener('mouseup', function(e) {
        var container = document.getElementById('gnr-dropdown-cnt');
        if (!container.contains(e.target)) {
            container.style.display = 'none';
        }
    });


    return dropdownDiv;

}

function profileDropdownMenu() {

    const dropdownDiv = document.getElementById("user-menu");
    dropdownDiv.setAttribute("class", "pro-dropdown");

    // Span button that once clicked will show dropdown
    const dropdownSpan = document.createElement("span");
    dropdownSpan.setAttribute("class", "profile-span");
    const dropdownBtn = document.createElement("input");
    dropdownBtn.setAttribute("type", "button");
    dropdownBtn.setAttribute("class", "profile-btn");
    dropdownBtn.value = "Uh Oh"
    const dropdownIcon = document.createElement("i");
    dropdownIcon.setAttribute("class", "bx bx-chevron-down profile-arw");
    dropdownSpan.append(dropdownBtn, dropdownIcon);
    dropdownDiv.append(dropdownSpan);


    const dropdownCnt = document.createElement("div");
    dropdownCnt.setAttribute("id", "pro-dropdown-cnt");
    dropdownDiv.append(dropdownCnt);

    const profileLink = document.createElement("a");
    profileLink.setAttribute("class", "pro-dropdown-item");
    profileLink.setAttribute("href", `#`);
    profileLink.innerText = "Profile"
    dropdownCnt.append(profileLink)

    const followingLink = document.createElement("a");
    followingLink.setAttribute("class", "pro-dropdown-item");
    followingLink.setAttribute("href", `#`);
    followingLink.innerText = "Profile"
    dropdownCnt.append(followingLink)

    const settingsLink = document.createElement("a");
    settingsLink.setAttribute("class", "pro-dropdown-item");
    settingsLink.setAttribute("href", `#`);
    settingsLink.innerText = "Settings"
    dropdownCnt.append(settingsLink)

    const logoutLink = document.createElement("a");
    logoutLink.setAttribute("class", "pro-dropdown-item");
    logoutLink.setAttribute("href", `/users/logout`);
    logoutLink.innerText = "Logout"
    dropdownCnt.append(logoutLink)

    dropdownSpan.addEventListener("click", () => {
        dropdownCnt.style.display = "block";
    });

    // https://www.techiedelight.com/hide-div-click-outside-javascript/

    document.addEventListener('mouseup', function(e) {
        var container = document.getElementById('pro-dropdown-cnt');
        if (!container.contains(e.target)) {
            container.style.display = 'none';
        }
    });


    return dropdownDiv;

}