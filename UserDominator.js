var twps=new Firebase("https://twps.firebaseio.com");

var usID="";
var path="";
var pathUs="";
var pathNome="";
var pathCognome="";
var pathEmail="";
var pathPassword="";
var pathTOP="";
var pathLev="";
var pathDOB="";
var pathCountSt="";
var pathCountCo="";
var pathCountRe="";
var actNome="";
var actCognome="";
var actDOB="";
var actEmail="";
var actPWD="";
var actTOP="";
var actLev="";
var actCountSt="";
var actCountCo="";
var actCountRe="";
var prova="";
var attAutore="";
var storyID="";

function isc() {
    var Email=document.getElementById('mail').value;
    var pwd=document.getElementById('pass').value;

    twps.createUser({
        email    : Email,
        password : pwd
    }, function(error, userData) {
        if (error) {
            console.log("Error creating user:", error);
            if(confirm("Iscrizione fallita: se sei già iscritto clicca su accedi," +
                    "altrimenti ritenta")){
                window.location.reload();
            }
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
            localStorage.UID=userData.uid;
            console.log(localStorage.UID);
            setDataUser();
            function openLog() {
                location.href="Login.html";
            }
            openLog();
        }
    });

}

function setDataUser(){
    var Email=document.getElementById('mail').value;
    var pwd=document.getElementById('pass').value;
    var firstName=document.getElementById('nom').value;
    var lastName=document.getElementById('cog').value;
    var cat=document.getElementById('usCat').value;
    var dob=document.getElementById('DOB').value;


    var pathUsers=new Firebase("https://twps.firebaseio.com/users");
    var attualUID=localStorage.UID
    pathUsers.child(attualUID).set({
        nome: firstName,
        cognome: lastName,
        email: Email,
        password: pwd,
        typeOfUser: cat,
        countStories: 0,
        countComics: 0,
        countReviews: 0,
        level: "Discepolo",
        dateOfBirth: dob
    });


}

function login() {
    /*
     function isValidKey(lMail) {
     var invalidKeys = { '': '', '$': '$', '.': '.', '#': '#', '[': '[', ']': ']' };
     return invalidKeys[lMail] === undefined;
     }
     */

    var lMail=document.getElementById('logMail').value;
    var lpwd=document.getElementById('logPwd').value;

    twps.authWithPassword({
        email    : lMail,
        password : lpwd
    },  authHandler);
    function authHandler(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
            if(confirm("Login Fallito: " +
                    "se non sei ancora iscritto, iscriviti " +
                    "altrimenti ritenta")){
                window.location.reload();
            }
        } else {
            console.log("Authenticated successfully with payload:", authData);
            localStorage.UID = authData.uid;
            console.log(localStorage.UID);

            path=new Firebase("https://twps.firebaseio.com/users");



            function setUserData() {
                var pathUs=path.child(localStorage.UID);
                pathUs.child("nome").on("value", function(snapshot) {
                    localStorage.nomeAttuale=snapshot.val();
                    console.log(localStorage.nomeAttuale);
                });

                pathUs.child("cognome").on("value", function(snapshot) {
                    localStorage.cognomeAttuale=snapshot.val();
                });

                pathUs.child("email").on("value", function(snapshot) {
                    localStorage.emailAttuale=snapshot.val();
                });

                pathUs.child("password").on("value", function(snapshot) {
                    localStorage.pwdAttuale=snapshot.val();
                });

                pathUs.child("dateOfBirth").on("value", function(snapshot) {
                    localStorage.dobAttuale=snapshot.val();
                });

                pathUs.child("typeOfUser").on("value", function(snapshot) {
                    localStorage.topAttuale=snapshot.val();
                });

                pathUs.child("level").on("value", function(snapshot) {
                    localStorage.livelloAttuale=snapshot.val();
                });

                pathUs.child("countStories").on("value", function(snapshot) {
                    localStorage.contatoreStorieAttuale=snapshot.val();
                });

                pathUs.child("countComics").on("value", function(snapshot) {
                    localStorage.contatoreFumettiAttuale=snapshot.val();
                });

                pathUs.child("countReviews").on("value", function(snapshot) {
                    localStorage.contatoreRecensioniAttuale=snapshot.val();
                    location.href="../User%20page/User%20page%20template.html";
                });

            }
            setUserData();


        }

    }

}

