


function getJ1() {
    var twps=new Firebase("https://twps.firebaseio.com");


    var path = twps.child("stories");
    var pathSt = path.child("Amstel_Sodyba_J_1");
    pathSt.child("titolo").on("value", function(snapshot) {
        var prova=snapshot.val();
        console.log(prova);
        document.getElementById("titoloJ1").innerHTML=snapshot.val();
    });

    pathSt.child("sottotitolo").on("value", function (snapshot) {
        document.getElementById("sottotitoloJ1").innerHTML=snapshot.val();
    });

    pathSt.child("testo").on("value", function (snapshot) {
        var acaptest = snapshot.val();
        acaptest = acaptest.replace(/\n/gi, "<br />");
        document.getElementById("testoJ1").innerHTML=acaptest;
    });
}

