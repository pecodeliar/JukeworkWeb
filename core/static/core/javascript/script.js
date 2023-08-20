document.addEventListener('DOMContentLoaded', function() {

    const check = document.getElementById("user-menu");
    if (check !== null) {
        loggedInUser = parseInt(check.dataset.user);
    };

    if (sessionStorage.getItem("users") === null) {

        const setUsers = async () => {
            const users = await getUsers();
        }

        const waitForUsers = async() => {
            await setUsers();
        }

        waitForUsers();

    }

    const nav = document.querySelector('nav');
    nav.append(baseNavbar());

    const searchCheck = document.getElementById("search-cont");
    if (searchCheck !== null) {
        searchResults();
    };

});

// When back arrow is clicked, show previous section
window.onpopstate = function(event) {

    if (event.state.profile !== undefined) {
        console.log(event.state.profile)
        loadActions(event.state.view, event.state.profile);
    } else if (event.state.page !== null) {
        loadPosts(event.state.page);
    } else if (event.state.post !== null) {
        loadPosts(event.state.post);
    }

}

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

//https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript

function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
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
    brandLink.setAttribute("href", "/");
    brandLink.setAttribute("aria-label", "Home Page");
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


    // Search Bar
    const searchLi = searchBar();
    unOrLi.append(searchLi);

    // Dropdown

    // Check if user is logged in
    const check = document.getElementById("user-menu");
    if (check !== null) {
        const pDdLi = document.createElement("li");
        pDdLi.setAttribute("id", "nav-right");
        const profileDropdownDiv = profileDropdownMenu();
        pDdLi.append(profileDropdownDiv);
        unOrLi.append(pDdLi);
    } else {
        const signLi = document.createElement("li");
        signLi.setAttribute("id", "nav-right");

        // Make a sign in button
        const signInLink = document.createElement("a");
        signInLink.setAttribute("href", `/users/auth/login`);
        signInLink.setAttribute("class", "sign-in-link");
        signInLink.value = "Sign In";
        const signInIcon = document.createElement("i");
        signInIcon.setAttribute("class", "bx bx-log-in-circle");
        signInIcon.setAttribute("aria-hidden", "true");
        const signInText = document.createElement("p");
        signInText.setAttribute("class", "sign-in-text");
        signInText.innerText = "Log In"
        signInLink.append(signInIcon, signInText);

        // Make register button
        const registerLink = document.createElement("a");
        registerLink.setAttribute("href", `/users/auth/register`);
        registerLink.setAttribute("class", "sign-in-link");
        registerLink.setAttribute("id", "reg-link");
        registerLink.value = "Sign In"
        const registerIcon = document.createElement("i");
        registerIcon.setAttribute("class", "bx bx-user-plus");
        registerIcon.setAttribute("aria-hidden", "true");
        const registerText = document.createElement("p");
        registerText.setAttribute("class", "sign-in-text");
        registerText.innerText = "Register"
        registerLink.append(registerIcon, registerText);

        signLi.append(signInLink, registerLink);
        unOrLi.append(signLi);
    }

    return navBar;
}

function profileDropdownMenu() {

    const dropdownDiv = document.getElementById("user-menu");
    dropdownDiv.setAttribute("class", "pro-dropdown");
    dropdownDiv.setAttribute("aria-expanded", "false");

    // Button that once clicked will show dropdown
    const dropdownBtn = document.createElement("button");
    dropdownBtn.setAttribute("class", "drpdwn-btn");
    dropdownDiv.append(dropdownBtn);

    const dropdownCnt = document.createElement("div");
    dropdownCnt.setAttribute("id", "pro-dropdown-cnt");
    dropdownDiv.append(dropdownCnt);

    const profileLink = document.createElement("a");
    profileLink.setAttribute("class", "nav-dropdown-item");
    profileLink.setAttribute("href", `/users/${loggedInUser}`);
    profileLink.innerText = "Profile";
    const profileLinkIcon = document.createElement("i");
    profileLinkIcon.setAttribute("class", "bx bxs-user");
    profileLink.prepend(profileLinkIcon);
    dropdownCnt.append(profileLink);

    const followingLink = document.createElement("a");
    followingLink.setAttribute("class", "nav-dropdown-item");
    followingLink.setAttribute("href", `/following`);
    followingLink.innerText = "Following";
    const followingLinkIcon = document.createElement("i");
    followingLinkIcon.setAttribute("class", "bx bxs-group");
    followingLink.prepend(followingLinkIcon);
    dropdownCnt.append(followingLink);

    const settingsLink = document.createElement("a");
    settingsLink.setAttribute("class", "nav-dropdown-item");
    settingsLink.setAttribute("href", `/settings`);
    settingsLink.innerText = "Settings";
    const settingsLinkIcon = document.createElement("i");
    settingsLinkIcon.setAttribute("class", "bx bxs-cog");
    settingsLink.prepend(settingsLinkIcon);
    dropdownCnt.append(settingsLink);

    const logoutLink = document.createElement("a");
    logoutLink.setAttribute("class", "nav-dropdown-item");
    logoutLink.setAttribute("href", `/users/auth/logout`);
    logoutLink.innerText = "Logout";
    const logoutLinkIcon = document.createElement("i");
    logoutLinkIcon.setAttribute("class", "bx bxs-log-out");
    logoutLink.prepend(logoutLinkIcon);
    dropdownCnt.append(logoutLink);

    const user = JSON.parse(sessionStorage.getItem("users"))[loggedInUser];

    dropdownBtn.innerText = user.username;

    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "nav-bar-pfp round-pfp");
    const pfp = document.createElement("img");
    pfp.setAttribute("aria-hidden", "true");
    pfp.alt = "";
    pfp.src = user.profile_picture;
    pfpDiv.append(pfp);
    dropdownBtn.prepend(pfpDiv);

    const dropdownIcon = document.createElement("i");
    dropdownIcon.setAttribute("class", "bx bx-chevron-down profile-arw");
    dropdownIcon.setAttribute("aria-hidden", "true");
    dropdownBtn.append(dropdownIcon);

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

