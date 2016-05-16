/**
 * Created by giancarloavalle on 04/05/16.
 */
//function dateTime(){
   // if (document.getElementById) onload = function () {
     //   setInterval ("document.getElementById ('date-time').firstChild.data = new Date().toLocaleString()", 50)
   // }
//}

var twps=new Firebase("https://twps.firebaseio.com");
var actualName;
var actualSurname;
var actualDOB;
var actualCat;
var actualLev;


function getDate() {
   
}

function createDate(){
    
}

function openTextEditor() {
    window.open("../Create text/Text Editor.html");
}

function loadUser() {

    twps.child("users/Ianus/name").on("value", function (snapshot) {
        actualName=snapshot.val();
        document.getElementById("actualName").innerHTML=snapshot.val();
    });

    twps.child("users/Ianus/surname").on("value", function (snapshot) {
        actualSurname=snapshot.val();
        document.getElementById("actualSurname").innerHTML=snapshot.val();
    });

    twps.child("users/Ianus/dateOfBirth").on("value", function (snapshot) {
        actualDOB=snapshot.val();
        document.getElementById("actualDOB").innerHTML=snapshot.val();
    });

    twps.child("users/Ianus/typeOfUser").on("value", function (snapshot) {
        actualCat=snapshot.val();
        document.getElementById("actualCat").innerHTML=snapshot.val();
    });

    twps.child("users/Ianus/level").on("value", function (snapshot) {
        actualLev=snapshot.val();
        document.getElementById("actualLev").innerHTML=snapshot.val();
    });

}
