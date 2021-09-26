const togglebtn = document.getElementById("darkmode-btn")
const message = document.getElementById("darkmode")

// Get colors from stylehseet.
const darkStyles =
{
    body: "#262626",
    card: getComputedStyle(document.documentElement).getPropertyValue('--black'),
    boxShadow: "0 0 50px rgba(0,0,0,0.1)",
    p: getComputedStyle(document.documentElement).getPropertyValue('--background'),
    h3: getComputedStyle(document.documentElement).getPropertyValue('--black'),
    message: "Ta mig <br> tillbaka!!!",
    brightness: "brightness(0.7)",
    icon: "invert(100%)"
}
const lightStyles =
{
    body: getComputedStyle(document.documentElement).getPropertyValue('--background-total'),
    card: getComputedStyle(document.documentElement).getPropertyValue('--background'),
    boxShadow: getComputedStyle(document.documentElement).getPropertyValue('--std-box-shadow'),
    p: getComputedStyle(document.documentElement).getPropertyValue('--black'),
    h3: "rgba(255,255,255,0.5)",
    message: "Till den<br>mörka sidan...",
    brightness: "brightness(1)",
    icon: "invert(0%)"
}

var style = lightStyles

togglebtn.addEventListener("click", e => {

    //Switch colors depending on current style 
    if (style == lightStyles) style = darkStyles
    else style = lightStyles

    var cards = document.getElementsByClassName("card")
    var p = document.getElementsByTagName("p")
    var h3 = document.getElementsByTagName("h3")
    var banner = document.getElementById("banner")
    var icons = document.getElementsByClassName("icon")

    document.body.style.backgroundColor = style.body

    for (let card of cards) {
        card.style.backgroundColor = style.card
        card.style.boxShadow = style.boxShadow
    }
    for (let e of p) e.style.color = style.p
    for (let text of h3) text.style.color = style.h3
    for (let icon of icons) icon.style.filter = style.icon
    banner.style.filter = style.brightness
    message.innerHTML = style.message
})