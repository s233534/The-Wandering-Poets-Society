/**
 * Created by giancarloavalle on 04/05/16.
 */

function openTextEditor() {
    window.open("../Create text/Text Editor.html");
}

function check(val) {
    localStorage.setItem("numStars", val);
}
function checkStars() {
    st = localStorage.getItem("numStars");
    num = "star-" + st;
    document.getElementById(num).checked=true;
}