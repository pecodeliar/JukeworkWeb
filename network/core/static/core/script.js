let loggedInBarUser = null

document.addEventListener('DOMContentLoaded', function() {

    const check = document.getElementById("user-menu");
    if (check !== null) {
        loggedInBarUser = parseInt(check.dataset.user)
    };

    const nav = document.querySelector('nav')
    nav.append(baseNavbar())

});

function baseNavbar() {

    const navBar = document.createElement("div");
    navBar.setAttribute("class", "nav-div");


    const unOrLi = document.createElement("ul");
    navBar.append(unOrLi);

    // Brand Div
    const brandLi = document.createElement("li");
    const brand = document.createElement("div");
    brand.setAttribute("class", "nb-brand");
    const brandLink = document.createElement("a");
    brandLink.setAttribute("href", "#");
    const brandIcon = document.createElement("i");
    brandIcon.setAttribute("class", "bx bxs-music brand-logo");
    brandIcon.setAttribute("aria-hidden", "true");
    const brandName = document.createElement("p");
    brandName.setAttribute("class", "brand-name");
    brandName.innerText = "Jukework";
    brandLink.append(brandIcon, brandName);
    brand.append(brandLink);
    brandLi.append(brand);
    unOrLi.append(brandLi);


    //const unOrLi = document.createElement("ul");
    //navBar.append(unOrLi);

    // Dropdown

    const gDdLi = document.createElement("li");
    const genreDropdownDiv = genreDropdownMenu();
    gDdLi.append(genreDropdownDiv);
    unOrLi.append(gDdLi);

    // Check if user is logged in
    const check = document.getElementById("user-menu");
    if (check !== null) {
        const pDdLi = document.createElement("li");
        pDdLi.setAttribute("id", "nav-right");
        const profileDropdownDiv = profileDropdownMenu();
        pDdLi.append(profileDropdownDiv);
        unOrLi.append(pDdLi);
    } else {
        // Make a sign in button
        const signLi = document.createElement("li");
        //const signInDiv = document.createElement("div");
        signLi.setAttribute("id", "nav-right");
        const signInLink = document.createElement("a");
        signInLink.setAttribute("href", `/users/login`);
        signInLink.setAttribute("class", "sign-in-link");
        signInLink.value = "Sign In"
        const signInIcon = document.createElement("i");
        signInIcon.setAttribute("class", "bx bx-user-circle");
        signInIcon.setAttribute("aria-hidden", "true");
        const signInText = document.createElement("p");
        signInText.setAttribute("class", "sign-in-text");
        signInText.innerText = "Log In"
        signInLink.append(signInIcon, signInText);
        //signInDiv.append(signInLink);
        signLi.append(signInLink);
        unOrLi.append(signLi);
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
    dropdownDiv.setAttribute("class", "nav-dropdown");

    // Span button that once clicked will show dropdown
    const dropdownBtn = document.createElement("input");
    dropdownBtn.setAttribute("type", "button");
    dropdownBtn.setAttribute("class", "drpdwn-btn");
    dropdownBtn.value = "Filter by Genres..."
    const dropdownIcon = document.createElement("i");
    dropdownIcon.setAttribute("class", "bx bx-chevron-down genre-arw");
    dropdownIcon.setAttribute("aria-hidden", "true");
    dropdownDiv.append(dropdownBtn, dropdownIcon);


    const dropdownCnt = document.createElement("div");
    dropdownCnt.setAttribute("id", "gnr-dropdown-cnt");
    dropdownDiv.append(dropdownCnt);

    Object.entries(genres).forEach(genre => {

        const genreLink = document.createElement("a");
        genreLink.setAttribute("class", "nav-dropdown-item");
        genreLink.setAttribute("href", `posts/${genre[1]}`);
        genreLink.innerText = genre[0]
        dropdownCnt.append(genreLink)

    })
    dropdownDiv.addEventListener("click", () => {
        dropdownCnt.style.display = "block";
        dropdownBtn.style.backgroundColor = "var(--accent)";
        dropdownDiv.style.backgroundColor = "var(--accent)";
    });

    // https://www.techiedelight.com/hide-div-click-outside-javascript/

    document.addEventListener('mouseup', function(e) {
        var container = document.getElementById('gnr-dropdown-cnt');
        if (!container.contains(e.target)) {
            container.style.display = 'none';
            dropdownBtn.style.backgroundColor = "";
            dropdownDiv.style.backgroundColor = "";
        }
    });


    return dropdownDiv;

}

function profileDropdownMenu() {

    const dropdownDiv = document.getElementById("user-menu");
    dropdownDiv.setAttribute("class", "pro-dropdown");

    // Span button that once clicked will show dropdown
    const dropdownBtn = document.createElement("input");
    dropdownBtn.setAttribute("type", "button");
    dropdownBtn.setAttribute("class", "drpdwn-btn");
    const dropdownIcon = document.createElement("i");
    dropdownIcon.setAttribute("class", "bx bx-chevron-down profile-arw");
    dropdownIcon.setAttribute("aria-hidden", "true");
    dropdownDiv.append(dropdownBtn, dropdownIcon);


    const dropdownCnt = document.createElement("div");
    dropdownCnt.setAttribute("id", "pro-dropdown-cnt");
    dropdownDiv.append(dropdownCnt);

    const profileLink = document.createElement("a");
    profileLink.setAttribute("class", "nav-dropdown-item");
    profileLink.setAttribute("href", `#`);
    profileLink.innerText = "Profile";
    dropdownCnt.append(profileLink);

    const followingLink = document.createElement("a");
    followingLink.setAttribute("class", "nav-dropdown-item");
    followingLink.setAttribute("href", `#`);
    followingLink.innerText = "Following";
    dropdownCnt.append(followingLink);

    const settingsLink = document.createElement("a");
    settingsLink.setAttribute("class", "nav-dropdown-item");
    settingsLink.setAttribute("href", `#`);
    settingsLink.innerText = "Settings";
    dropdownCnt.append(settingsLink);

    const logoutLink = document.createElement("a");
    logoutLink.setAttribute("class", "nav-dropdown-item");
    logoutLink.setAttribute("href", `/users/logout`);
    logoutLink.innerText = "Logout";
    dropdownCnt.append(logoutLink);

    // Get user information
    fetch(`/users/${loggedInBarUser}`)
    .then(response => response.json() )
    .then(user => {

        dropdownBtn.value = user.username;

    })
    .catch(error => {
        console.log(error);
    });

    dropdownDiv.addEventListener("click", () => {
        dropdownCnt.style.display = "block";
        dropdownBtn.style.backgroundColor = "var(--secondary)";
        dropdownDiv.style.backgroundColor = "var(--secondary)";
    });

    // https://www.techiedelight.com/hide-div-click-outside-javascript/

    document.addEventListener('mouseup', function(e) {
        var container = document.getElementById('pro-dropdown-cnt');
        if (!container.contains(e.target)) {
            container.style.display = 'none';
            dropdownBtn.style.backgroundColor = "";
            dropdownDiv.style.backgroundColor = "";
        }
    });


    return dropdownDiv;

}