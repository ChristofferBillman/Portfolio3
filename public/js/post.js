/* ADMIN PAGE */

/*
    TODO: 
    * Make edit and delete buttons work after a cancelled edit.
    * Refactor.
    * Re-write function comments and some inline comments.
*/

const token = window.localStorage.getItem('token')

let submitButton = document.getElementById("submitButton")
let title = document.getElementById("title")
let body = document.getElementById("body")
let imagePosition = document.getElementsByName("imagePosition")
let images = document.getElementById("images")
let postOrder = document.getElementById("postOrder")
let postsContainer = document.getElementById("posts-hook")

let postStatus = document.getElementById("poststatus")

// Populate page with posts.
UpdatePosts()

// Add new post
submitButton.addEventListener("click", () => {

    let radioButton

    if (imagePosition[0].checked == true) radioButton = 'top'
    else radioButton = 'right'

    let imageArray = images.value.split(",")

    // Send post data to server.
    axios.post('/newPost', {
        title: title.value,
        body: body.value,
        images: imageArray,
        imagePosition: radioButton,
        order: postOrder.value,
        token: token
    })
        .then((response) => {

            switch (response.data.added) {
                case 'OK':
                    let post =
                    {
                        title: title.value,
                        body: body.value,
                        _id: response.data._id,
                        images: images.value,
                        imagePosition: imagePosition.value,
                        order: postOrder.value
                    }

                    ResetFields()

                    // Insert new post into DOM.
                    postsContainer.appendChild(FormatPost(post))
                    console.log(FormatPost(post))
                    postStatus.innerHTML = "Inlägg tillagt."
                    break;

                case 'no_auth':
                    postStatus.innerHTML = "Ogiltig token. Inlägget är inte tillagt."
                    ResetFields()
                    break;

                default:
                    postStatus.innerHTML = "Någonting gick fel. Försök igen senare."
                    ResetFields()
            }
        })
        .catch((error) => {
            console.log(error)
        })
})

function ResetFields() {
    title.value = ''
    body.value = ''
    images.value = ''
    postOrder.value = ''
}

/**
 *  Updates all posts on the page.
 * 
 *  Empties the div 'postsContainer' (id: posts-hook) and
 *  populates it with new, updated posts from the server.
 */
function UpdatePosts() {
    axios.get('getPosts?')
        .then(response => {
            // Remove old posts.
            postsContainer.innerHTML = '';

            // Sort the posts by their order attributes.
            response.data.sort((a, b) => { return (a.order > b.order ? 1 : -1) })
            response.data.forEach(post => {
                // Format post data and insert in postsContainer.
                postsContainer.appendChild(FormatPost(post))
            });
        })
}

/**
 * 
 * @param {String} htmlString A string with HTML. 
 * @returns {ChildNode} A childNode.
 */
function CreateElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

/** Formats a post into HTML and adds eventlisteners for delete and edit.
 *
 *  @param {post} post post object with the required fields.
 *  @returns {ChildNode} A post ready to be inserted into the DOM.
 */
function FormatPost(post) {

    var el = GetPostNode(post, true)

    el.getElementsByClassName("delete")[0].addEventListener("click", e => {

        axios.get('deletePost?_id=' + post._id + '&token=' + token)
            .then(response => {

                switch (response.data.deleted) {
                    case 'OK':
                        el.remove()
                        break;

                    case 'no_auth':
                        el.getElementsByClassName("status")[0].innerHTML = "Ogiltig token. Inlägget är inte borttaget."
                        break;

                    default:
                    // Print error!
                }
            })
            .catch(err => {
                console.log(err)
            })
    })

    el.getElementsByClassName("edit")[0].addEventListener("click", e => {

        let el_copy = el.cloneNode(true)
        // Add and display the edit view.
        el.innerHTML = `
        <div class="card-content">
        
            <h2>Redigera inlägg</h2>
            <div class="whitespace-vertical"></div>

            <div id="form">
                <label>Rubrik</label>
                <input type="text" class="titleEdit">
                <label>brödtext</label>
                <textarea class="bodyEdit"></textarea>

                <label>Sökväg till bild</label>
                <input type="text" class="images">

                <label>Liten</label>
                <input type="radio" name="imagePosition" class="imagePosition" value="top">

                <label>Stor</label>
                <input type="radio" name="imagePosition" class="imagePosition" value="right">

                <label>Ordningstal</label>
                <input type="text" class="OrderEdit">

                <button class="submitEdit">
                Skicka!
                </button>
                <div class="post-options">
                    <img src="img/icons/cancel.svg" class="icon cancel">
                 <p class="status"></p>
        </div>
            </div>
        </div>
        `
        el.getElementsByClassName('cancel')[0].addEventListener('click', e => {
            // Does not work, eventlisterners stop working.
            el.replaceWith(el_copy)
        })
        // Populate fields in edit view with post info.
        let newtitle = el.getElementsByClassName("titleEdit")[0].value = post.title
        let newbody = el.getElementsByClassName("bodyEdit")[0].value = post.body
        let newimages = el.getElementsByClassName("images")[0].value = post.images
        let neworder = el.getElementsByClassName("OrderEdit")[0].value = post.order
        let radios = el.getElementsByClassName("imagePosition")

        // All code regarding the radio buttons are absolutley terrible. Re-factor!!!
        if (post.imagePosition == 'top') {
            radios[0].checked = true
            radios[1].checked = false
        }
        else {
            radios[1].checked = true
            radios[0].checked = false
        }

        el.getElementsByClassName("submitEdit")[0].addEventListener("click", e => {

            // Get the new values from input fields.
            newtitle = el.getElementsByClassName("titleEdit")[0].value
            newbody = el.getElementsByClassName("bodyEdit")[0].value
            newimages = el.getElementsByClassName("images")[0].value
            neworder = el.getElementsByClassName("OrderEdit")[0].value

            let radioButton
            if (radios[0].checked == true) {
                radioButton = 'top'
            }
            else {
                radioButton = 'right'
            }

            // Send new values to server.
            axios.post('/editPost', {
                title: newtitle,
                body: newbody,
                _id: post._id,
                images: newimages,
                imagePosition: radioButton,
                order: neworder,
                token: token
            })
                .then(response => {

                    switch (response.data.edited) {
                        // Add case 'NO_EDIT'
                        case 'OK':
                            // Add new post with new values.
                            let newEl = FormatPost({ title: newtitle, body: newbody, _id: post._id, images: newimages, imagePosition: radioButton })
                            el.insertAdjacentElement('beforebegin', newEl)
                            // Remove old post.
                            el.remove()

                            newEl.getElementsByClassName("status")[0].innerHTML = "Inlägget har redigerats."
                            break;

                        case 'no_auth':
                            el.getElementsByClassName("status")[0].innerHTML = "Ogiltig token. Inlägget har inte redigerats."
                            break;
                        default:
                            el.getElementsByClassName("status")[0].innerHTML = "Någonting gick fel. Se node för stack trace."
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
    })
    return el
}
/**
 * 
 * @param {Object} post 
 * @returns {ChildNode} The post node. Only creates the node from post data. No EventListerners are added.
 */
function GetPostNode(post) {
    return CreateElementFromHTML(`
    <div class="card post">
        <div class="card-content post">
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <br>
            <p>Ordningstal: ${post.order}</p>
        </div>

        <div class="post-options">
            <img src="img/icons/delete.svg" class="icon delete">
            <img src="img/icons/edit.svg" class="icon edit">
            <p class="status"></p>
        </div>
    </div>
    <br>`)
}
