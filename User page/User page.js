/**
 * Created by giancarloavalle on 04/05/16.
 */
function dateTime(){
    if (document.getElementById) onload = function () {
        setInterval ("document.getElementById ('date-time').firstChild.data = new Date().toLocaleString()", 50)
    }
}