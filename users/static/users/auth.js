document.addEventListener('DOMContentLoaded', function() {

    const title = document.querySelector("title").innerText;
    if (title.includes("Login")) {
        loginForm();
    } else if (title.includes("Register")) {
        registerForm();
    }


});

function loginForm() {

    // Changing style of body so that div can be vertically centered
    //document.querySelector("body").style.height = "calc(100% - 55px)";

    const title = document.querySelector(".auth-title");
    title.innerText = "Login";
    const parent = document.getElementById("login-view");
    document.getElementById("register-view").style.display = "none";

    const form = document.createElement("form");
    parent.append(form);
    form.setAttribute("onsubmit", "event.preventDefault();");

    const usernameDiv = labelAndInput("username", "Username:", "Enter username...", "bx bxs-user", autofocus=true);
    form.append(usernameDiv);

    const passwordDiv = labelAndInput("password", "Password:", "Enter password...", "bx bxs-lock-alt");
    form.append(passwordDiv);

    const submitBtn = document.createElement("button");
    form.append(submitBtn);
    submitBtn.setAttribute("class", "round-btn auth-btn");
    submitBtn.innerText = "Login";
    submitBtn.addEventListener("click", () => {

        const csrftoken = getCookie('csrftoken');

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        fetch(`/users/api/auth/login`, {
            method: 'POST',
            //credentials: "same-origin",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
              },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (response.ok) return response.json();
            return response.json().then(response => {throw new Error(response.error)})
        })
        .then(data => {
                sessionStorage.setItem("loggedInUser", JSON.stringify(data.user));
                // https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
                sessionStorage.setItem("token", data.token);
                window.location.href = "/";

        })
        .catch(error => {
            console.log(error)
            //toast("Error. Reason stickied above.", error);
        });

    });

    const redirect = document.createElement("p");
    form.append(redirect);
    redirect.innerText = "Don't have an account? ";
    redirect.setAttribute("class", "auth-rdrt");
    const redirectLink = document.createElement("a");
    redirect.append(redirectLink);
    redirectLink.setAttribute("href", "/users/auth/register");
    redirectLink.innerText = "Register here.";

}

