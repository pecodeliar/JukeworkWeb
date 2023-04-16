let loggedInProUser = null

document.addEventListener('DOMContentLoaded', function() {

    const check = document.getElementById("user-menu");
    if (check !== null) {
        loggedInBarUser = parseInt(check.dataset.user)
    };

});