document.addEventListener('DOMContentLoaded', function() {

    if (document.querySelector('#post-form') !== null) {
        const form = composePost();
        document.querySelector('#post-form').append(form);
    };

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

    const formText = document.createElement("textarea");
    formText.setAttribute("class", "form-text");

    const csrftoken = getCookie('csrftoken');

    const postButton = document.createElement("input");
    postButton.setAttribute("type", "submit");
    postButton.setAttribute("value", "Create Post");
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
          .then(response => {
            if (!response.ok) return response.json().then(response => {throw new Error(response.error)})
        })
          .then(result => {
              // Print result
              console.log(result);
          });

    });

    form.append(formText, postButton)
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
                const help = likePostButton(post.fields, post.pk, user)

                parent.append(postCard, help);
                help.addEventListener("click", () => like(help))
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

    // Make parent
    const card = document.createElement("div");
    card.setAttribute("class", "post-card");


    // Profile Picture
    const pfpDiv = document.createElement("div");
    pfpDiv.setAttribute("class", "post-pfp");
    const pfp = document.createElement("img");
    pfp.alt = creator.username;
    pfp.src = creator.pfp_url;
    pfpDiv.append(pfp)

    // Top of the card with user's names and post creation date
    const topDeets = document.createElement("div");
    topDeets.setAttribute("class", "post-top-deets");
    const fullName = document.createElement("p");
    fullName.setAttribute("class", "post-full-name");
    fullName.innerText = `${creator.first_name} ${creator.last_name}`
    const userAndCreation = document.createElement("p");
    userAndCreation.setAttribute("class", "post-user-create");
    userAndCreation.innerText = `${creator.username} • ${post.creation_date}`;
    topDeets.append(fullName, userAndCreation)

    // Post Content
    const postContentDiv = document.createElement("div");
    postContentDiv.setAttribute("class", "post-content-cont");
    const postContent = document.createElement("p");
    postContent.setAttribute("class", "post-content-text");
    postContent.innerText = post.content;
    postContentDiv.append(postContent);

    // -- Action Section (Comment and Like) --
    const actions = document.createElement("div");
    actions.setAttribute("class", "post-actions");

    //Like Button


    //actions.append(likeSpan);

    // Appendings
    card.append(pfpDiv, topDeets, postContentDiv, actions);

    return card;

}

function likePostButton(post, id, creator) {

    const likeSpan = document.createElement("span");
    likeSpan.setAttribute("class", "like-span");
    const likeIcon = document.createElement("i");
    likeIcon.setAttribute("class", "bx bxs-heart");
    likeIcon.setAttribute("data-id", id);
    likeIcon.setAttribute("data-type", "post");
    const likeCount = document.createElement("p");
    likeCount.setAttribute("class", "like-cnt");
    likeCount.innerText = ""
    likeCount.setAttribute("data-id", id);
    likeCount.setAttribute("data-type", "post");
    const likeBtn = document.createElement("input");
    likeBtn.setAttribute("type", "button");
    likeBtn.setAttribute("data-id", id);
    likeBtn.setAttribute("data-type", "post");
    const liked = post.likers.includes(creator.id);
    if (liked == false) {
        likeBtn.value = `Like Post`
        likeIcon.style.color = "grey"
    } else {
        likeBtn.value = `Unlike Post`
        likeIcon.style.color = "red"
    }
    likeSpan.setAttribute("data-id", id);
    likeSpan.setAttribute("data-type", "post");
    likeSpan.append(likeIcon, likeCount, likeBtn);

    return likeSpan;

}

function like(span) {

    console.log("Pressed like button")
    const csrftoken = getCookie('csrftoken');

    // Get id and like type (post or comment) from dataset
    const id = span.dataset.id;
    const type = span.dataset.type;

        fetch(`${type}/${id}`)
        .then(response => {
            if (!response.ok) return response.json().then(response => {throw new Error(response.error)})
        })
        .then(post => {

            const elements = document.querySelectorAll(`[data-type='${id}'], [data-type='${type}']`)
            console.log(elements)

            return fetch(`${type}/${id}`, {
                method: 'PUT',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin',
                body: JSON.stringify({
                    action: elements.item(3).value.split(" ")[0]
                })
            })
            .then(() =>{
                if (elements.item(3).value === `Like ${type}`) {
                    console.log("Liked")
                    elements.item(1).style.color = "red"
                    elements.item(3).value = `Unlike ${type}`
                } else {
                    console.log("Unliked")
                    elements.item(1).style.color = "grey"
                    elements.item(3).value = `Like ${type}`
                }
            })
            .catch(error => {
                console.log(error);
            })

        })
        .catch(error => {
            console.log(error);
        });

}