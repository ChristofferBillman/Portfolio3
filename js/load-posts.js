let postsContainer = document.getElementById("postsContainer")
let gallery = document.getElementById("gallery")
let closeGallery = document.getElementById("galleryClose")
let galleryNext = document.getElementById("galleryNext")
let galleryPrev = document.getElementById("galleryPrev")
let galleryCurrent = document.getElementById("galleryCurrent")
let currentImg
let currentImgArr
let currentImgPos

UpdatePosts()
InitGallery()

/**
 *  Updates and orders all posts on the page.
 * 
 *  Empties the div 'postsContainer' (id: posts-hook) and
 *  populates it with new, updated posts from posts.js.
 */
function UpdatePosts() {

	posts.sort((a, b) => { return (a.order > b.order ? 1 : -1) })

	posts.forEach(post =>{
		// Format post data and insert in postsContainer.
		let postNode = GetPostNode(post)
		addGalleryListener(postNode, post.images)
		postsContainer.appendChild(postNode)
	})
}
/**
 * Adds eventlisters to the gallery controls.
 */
function InitGallery() {

	closeGallery.addEventListener("click", e => {
		gallery.style.display = "none"
	})
	gallery.addEventListener("click", e => {
		galleryControls = document.getElementById("gallery-controls")
		if (e.target == gallery || e.target == galleryControls) {
			gallery.style.display = "none"
		}
	})
	galleryNext.addEventListener("click", e => {
		changeCurrentImgPos(true)
		currentImg.src = currentImgArr[currentImgPos]
	})
	galleryPrev.addEventListener("click", e => {
		changeCurrentImgPos(false)
		currentImg.src = currentImgArr[currentImgPos]
	})
}
/**
 * Adds an eventlisterner to the 'view images' (Se bilder) button inside a post,
 * which then opens the images provided to the post provided in this function.
 * @param {*} postNode The post to which to apply the eventlister to.
 * @param {*} images   An array of the paths to the images to be viewed when button is pressed.
 */
function addGalleryListener(postNode, images) {
	let openGalleryBinds = postNode.getElementsByClassName('openGallery')
	currentImg = document.getElementById("galleryImage")

	for (let button of openGalleryBinds)
		button.addEventListener("click", e => {
			currentImgPos = 0
			currentImgArr = images
			galleryCurrent.innerHTML = currentImgPos + 1 + " av " + currentImgArr.length
			currentImg.src = currentImgArr[currentImgPos]
			gallery.style.display = "flex"
			document.body.overflow = "hidden"
		})
}
/**
 * Changes the current image position (global variable currentImgPos), either forward och backward.
 * @param {boolean} forward Specifies wheter to increment currentImgPos forward och downward.
 */
function changeCurrentImgPos(forward) {

	if (forward) currentImgPos++
	else currentImgPos--

	if (currentImgPos < 0) currentImgPos = currentImgArr.length - 1
	if (currentImgPos == currentImgArr.length) currentImgPos = 0

	galleryCurrent.innerHTML = currentImgPos + 1 + " av " + currentImgArr.length
}
/**
 * Creates a node ready to be inserted into DOM from a string of HTML.
 * @param {String} htmlString A string with HTML. 
 * @returns {ChildNode} The childNode created.
 */
function CreateElementFromHTML(htmlString) {
	let div = document.createElement('div');
	div.innerHTML = htmlString.trim();
	return div.firstChild;
}

/**
 * Creates and formats post data into a node ready to be inserted into the DOM.
 * @param {Object} post 
 * @returns {ChildNode} The post node. Only creates the node from post data. No EventListerners are added.
 */
function GetPostNode(post) {
	//Change name of css class gronamackan to 'big', or something...
	return CreateElementFromHTML(`
	<div class="card" id="${post.imagePosition == 'right' ? 'gronamackan' : ''}">
		<img src="${post.images[0]}" class="${convertImagePositioning(post.imagePosition)} openGallery" alt="Project Image">
		<div class="card-content">
			<h2>${post.title}</h2>

			<div class="whitespace-vertical"></div>

			<p>${post.body}</p>
			<div class="whitespace-vertical"></div>
			<a class="button openGallery">Se bilder</a>
		</div>
	</div>
	`)
}
/**
 * Converts the image positionings 'top' and 'right' into correspondning css class names.
 * @param {String} position The position to put the image in. Allowed types are 'top' and 'right'.
 *		   Defaults to top.
 */
function convertImagePositioning(position) {
	switch (position) {
		case 'right':
			return 'card-banner-right'
		case 'top':
			return 'card-banner-top'
		default:
			return 'card-banner-top'
	}
}