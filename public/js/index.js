var snapchat = document.getElementById("snap")
var insta = document.getElementById("insta")
var github = document.getElementById("github")

var glass = false

var icons = document.getElementsByClassName("icon")

var title = document.getElementById("title")
var profileImage = document.getElementById("profile-image")

icons[2].addEventListener("mouseover", () => {
    title.innerHTML = "@popkrull<br><br>"
    profileImage.style.opacity = 0;
})
icons[1].addEventListener("mouseover", () => {
    title.innerHTML = "@popkrull<br><br>"
})
icons[2].addEventListener("mouseout", mouseLeaveTitle);
icons[1].addEventListener("mouseout", mouseLeaveTitle);

function mouseLeaveTitle() {
    title.innerHTML = "Christoffer<br>Billman"
    profileImage.style.opacity = 1;
}

function enableGlass() {
    let cards = document.getElementsByClassName("card")
    let banner = document.getElementById("banner")
    let body = document.getElementsByTagName("body")
    let h1s = document.getElementsByTagName("h1")
    let h2s = document.getElementsByTagName("h2")
    let darkmode = document.getElementById("darkmode")
    let language = document.getElementById("language")


    for (let card of cards) card.classList.add("card-glass")
    for (let h1 of h1s) h1.style.color = "var(--black)"
    for (let h2 of h2s) h2.style.color = "var(--black)"

    banner.style.background = "rgba(0,0,0,0)";
    body[0].style.background = "url(../img/cool_gradient_long.svg)"
    body[0].style.backgroundSize = "cover"
    darkmode.style.display = "none"
    language.children[0].style.color = "var(--black)"
}
