function compose(type, postId=null) {

    const upperType = titleCase(type);

    // Make div
    const formDiv = document.createElement("div");
    formDiv.setAttribute("class", `${type}-form-div`);
    formDiv.setAttribute("onsubmit", "event.preventDefault();");

    var form = document.createElement("form");
    form.setAttribute("method", "post");

    var formRow = document.createElement("div");
    formRow.setAttribute("class", `${type}-form-row`);

    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "create-post-pfp round-pfp");
    const pfp = document.createElement("img");
    pfpDiv.append(pfp)
    formRow.append(pfpDiv)

    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));

    pfp.alt = user.username;
    pfp.src = user.profile_picture;
    fetchedUser = user;

    const formTextDiv = document.createElement("div");
    formTextDiv.setAttribute("class", "form-text-div");
    let formText = null;
    if (type === "post") {
        formText = document.createElement("textarea");
    } else {
        formText = document.createElement("input");
    }
    formText.setAttribute("id", `${type}-form-text`);
    formText.placeholder = `Enter ${type} content...`;
    const formTextLabel = document.createElement("label");
    formTextLabel.setAttribute("for", `${type}-form-text`);
    formTextLabel.innerText = `Enter text for a new ${type}:`;
    formTextDiv.append(formTextLabel, formText)
    formRow.append(formTextDiv);

    const csrftoken = getCookie('csrftoken');

    const postButton = document.createElement("button");
    postButton.setAttribute("class", "float-right round-btn post-crt-btn");
    postButton.innerText = `Create ${type}`;

    let url = null;
    if (type === "post") {
        url = '/posts/api/posts/';
    } else {
        url = `/posts/api/posts/${postId}/comments/`;
    }

    postButton.addEventListener("click", () => {

        fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                "Content-Type": "application/json",
            },
            mode: 'same-origin',
            body: JSON.stringify({
                post: postId,
                content: formText.value
            })
          })
          .then(response => response.json())
          .then(result => {
                // Print result
                formText.value = "";

                const postCard = completeCard(type, result);

                if (type === "post") {

                    const allCont = document.querySelector('#posts-cont');
                    const profileCont = document.querySelector('.profile-post-form');
                    if (allCont !== null) {
                        allCont.prepend(postCard);
                    } else if (profileCont !== null) {
                        profileCont.after(postCard);
                    }
                    const dataLength = Object.keys(JSON.parse(sessionStorage.getItem("posts"))).length;
                    updateSessionData("compose", "posts", result, dataLength, type);

                } else if (type === "comment") {

                    const allCont = document.querySelector('.comment-form-div');
                    allCont.after(postCard);
                    updateSessionData("compose", "posts", result, postId, type);

                }

          })
          .catch(error => {
            console.log(error);
        });

    });

    form.append(formRow, postButton);
    formDiv.append(form);
    return formDiv;

}

function editButton(type, data, postId) {

    //console.log(data.id)

    const upperType = titleCase(type);

    const editBtn = document.createElement("button");
    editBtn.setAttribute("class", `round-btn ${type}-like-btn ${type}-edit-btn`);
    editBtn.innerText = `Edit ${upperType}`;

    const editIcon = document.createElement("i");
    editIcon.setAttribute("class", "bx bxs-edit-alt");
    editIcon.setAttribute("data-type", type);
    editIcon.setAttribute("aria-hidden", "true");

    editBtn.setAttribute(`data-${type}`, data.id);
    // For comments where a postId is needed to properly make request
    if (postId !== null) {
        editBtn.setAttribute(`data-parent`, postId);
    }
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
    let cancelBtn = null;
    let saveBtn = null;
    let commentBtn = null;

    // Hiding the edit button and uneditable content text

    postText = editables.item(2);
    postText.style.display = "none";

    likeBtn = editables.item(3);
    likeBtn.style.display = "none";

    editFormDiv = editables.item(0);
    editFormDiv.style.display = "block";
    editForm = editables.item(1);
    editForm.value = postText.innerText;

    editBtn = editables.item(4);
    editBtn.style.display = "none";

    cancelBtn = editables.item(5);
    cancelBtn.style.display = "block";

    saveBtn = editables.item(6);
    saveBtn.style.display = "block";



    cancelBtn.addEventListener("click", () => {
        // After changing content, hide the form field
        editFormDiv.style.display = "none";
        saveBtn.style.display = "none";
        cancelBtn.style.display = "none";
        // Show edit button
        editBtn.removeAttribute("style");
        // Reshow unedditable content
        postText.style.display = "block";
        // Show like button
        likeBtn.removeAttribute("style");
    })

    saveBtn.addEventListener("click", () => {

        newContent = null

        if (full === false) {
            newContent = editForm.value;
        } else {
            newContent = editables.item(8).value;
        }

        const csrftoken = getCookie('csrftoken');

        let url = null;
        if (type === "post") {
            url = `/posts/api/posts/${id}/`;
        } else if (type === "comment") {
            url = `/posts/api/posts/${editBtn.dataset.parent}/comments/${id}/`;
        }

        //https://www.tjvantoll.com/2015/09/13/fetch-and-errors/

        fetch(url, {
            method: 'PUT',
            headers: {
                'X-CSRFToken': csrftoken,
                "Content-Type": "application/json",
            },
            mode: 'same-origin',
            body: JSON.stringify({
                post: editBtn.dataset.parent,
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
            cancelBtn.style.display = "none";
            // Show edit button
            editBtn.removeAttribute("style");
            // Replace unedditable content with new value for both post elements and full view
            postText.innerText = newContent;
            if (full === true) {
                editables.item(9).innerText = newContent;
            }
            // Reshow unedditable content
            postText.style.display = "block";
            // Show like button
            likeBtn.removeAttribute("style");

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

    const formText = document.createElement("input");
    formText.setAttribute("id", "edit-form-text");
    formText.setAttribute(`data-${type}`, id);
    formText.setAttribute("type", "test");

    const formTextLabel = document.createElement("label");
    formTextLabel.setAttribute("for", "edit-form-text");
    formTextLabel.innerText = `Edit ${type}:`;

    formTextDiv.append(formTextLabel, formText);

    return formTextDiv;

}