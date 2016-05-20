function getVR1G1() {
    var twps=new Firebase("https://twps.firebaseio.com");


    var path = twps.child("stories");
    var pathSt = path.child("Giancarlo_Avalle_Viaggio_Oltre_L'Impossibile_R1G1");
    pathSt.child("titolo").on("value", function(snapshot) {
        var prova=snapshot.val();
        console.log(prova);
        document.getElementById("titoloR1G1").innerHTML=snapshot.val();
    });

    pathSt.child("sottotitolo").on("value", function (snapshot) {
        document.getElementById("sottotitoloR1G1").innerHTML=snapshot.val();
    });

    pathSt.child("testo").on("value", function (snapshot) {
        var acaptest = snapshot.val();
        acaptest = acaptest.replace(/\n/gi, "<br />");
        document.getElementById("testoR1G1").innerHTML=acaptest;
    });
}