function registerForm() {

    const title = document.querySelector(".auth-title");
    title.innerText = "Register";
    const parent = document.getElementById("register-view");
    document.getElementById("login-view").style.display = "none";

    const form = document.createElement("form");
    parent.append(form);
    form.setAttribute("onsubmit", "event.preventDefault();");

    const row1 = document.createElement("div");
    form.append(row1);
    row1.setAttribute("class", "row");

    const group1 = document.createElement("div");
    row1.append(group1);
    group1.setAttribute("class", "col");

    const usernameDiv = labelAndInput("username", "Username:", "Enter a username...", "bx bxs-user",autofocus=true);
    group1.append(usernameDiv);
    const usernameHint = document.createElement("p");
    usernameDiv.append(usernameHint);
    usernameHint.innerText = "150 characters or fewer. Letters, digits and @/./+/-/_ only.";

    const emailDiv = labelAndInput("email", "E-mail address:", "Enter your email...", "bx bxs-envelope");
    group1.append(emailDiv);

    const row2 = document.createElement("div");
    form.append(row2);
    row2.setAttribute("class", "row");

    const group2 = document.createElement("div");
    row2.append(group2);
    group2.setAttribute("class", "col");

    const passwordDiv = labelAndInput("password", "Password:", "Enter a password...", "bx bxs-lock-alt");
    group2.append(passwordDiv);
    const passwordHints = document.createElement("ul");
    passwordDiv.append(passwordHints);
    // Password hints
    const hints = [
        "Your password can’t be too similar to your other personal information.",
        "Your password must contain at least 9 characters.",
        "Your password can’t be a commonly used password.",
        "Your password can’t be entirely numeric."
    ];
    hints.forEach(hint => {
        const hintLi = document.createElement("li");
        hintLi.innerText = hint;
        passwordHints.append(hintLi);
    });

    const confirmDiv = labelAndInput("confirmation", "Confirm Password:", "Re-enter a password...", "bx bxs-lock-alt");
    group2.append(confirmDiv);
    const confirmHint = document.createElement("p");
    confirmDiv.append(confirmHint);
    confirmHint.innerText = "Enter the same password as before, for verification.";

    //const submitDiv = document.createElement("div");
    //form.append(submitDiv);
    //submitDiv.setAttribute("id", "submit-div");
    const submitBtn = document.createElement("button");
    form.append(submitBtn);
    submitBtn.setAttribute("class", "round-btn auth-btn");
    submitBtn.innerText = "Register";
    submitBtn.addEventListener("click", () => {

        const csrftoken = getCookie('csrftoken');

        const username = document.getElementById("username");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirmation = document.getElementById("confirmation");

        fetch(`/users/api/auth/register`, {
            method: 'POST',
            //credentials: "same-origin",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
              },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password1: password.value,
                password2: confirmation.value,
            })
        })
        .then(response => {
            if (response.ok) return response.json();
            return response.json().then(response => {
                if (response.username !== undefined) {
                    username.style.backgroundColor = "var(--on-error)";
                    username.style.color = "var(--error)";
                    throw new Error("A user with this username already exists.");
                } else if (response.error !== undefined) {
                    password.style.backgroundColor = "var(--on-error)";
                    confirmation.style.backgroundColor = "var(--on-error)";
                    password.style.color = "var(--error)";
                    confirmation.style.color = "var(--error)";
                    throw new Error(response.error);
                }  else if (response.email !== undefined) {
                    email.style.backgroundColor = "var(--on-error)";
                    email.style.color = "var(--error)";
                    throw new Error(response.email);
                }

            })
        })
        .then(data => {
                //console.log("Made it", data.user)
                sessionStorage.setItem("loggedInUser", JSON.stringify(data.user));
                updateSessionData("add", "users", data.user, data.user.id);
                // https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
                sessionStorage.setItem("token", data.token);
                window.location.href = "/";
        })
        .catch(error => {
            console.log(error);
            //toast("Error. Reason stickied above.", error);
        });

    });

    const redirect = document.createElement("p");
    form.append(redirect);
    redirect.innerText = "Already have an account? ";
    redirect.setAttribute("class", "auth-rdrt");
    const redirectLink = document.createElement("a");
    redirect.append(redirectLink);
    redirectLink.setAttribute("href", "/users/auth/login");
    redirectLink.innerText = "Log in here.";

}

function labelAndInput(name, label, placeholder, icon, autofocus=false) {

    const div = document.createElement("div");
    div.setAttribute("class", "auth-group");

    const labelTag = document.createElement("label");
    labelTag.setAttribute("for", name);
    labelTag.setAttribute("class", "form-label");
    div.append(labelTag);
    labelTag.innerText = label;

    const div2 = document.createElement("div");
    div.append(div2)
    div2.setAttribute("class", "input-group");

    const inputTag = document.createElement("input");
    div2.append(inputTag);
    if (autofocus === true) {
        inputTag.setAttribute("autofocus","");
    }
    inputTag.setAttribute("class", "form-control shadow-none");
    inputTag.setAttribute("id", name);

    if (name === "password" || name === "confirmation") {
        inputTag.setAttribute("type", "password");
    } else {
        inputTag.setAttribute("type", "text");
    }
    inputTag.setAttribute("name", name);
    inputTag.setAttribute("placeholder", placeholder);

    const iconCont = document.createElement("span");
    div2.append(iconCont);
    iconCont.setAttribute("class", "input-group-text");
    if (name === "email") {
        iconCont.setAttribute("id", "email-icon-cnt");
    }

    const iconTag = document.createElement("i");
    iconCont.append(iconTag);
    iconTag.setAttribute("aria-hidden", "true");
    iconTag.setAttribute("class", icon);

    return div;

}