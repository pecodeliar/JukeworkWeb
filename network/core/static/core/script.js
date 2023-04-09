let loggedInUser = null

document.addEventListener('DOMContentLoaded', function() {

    console.log("Hello")

    const nav = document.querySelector('nav')
    nav.append(baseNavbar())

    /*const postForm = document.querySelector('#post-form')
    if (postForm !== null) {
        loggedInUser = parseInt(postForm.dataset.user)
        const form = composePost();
        document.querySelector('#post-form').append(form);
    };

    const article = document.querySelector("#electric-cars");

    loadPosts();*/
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
    brand.append(brandLink, brandIcon, brandName);
    navBar.append(brand);


    //const unOrLi = document.createElement("ul");
    //navBar.append(unOrLi);

    // Dropdown

    const dropdownDiv = genreDropdownMenu();



    navBar.append(dropdownDiv);
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
    const dropdownSpan = document.createElement("span");
    dropdownSpan.setAttribute("class", "genre-span");
    const dropdownBtn = document.createElement("input");
    dropdownBtn.setAttribute("type", "button");
    dropdownBtn.setAttribute("class", "genre-btn");
    dropdownBtn.value = "Filter by Genres..."
    const dropdownIcon = document.createElement("i");
    dropdownIcon.setAttribute("class", "bx bx-chevron-down genre-arw");
    dropdownSpan.append(dropdownBtn, dropdownIcon);
    dropdownDiv.append(dropdownSpan);


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
    dropdownSpan.addEventListener("click", () => {
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