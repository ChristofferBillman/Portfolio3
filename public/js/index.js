var snapchat = document.getElementById("snap")
var insta = document.getElementById("insta")
var github = document.getElementById("github")

var title = document.getElementById("title")
var profileImage = document.getElementById("profile-image")

snapchat.addEventListener("mouseover", () =>{
    title.innerHTML = "@popkrull<br><br>"
    profileImage.style.opacity = 0;
})
insta.addEventListener("mouseover", () =>{
    title.innerHTML = "@popkrull<br><br>"
})
snapchat.addEventListener("mouseout", mouseLeaveTitle);
insta.addEventListener("mouseout", mouseLeaveTitle);

function mouseLeaveTitle(){
    title.innerHTML = "Christoffer<br>Billman"
    profileImage.style.opacity = 1;
}

