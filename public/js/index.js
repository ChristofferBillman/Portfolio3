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