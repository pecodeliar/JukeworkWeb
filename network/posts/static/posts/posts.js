let loggedInUser = null

document.addEventListener('DOMContentLoaded', function() {

    const postForm = document.querySelector('#post-form')
    if (postForm !== null) {
        loggedInUser = parseInt(postForm.dataset.user)
        const form = composePost();
        document.querySelector('#post-form').append(form);
    };

    const article = document.querySelector("#electric-cars");

    loadPosts();

});

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
    pfpDiv.setAttribute("class", "create-post-pfp");
    const pfp = document.createElement("img");
    pfpDiv.append(pfp)
    formRow.append(pfpDiv)

    // let fetchedUser = null

    // Get user information for PFP
    fetch(`/users/${loggedInUser}`)
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

        fetch('/posts/create', {
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

                const postCard = postElement(post[0].fields, post[0].pk, fetchedUser)
                const help = likePostButton(post[0].fields, post[0].pk, loggedInUser)
                postCard.querySelector(".misc-div").append(help)
                document.querySelector('#posts-view').prepend(postCard);
                help.addEventListener("click", () => {
                    like(help)
                })
          })

    });

    form.append(formRow, postButton)
    formDiv.append(form);
    return formDiv;

}

function loadPosts() {

    // Select posts div
    const parent = document.querySelector('#posts-view');

    fetch('/posts')
    .then(response => response.json() )
    .then(json => {
        posts = JSON.parse(json)
        posts.forEach(post => {

             // Get user information
            fetch(`/users/${post.fields.creator}`)
            .then(response => response.json() )
            .then(user => {



                const postCard = postElement(post.fields, post.pk, user)
                const help = likePostButton(post.fields, post.pk, loggedInUser)
                //console.log(post.fields, post.pk, loggedInUser)
                postCard.querySelector(".misc-div").append(help)
                //console.log(help.childNodes)
                //postCard.append(help)
                parent.append(postCard);
                //console.log(help.querySelector("button"))
                help.addEventListener("click", () => {
                    like(help)
                    console.log("Done the click!")
                })
            })
            .catch(error => {
                console.log(error);
            });

        })

    })
    .catch(error => {
        console.log(error);
    });

}

function postElement(post, id, creator) {
    //console.log(post, id, creator)

    // Make parent
    const card = document.createElement("article");
    card.setAttribute("class", "post-card");


    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "post-pfp");
    const pfp = document.createElement("img");
    pfp.alt = "";
    pfp.src = creator.pfp_url;
    pfpDiv.append(pfp)

    // Everything else div
    const miscDiv = document.createElement("div");
    miscDiv.setAttribute("class", "misc-div");

    // Top of the card with user's names and post creation date
    const topDeets = document.createElement("div");
    topDeets.setAttribute("class", "post-top-deets");
    const fullName = document.createElement("span");
    fullName.setAttribute("class", "post-full-name");
    fullName.innerText = `${creator.first_name} ${creator.last_name}`
    const userAndCreation = document.createElement("span");
    userAndCreation.setAttribute("class", "post-user-create");
    userAndCreation.innerText = ` @${creator.username} • ${post.creation_date}`;
    topDeets.append(fullName, userAndCreation)

    // Post Content
    const postContentDiv = document.createElement("div");
    postContentDiv.setAttribute("class", "post-content-cont");
    const postContent = document.createElement("span");
    postContent.setAttribute("class", "post-content-text");
    postContent.innerText = post.content;
    postContentDiv.append(postContent);

    miscDiv.append(topDeets, postContentDiv)

    // Appendings
    card.append(pfpDiv, miscDiv);

    return card;

}

function likePostButton(post, id, creator) {

    const likeBtn = document.createElement("button");
    likeBtn.setAttribute("class", "post-like-btn");
    likeBtn.setAttribute("data-id", id);
    likeBtn.setAttribute("data-type", "post");
    const likeIcon = document.createElement("i");
    likeIcon.setAttribute("class", "bx bxs-heart post-like-heart");
    likeIcon.setAttribute("data-id", id);
    likeIcon.setAttribute("data-type", "post");
    likeIcon.setAttribute("aria-hidden", "true");
    const likeCount = document.createElement("p");
    likeCount.setAttribute("class", "like-cnt");
    likeCount.innerText = post.likers["length"]
    likeCount.setAttribute("data-id", id);
    likeCount.setAttribute("data-type", "post");
    const liked = post.likers.includes(loggedInUser);

    // Check if user has logged in
    if (loggedInUser === null) {
        likeBtn.disabled = "true";
        likeIcon.style.color = "grey";
        likeBtn.innerText = `Likers`;
    } else {
        if (liked === false) {
            likeBtn.innerText = `Like Post`;
            likeIcon.style.color = "grey";
        } else {
            likeBtn.innerText = `Unlike Post`;
            likeIcon.style.color = "red";
        }
    }


    likeBtn.setAttribute("data-id", id);
    likeBtn.setAttribute("data-type", "post");
    likeBtn.append(likeIcon, likeCount);
    //actions.append(likeBtn)

    return likeBtn;

}

function like(button) {

    //console.log(button)

    const csrftoken = getCookie('csrftoken');

    // Get id and like type (post or comment) from dataset
    const id = button.dataset.id;
    const type = button.dataset.type;
    const elements = document.querySelectorAll(`[data-id='${id}']`)
    const btn = elements.item(0)
    const action = btn.innerText.split(" ")[0]

        fetch(`${type}/${id}`)
        .then(response => {
            if (!response.ok) return response.json().then(response => {throw new Error(response.error)})
        })
        .then(post => {

            //const elements = document.querySelectorAll(`[data-id='${id}']`)
            //console.log(elements)
            var count = parseInt(elements.item(2).textContent)

            return fetch(`${type}/${id}`, {
                method: 'PUT',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin',
                body: JSON.stringify({
                    action: action
                })
            })
            .then(() =>{
                if (btn.childNodes[0].nodeValue === `Like ${titleCase(type)}`) {
                    btn.childNodes[0].nodeValue = `Unlike ${titleCase(type)}`
                    elements.item(1).style.color = "red";
                    elements.item(2).textContent = count += 1
                } else {
                    btn.childNodes[0].nodeValue = `Like ${titleCase(type)}`
                    elements.item(1).style.color = "grey"
                    elements.item(2).textContent = count -= 1
                }
            })
            .catch(error => {
                console.log(error);
            })

        })
        .catch(error => {
            console.log(error);
        });

        //console.log(elements, "Like function done");

}

function titleCase(string){
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}