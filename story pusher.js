var twps=new Firebase("https://twps.firebaseio.com");

function inviaTesto(){
    var pathStorie=twps.child("stories");
    var pathStory=pathStorie.child("Amstel_Sodyba_J_1");

    var testoScritto=document.getElementById("textPusher").value;


    pathStory.update({
        testo: testoScritto
    });
}