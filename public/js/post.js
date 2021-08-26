/* ADMIN PAGE */

//TODO: Add cancel button in edit view.

const token = window.localStorage.getItem('token')

let submitButton = document.getElementById("submitButton")
let title = document.getElementById("title")
let body = document.getElementById("body")
let imagePosition = document.getElementsByName("imagePosition")
let images = document.getElementById("images")
let postsContainer = document.getElementById("posts-hook")

let postStatus = document.getElementById("poststatus")

// Populate page with posts.
UpdatePosts()

// Add new post
submitButton.addEventListener("click", () =>{
    
    let radioButton
    if(imagePosition[0].checked == true){
        radioButton = 'top'
    }
    else{
        radioButton = 'right'
    }

    // Send post data to server.
    axios.get('/newPost?title='+title.value+'&body='+body.value+'&images='+images.value+'&imagePosition='+radioButton+'&token='+token)
    .then((response)=> {
        console.log(response.data.added)
        if(response.data.added == 'OK'){

            let post = {title: title.value, body: body.value, _id: response.data._id, images: images.value, imagePosition: imagePosition.value}
            title.value=''
            body.value =''
            images.value =''
            
            // Insert new post into DOM.
            postsContainer.appendChild(FormatPost(post))
            console.log(FormatPost(post))
            postStatus.innerHTML="Inlägg tillagt."
        }
        else if(response.data.added == 'no_auth'){
            postStatus.innerHTML="Ogiltig token. Inlägget är inte tillagt."
            title.value=''
            body.value =''
            images.value =''
        }
        else{
            postStatus.innerHTML="Någonting gick fel. Försök igen senare."
            title.value=''
            body.value =''
            images.value =''
        }
    })
    .catch((error)=> {
        console.log(error)
    })
})

/**
 *  Updates all posts on the page.
 * 
 *  Empties the div 'postsContainer' (id: posts-hook) and
 *  populates it with new, updated posts from the server.
 */
function UpdatePosts(){
    axios.get('getPosts?')
    .then(response =>{
        // Remove old posts.
        postsContainer.innerHTML='';

        // Iterate each post
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

    var el = GetPostNode(post,true)

    el.getElementsByClassName("delete")[0].addEventListener("click", e => {
        console.log("Nu klickades "+post._id)
        axios.get('deletePost?_id='+post._id+'&token='+token)
            .then(response =>{

                if(response.data.deleted == 'OK'){
                    el.remove()
                }
                else if(response.data.deleted == 'no_auth'){
                    el.getElementsByClassName("status")[0].innerHTML="Ogiltig token. Inlägget är inte borttaget."
                }
                else{
                     // Skriv ut felmeddelande!
                }
            })
            .catch(err =>{
                console.log(err)
            })
    })

    el.getElementsByClassName("edit")[0].addEventListener("click", e => {

        let el_copy = el.cloneNode(true)
        // Add and display the 'edit view'.
        el.innerHTML = `
        <div class="card-content">
        
            <h2>Redigera inlägg</h2>
            <div class="whitespace-vertical"></div>

            <div id="form">
                <label>Rubrik</label>
                <input type="text" class="titleEdit">
                <label>brödtext</label>
                <textarea class="bodyEdit"></textarea>
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
        el.getElementsByClassName('cancel')[0].addEventListener('click', e =>{
            el.replaceWith(el_copy)
        })
        // Populate fields in edit view with post info.
        let newtitle = el.getElementsByClassName("titleEdit")[0].value = post.title
        let newbody = el.getElementsByClassName("bodyEdit")[0].value = post.body

        el.getElementsByClassName("submitEdit")[0].addEventListener("click", e =>{
            
            // Get the new values from input fields.
            newtitle = el.getElementsByClassName("titleEdit")[0].value
            newbody = el.getElementsByClassName("bodyEdit")[0].value

            // Send new values to server.
            axios.get('/editPost?title='+newtitle+'&body='+newbody+'&_id='+post._id+'&token='+token)
            .then(response =>{
                if(response.data.edited == 'OK'){
                    // Add new post with new values.
                    let newEl = FormatPost({title: newtitle, body: newbody,_id: post._id})
                    el.insertAdjacentElement('beforebegin',newEl)
                    // Remove old post.
                    el.remove()

                    newEl.getElementsByClassName("status")[0].innerHTML = "Inlägget har redigerats."
                }
                else if(response.data.edited == 'no_auth'){
                    el.getElementsByClassName("status")[0].innerHTML = "Ogiltig token. Inlägget har inte redigerats."
                }
                else{
                    el.getElementsByClassName("status")[0].innerHTML = "Någonting gick fel. Se node för stack trace."
                }
            })
            .catch(err =>{
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
        </div>

        <div class="post-options">
            <img src="img/icons/delete.svg" class="icon delete">
            <img src="img/icons/edit.svg" class="icon edit">
            <p class="status"></p>
        </div>
    </div>
    <br>`)
}
