function getFO() {
    var twps=new Firebase("https://twps.firebaseio.com");


    var path = twps.child("stories");
    var pathSt = path.child("Giancarlo_Avalle_Le_Fantasmagoriche_Open");
    pathSt.child("titolo").on("value", function(snapshot) {
        var prova=snapshot.val();
        console.log(prova);
        document.getElementById("titoloFO").innerHTML=snapshot.val();
    });

    pathSt.child("sottotitolo").on("value", function (snapshot) {
        document.getElementById("sottotitoloFO").innerHTML=snapshot.val();
    });

    pathSt.child("testo").on("value", function (snapshot) {
        var acaptest = snapshot.val();
        acaptest = acaptest.replace(/\n/gi, "<br />");
        document.getElementById("testoFO").innerHTML=acaptest;
    });
}

