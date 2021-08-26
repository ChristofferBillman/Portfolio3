let postsContainer = document.getElementById("postsContainer")

UpdatePosts()
/**
 *  Updates all posts on the page.
 * 
 *  Empties the div 'postsContainer' (id: posts-hook) and
 *  populates it with new, updated posts from the server.
 */
function UpdatePosts(){
    axios.get('getPosts?')
    .then(response =>{
        // Iterate each post
        response.data.forEach(post => {
            // Format post data and insert in postsContainer.
            postsContainer.appendChild(GetPostNode(post))
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

/**
 * 
 * @param {Object} post 
 * @returns {ChildNode} The post node. Only creates the node from post data. No EventListerners are added.
 */
function GetPostNode(post) {
    console.log("hej")
    return CreateElementFromHTML(`
    <div class="card" id="${post.imagePosition == 'right' ?  'gronamackan': ''}">
    <img src="${getImage(post.images)}" class="${convertImagePositioning(post.imagePosition)}">
    <div class="card-content">
      <h2>${post.title}</h2>

      <div class="whitespace-vertical"></div>

      <p>${post.body}</p>
      <div class="whitespace-vertical"></div>
      <a class="button">Se bilder</a>
    </div>
  </div>
    `)
    function getImage(images){
        if(images == null) return "";
        else return "https://pkrl.xyz/"+images
    }
}
/**
 * 
 * @param {String} position The position to put the image in. Allowed types are 'top' and 'right'.
 * @returns String
 */
function convertImagePositioning(position){
    switch(position){
        case 'right':
            return 'card-banner-right'
        case 'top':
            return 'card-banner-top'
        default:
            return 'card-banner-top'
    }
}