function attualUserData(){
    console.log(localStorage.nomeAttuale);

    actNome=localStorage.nomeAttuale;
    actCognome=localStorage.cognomeAttuale;
    actDOB=localStorage.dobAttuale;
    actTOP=localStorage.topAttuale;
    actLev=localStorage.livelloAttuale;

    document.getElementById('nomeattuale').innerHTML=actNome;
    document.getElementById('cognomeattuale').innerHTML=actCognome;
    document.getElementById('dobattuale').innerHTML=actDOB;
    document.getElementById('catattuale').innerHTML=actTOP;
    document.getElementById('levattuale').innerHTML=actLev;

}

function logOut() {
    twps.unauth();
    localStorage.clear();
    function openIndex() {
        location.href="../index.html";
    }
    openIndex();
}

function createStory() {
    usID=localStorage.UID;
    console.log(usID);

    function isValidKey(usID) {
        var invalidKeys = { '': '', '$': '$', '.': '.', '#': '#', '[': '[', ']': ']' };
        return invalidKeys[usID] === undefined;
    }

    path=new Firebase("https://twps.firebaseio.com/stories");
    if(isValidKey(usID)){
        path.orderByChild("idautore").equalTo(usID).on("value", function (snapshot) {
            console.log(snapshot.val());
            if(snapshot.val()==null){
                location.href="../Create%20text/Text%20Editor.html";
            }else{

                window.alert("Non puoi creare più di un racconto a settimana," +
                    "conserva la tua storia e postala fra un po' di tempo");

            }
        });
    }
}

function goToEditor() {
    usID=localStorage.UID;
    console.log(usID);
    location.href="../Create%20text/Text%20Editor.html";
}

function saveText(){

    path=new Firebase("https://twps.firebaseio.com/users");
    usID=localStorage.UID;
    pathUs=path.child(usID);

    var title=document.getElementById('titolo').value;
    var subtitle=document.getElementById('sottotitolo').value;
    var author=localStorage.nomeAttuale+" "+localStorage.cognomeAttuale;
    var genre=document.getElementById('genere').value;
    var textArea=document.getElementById('my_text');
    var racconto=textArea.value;
    var idAutore=localStorage.UID;
    var dateOfCreation=Date();

    var story=twps.child("stories");

    var actStoryID=story.push({
        titolo: title,
        sottotitolo: subtitle,
        autore: author,
        genere: genre,
        testo: racconto,
        idautore: idAutore,
        dataDiCreazione: dateOfCreation
    });

    var contStorie=parseInt(localStorage.contatoreStorieAttuale);
    contStorie++;
    localStorage.contatoreStorieAttuale=contStorie;

    storyID=actStoryID.key();


    pathUs.update({
        countStories: parseInt(localStorage.contatoreStorieAttuale)

    });

    openUserWork();
}

function getStories() {
    usID=localStorage.UID;
    console.log(usID);

    function isValidKey(usID) {
        var invalidKeys = { '': '', '$': '$', '.': '.', '#': '#', '[': '[', ']': ']' };
        return invalidKeys[usID] === undefined;
    }

    path=new Firebase("https://twps.firebaseio.com/stories");
    if(isValidKey(usID)){
        path.orderByChild("idautore").equalTo(usID).on("value", function (snapshot) {
            console.log(snapshot.val());
            snapshot.forEach(function (childSnapshot) {
                var key= childSnapshot.key();
                localStorage.storyID=key;
            });
        });
    }

    storyID=localStorage.storyID;
    var pathST=path.child(storyID);

    pathST.child("titolo").on("value", function(snapshot) {
        var prova=snapshot.val();
        console.log(prova);
        document.getElementById("titoloUserWork").innerHTML=snapshot.val();
    });

    document.getElementById('idUserWork').innerHTML=usID;
}

function goToAttualWork() {
    location.href="Attual User Work.html";
}

function setAttualStory(){
    path=new Firebase("https://twps.firebaseio.com/stories")
    storyID=localStorage.storyReadID;

    var pathST = path.child(storyID);

    pathST.child("titolo").on("value", function(snapshot) {
        document.getElementById("titoloStory").innerHTML=snapshot.val();
    });

    pathST.child("sottotitolo").on("value", function(snapshot) {
        document.getElementById("sottotitoloStory").innerHTML=snapshot.val();
    });

    pathST.child("testo").on("value", function (snapshot) {
        var text = snapshot.val();
        text = text.replace(/\n/gi, "<br />");
        document.getElementById('testoStory').innerHTML = text;
    });
}

function deleteTheStory() {
    path = new Firebase("https://twps.firebaseio.com/stories");
    storyID = localStorage.storyID;
    var pathST = path.child(storyID);
    pathST.onDisconnect().remove();
    location.href="Demo User Work.html";
}