function searchBar() {

    const searchLi = document.createElement("li");
    searchLi.setAttribute("id", "nav-middle");

    const search = document.createElement("div");
    search.setAttribute("class", "search-bar");

    const searchForm = document.createElement("form");
    searchForm.setAttribute("action", "/search");
    searchForm.setAttribute("method", "GET");
    searchForm.setAttribute("id", "search-form");

    const searchInput = document.createElement("input");
    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("name", "q");
    searchInput.setAttribute("id", "search-inp");
    searchInput.setAttribute("placeholder", "Enter keyword to search");

    const searchFullLabel = document.createElement("label");
    searchFullLabel.setAttribute("for", "search-inp");
    searchFullLabel.setAttribute("id", "search-full-label");
    searchFullLabel.innerText = "Search for users or posts:";

    // Activated during media query
    const searchShortLabel = document.createElement("label");
    searchShortLabel.setAttribute("for", "search-inp");
    searchShortLabel.setAttribute("id", "search-short-label");
    searchShortLabel.innerText = "Search:";
    searchShortLabel.display = "none";

    const searchBtn = document.createElement("button");
    searchBtn.setAttribute("type", "submit");
    searchBtn.setAttribute("form", "search-form");
    searchBtn.setAttribute("value", "submit");
    searchBtn.setAttribute("class", "round-btn");
    searchBtn.setAttribute("id", "search-btn");

    const searchBtnText = document.createElement("p");
    searchBtnText.innerText = "Search";
    searchBtn.append(searchBtnText);

    const searchBtnIcon = document.createElement("i");
    searchBtnIcon.setAttribute("class", "bx bx-search-alt");
    searchBtnIcon.display = "none";
    searchBtn.append(searchBtnIcon);

    searchForm.append(searchFullLabel, searchShortLabel, searchInput, searchBtn);
    search.append(searchForm);
    searchLi.append(search);

    searchForm.addEventListener("submit", () => {
        console.log("Hello")
    })


    return searchLi;

}

async function getUsers() {

    /* Since this is just a mock and there is a limited set of users in the DB,
    this function is to just call them all at once, making their user id a key
    so that it is easy to fetch for sessionStorage later.*/


    if (sessionStorage.getItem("users") !== null) {
        return;
    }

    var userDict = {};

    fetch(`/users/api/users/`)
    .then(response => {
        if (response.ok) return response.json();
        return response.json().then(response => {throw new Error(response.error)})
    })
    .then(users => {

        //console.log(users.results)

        users.results.forEach(row => {
            //console.log(row.id)
            userDict[row.id] = row;
            // Since the id is already the key, it can be deleted from the obj
            delete userDict[row.id]["id"];
        })
        sessionStorage.setItem("users", JSON.stringify(userDict));

    })
    .catch(error => {
        console.log(error);
    });

    return;

}

getUsers().catch(error => {
    console.log(error);
});

async function getPosts(request="") {

    if (sessionStorage.getItem(`posts${request}`) !== null) {
        return;
    }

    // https://observablehq.com/@xari/paginated_fetch
    function paginated_fetch(
        url,
        page = 1,
        previousResponse = []
    ) {
        //console.log("in here")
        return fetch(`${url}?page=${page}`) // Append the page number to the base URL
        .then(response => response.json())
        .then(newResponse => {

            let response = null;

            if (request === "") {
                // Only the all the posts request has a results attribute
                response = [...previousResponse, ...newResponse.results];
            } else {
                response = [...previousResponse, ...newResponse];
            }

            if (newResponse.hasOwnProperty("next") && newResponse.next !== null) {
                page++;
                return paginated_fetch(url, page, response);
            }

            return response;
        })
        .catch(error => {
            console.log(error);
        });
    };

    paginated_fetch(`/posts/api/posts/${request}`).then(function(results) {

        var postDict = {};

        results.forEach((row, index) => {
            if (request === "posts") {
                postDict[row.id] = row;
                // Since the id is already the key, it can be deleted from the obj
                delete postDict[row.id]["id"];
            } else {
                postDict[index] = row;
            }
        });

        sessionStorage.setItem(`posts${request}`, JSON.stringify(postDict));

    });

    return;

}