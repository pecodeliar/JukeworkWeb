function composePost() {

    // Make div
    const formDiv = document.createElement("div");
    formDiv.setAttribute("class", "form-div");
    formDiv.setAttribute("onsubmit", "event.preventDefault();");

    var form = document.createElement("form");
    form.setAttribute("method", "post");

    var formRow = document.createElement("div");
    formRow.setAttribute("class", "post-form-row")

    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "create-post-pfp round-pfp");
    const pfp = document.createElement("img");
    pfpDiv.append(pfp)
    formRow.append(pfpDiv)

    // Get user information for PFP
    fetch(`profiles/api/profile/${loggedInUser}`)
    .then(response => response.json() )
    .then(user => {

        pfp.alt = user.username;
        pfp.src = user.pfp_url;
        fetchedUser = user;

    })
    .catch(error => {
        console.log(error);
    });

    const formTextDiv = document.createElement("div");
    formTextDiv.setAttribute("class", "form-text-div");
    const formText = document.createElement("textarea");
    formText.setAttribute("id", "form-text");
    formText.placeholder = "Enter post content..."
    const formTextLabel = document.createElement("label");
    formTextLabel.setAttribute("for", "form-text");
    formTextLabel.innerText = "Enter text for a new post:";
    formTextDiv.append(formTextLabel, formText)
    formRow.append(formTextDiv)

    const csrftoken = getCookie('csrftoken');

    const postButton = document.createElement("button");
    postButton.setAttribute("class", "float-right round-btn post-crt-btn");
    postButton.innerText = "Create Post";
    postButton.addEventListener("click", () => {

        fetch('/posts/api/create', {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
                type: 'Post',
                content: formText.value,
            })
          })
          .then(response => response.json())
          .then(result => {
                // Print result
                post = JSON.parse(result)
                formText.value = "";

                const postCard = completePostCard(post[0])
                document.querySelector('#posts-cont').prepend(postCard);
          })

    });

    form.append(formRow, postButton);
    formDiv.append(form);
    return formDiv;

}