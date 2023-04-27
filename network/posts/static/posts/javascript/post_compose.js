function compose(type, post_id=null) {

    const upperType = titleCase(type);

    // Make div
    const formDiv = document.createElement("div");
    formDiv.setAttribute("class", "form-div");
    formDiv.setAttribute("onsubmit", "event.preventDefault();");

    var form = document.createElement("form");
    form.setAttribute("method", "post");

    var formRow = document.createElement("div");
    formRow.setAttribute("class", "post-form-row");

    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "create-post-pfp round-pfp");
    const pfp = document.createElement("img");
    pfpDiv.append(pfp)
    formRow.append(pfpDiv)

    // Checking if this is the profiles page, search page or index
    let check = ""
    const titleCheck = document.querySelector("#posts-title");
    const searchCheck = document.querySelector("#search-cont");
    if (titleCheck !== null || searchCheck !== null) {
        check = "profiles/";
    };

    // Get user information for PFP
    fetch(`${check}api/profile/${loggedInUser}`)
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
    formRow.append(formTextDiv);

    const csrftoken = getCookie('csrftoken');

    const postButton = document.createElement("button");
    postButton.setAttribute("class", "float-right round-btn post-crt-btn");
    postButton.innerText = `Create ${type}`;
    postButton.addEventListener("click", () => {

        fetch('/posts/api/create', {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
                type: type,
                content: formText.value,
            })
          })
          .then(response => response.json())
          .then(result => {
                // Print result
                post = JSON.parse(result)
                formText.value = "";

                const postCard = completeCard(type, post[0])

                const allCont = document.querySelector('#posts-cont');
                const profileCont = document.querySelector('.profile-post-form');
                if (allCont !== null) {
                    allCont.prepend(postCard);
                } else if (profileCont !== null) {
                    profileCont.after(postCard);
                }

          })

    });

    form.append(formRow, postButton);
    formDiv.append(form);
    return formDiv;

}

function editButton(type, post, id) {

    const upperType = titleCase(type);

    const editBtn = document.createElement("button");
    editBtn.setAttribute("class", "post-edit-btn");
    editBtn.innerText = `Edit ${upperType}`;

    const editIcon = document.createElement("i");
    editIcon.setAttribute("class", "bx bxs-edit-alt");
    editIcon.setAttribute("data-type", type);
    editIcon.setAttribute("aria-hidden", "true");

    editBtn.setAttribute(`data-${type}`, id);
    editBtn.prepend(editIcon);

    return editBtn;

}

function editAction(type, button, full=false) {

    const upperType = titleCase(type);

    let id = null;
    if (type === "post") {
        id = button.dataset.post;
    } else if (type === "comment") {
        id = button.dataset.comment;
    }

    const editables = document.querySelectorAll(`[data-${type}='${id}']`)
    console.log(editables)

    // Defining now so that depending on on full's boolean, variables to do not have be redeinfed
    let editBtn = null;
    let postText = null;
    let likeBtn = null;
    let editFormDiv = null;
    let editForm = null;
    let saveBtn = null;
    let commentBtn = null;

    if (full === false) {

        // Hiding the edit button and uneditable content text
        editBtn = editables.item(0);
        editBtn.style.display = "none";

        postText = editables.item(3);
        postText.style.display = "none";

        likeBtn = editables.item(4);
        likeBtn.style.display = "none";

        commentBtn = editables.item(5);
        commentBtn.style.display = "none";

        // Showing the edit form div and fill with post content and the save button
        editFormDiv = editables.item(1);
        editFormDiv.style.display = "block";
        editForm = editables.item(2);
        editForm.value = postText.innerText;
        saveBtn = editables.item(6);
        saveBtn.style.display = "block";

    } else {

        // Hiding the edit button and uneditable content text
        editBtn = editables.item(7);
        editBtn.style.display = "none";

        postText = editables.item(10);
        postText.style.display = "none";

        likeBtn = editables.item(11);
        likeBtn.style.display = "none"

        // Showing the edit form div and fill with post content and the save button
        editFormDiv = editables.item(8);
        editFormDiv.style.display = "block";
        editForm = editables.item(9);
        editForm.value = postText.innerText;
        saveBtn = editables.item(12);
        saveBtn.style.display = "block";

    }

    saveBtn.addEventListener("click", () => {

        newContent = null

        if (full === false) {
            newContent = editForm.value;
        } else {
            newContent = editables.item(8).value;
        }

        const csrftoken = getCookie('csrftoken');

        //https://www.tjvantoll.com/2015/09/13/fetch-and-errors/

        fetch(`/posts/api/${type}/${id}`, {
            method: 'PUT',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
                content: newContent
            })
        })
        .then(response => {
            if (!response.ok) return response.json().then(response => {throw new Error(response.error)})
        })
        .then(() => {

            // After changing content, hide the form field
            editFormDiv.style.display = "none";
            saveBtn.style.display = "none";
            // Show edit button
            editBtn.style.display = "block";
            // Replace unedditable content with new value for both post elements and full view
            editables.item(3).innerText = newContent;
            if (full === true) {
                editables.item(9).innerText = newContent;
            }
            // Reshow unedditable content
            postText.style.display = "block";
            // Show like button
            likeBtn.style.display = "block";

        })
        .catch(error => {
            console.log(error);
        });
    })

}

function editForm(type, id) {

    const formTextDiv = document.createElement("div");
    formTextDiv.setAttribute("class", "form-text-div");
    formTextDiv.setAttribute(`data-${type}`, id);

    const formText = document.createElement("textarea");
    formText.setAttribute("id", "edit-form-text");
    formText.setAttribute(`data-${type}`, id);

    const formTextLabel = document.createElement("label");
    formTextLabel.setAttribute("for", "edit-form-text");
    formTextLabel.innerText = `Edit ${type}:`;

    formTextDiv.append(formTextLabel, formText);

    return formTextDiv;

}