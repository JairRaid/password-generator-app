const inputRange = document.getElementById("character-length");
const activeColor = "#a4ffaf";
const inactiveColor = "#18171F";

inputRange.addEventListener("input", function () {
    const ratio = (this.value - this.min) / (this.max - this.min) * 100;
    this.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
});
