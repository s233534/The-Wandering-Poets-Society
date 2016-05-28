/**
 * Created by giancarloavalle on 04/05/16.
 */

function openTextEditor() {
    window.open("../createText/textEditor.html");
}

function check(val) {
    localStorage.setItem("numStars", val);
    checkStars();
}
function checkStars() {
    var st = localStorage.getItem("numStars");
    var num = "star-" + st;
    document.getElementById(num).checked=true;
    var n = localStorage.numStars;
    console.log(n);
}

function updateRating(){
    var path=new Firebase("https://twps.firebaseio.com/stories")
    var storyID=localStorage.storyReadID;
    var n=localStorage.numStars;
    console.log(n);

    var pathST = path.child(storyID);
    var pathRat= pathST.child("rating");
    var pathTot=pathRat.child("total");
    var pathVot=pathRat.child("votes");
/*
    pathTot.on("value", function(snapshot){
        var attTot=snapshot.val();
        attTot=attTot+n;
        pathRat.update({
            total: attTot
        });
        pathVot.on("value", function(snapshot){
            var attVot=snapshot.val();
            attVot=attVot+1;
            pathRat.update({
                votes: attVot
            });
            console.log(vot);
            var val=tot/vot;
            pathRat.update({
                values: val
            });
            console.log(val);
        });
    });
 */
}