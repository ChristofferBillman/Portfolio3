const togglebtn = document.getElementById("darkmode-btn")

const lightTheme = {
	__primary: "#876f9e",
	__secondary: "#D18431",
	__faded_primary: "#6e7aad",
	__dark_primary: "#4A4A72",
	__text: "#424242",
	__background: "#F2ECE9",
	__background_total: "#d4cfda",
	__banner_gradient: "linear-gradient(91deg, #a489bf, #d18431)",
	__std_box_shadow: "0 0 50px rgba(0,0,0,0.05)",
	__banner_bg: "url(../img/cool-gradient-wide.svg)",
	func: () => {
		var cards = document.getElementsByClassName("card")
		for (let card of cards) card.classList.remove("card-glass")
	}
}
const darkTheme = {
	__primary: "#A489BF",
	__secondary: "#D18431",
	__faded_primary: "#808EC7",
	__dark_primary: "#4A4A72",
	__text: "#FFFFFF",
	__background: "#424242",
	__background_total: "rgb(38, 38, 38)",
	__banner_gradient: "linear-gradient(91deg, #a489bf, #d18431)",
	__std_box_shadow: "0 0 50px rgba(0,0,0,0.05)",
	__banner_bg: "url(../img/cool-gradient-wide.svg)",
	func: () => {
		var icons = document.getElementsByClassName("icon")
		for (let icon of icons) icon.style.filter = "invert(90%)"
	}
}
const glassTheme = {
	__primary: "#424242",
	__secondary: "#D18431",
	__faded_primary: "#424242",
	__dark_primary: "#4A4A72",
	__text: "#424242",
	__background: "#424242",
	__background_total: "url(../img/cool-gradient-long.svg)",
	__std_box_shadow: "0 0 50px rgba(0,0,0,0.05)",
	__banner_bg: "rgba(0,0,0,0)",
	func: () => {
		document.getElementsByTagName("body")[0].style.backgroundSize = "cover"
		var cards = document.getElementsByClassName("card")
		for (let card of cards) card.classList.add("card-glass")

		var icons = document.getElementsByClassName("icon")
		for (let icon of icons) icon.style.filter = "invert(0%)"
	}
}
buttonIteration = 0
var currentTheme

togglebtn.addEventListener("click", e => {
	count()
	for (const [key, value] of Object.entries(currentTheme)) {
		var varName = key.replaceAll('_', '-')
		document.documentElement.style.setProperty(varName, value)
	}
	currentTheme.func()
})

function count() {
	buttonIteration++
	switch (buttonIteration % 3) {
		case 0:
			currentTheme = lightTheme
			break
		case 1:
			currentTheme = darkTheme
			break
		case 2:
			currentTheme = glassTheme
			break
	}
}
