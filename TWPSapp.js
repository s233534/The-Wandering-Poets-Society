
var app = angular.module("twpsApp", ["firebase", 'ngFileUpload']);
/*
app.controller("ProfileCtrl", ["$scope", "$firebaseObject",  function($scope, $firebaseObject){
    var userRef=new Firebase("https://twps.firebaseio.com/users");
    $scope.profile=$firebaseObject(userRef.child('Ianus'));
    console.log($scope.profile);

}]);
*/

//riferimento database
app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var ref = new Firebase("https://twps.firebaseio.com");
        return $firebaseAuth(ref);
    }
]);

// Creazione utente e registrazione dati su database
app.controller("CreateUserCtrl", ["$scope", "Auth", "Upload",
    function($scope, Auth, Upload) {
        $scope.add = function () {
            console.log($scope.user.img);
        };

        $scope.createUser = function () {
            $scope.message = null;
            $scope.error = null;
            var Email = document.getElementById('mail').value;
            var pwd = document.getElementById('pass').value;

            Auth.$createUser({
                email: Email,
                password: pwd
            }).then(function (userData) {
                $scope.message = "User created with uid: " + userData.uid;
                localStorage.UID = userData.uid;
                console.log(userData.uid);

                var Email = document.getElementById('mail').value;
                var pwd = document.getElementById('pass').value;
                var firstName = document.getElementById('nom').value;
                var lastName = document.getElementById('cog').value;
                var cat = document.getElementById('usCat').value;
                var dob = document.getElementById('DOB').value;
                var pathUsers = new Firebase("https://twps.firebaseio.com/users");
                var attualUID = localStorage.UID;
                Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                    localStorage.passImg = base64Url;
                    console.log(localStorage.passImg);
                });
                var imgP=localStorage.passImg;
                
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
                    dateOfBirth: dob,
                    imageProfile: imgP
                });

                location.href = "login.html";
            }).catch(function (error) {
                $scope.error = error;
            });
        };

        $scope.removeUser = function(){
            $scope.message = null;
            $scope.error = null;
            var Email=localStorage.attEmail;
            var pwd=localStorage.attPassword;

            Auth.$removeUser({
                email: Email,
                password: pwd
            }).then(function() {
                $scope.message = "User removed";
                location.href="../index.html";
            }).catch(function(error) {
                $scope.error = error;
            });
        };

        $scope.changeEmail = function(){
            var userRef=new Firebase("https://twps.firebaseio.com/users");
            var UID=localStorage.UID;
            var oldMail=localStorage.attEmail;
            var newMail=document.getElementById("newEmail").value;
            var pwd=localStorage.attPassword;
            var confPwd=document.getElementById("confirmMailPassword").value;

            if(pwd===confPwd){
                Auth.$changeEmail({
                    oldEmail: oldMail,
                    newEmail: newMail,
                    password: pwd
                }).then(function() {
                    console.log("Email changed successfully!");
                    localStorage.attEmail=newMail;
                    userRef.child(UID).update({
                        email: newMail
                    });
                    location.href = "../userPage/userPage.html";
                }).catch(function(error) {
                    console.error("Error: ", error);
                });
            }else{
                window.alert("Password sbagliata");
                location.href = "modificheAccount.html";
            }

        };

        $scope.changePassword = function(){
            var userRef=new Firebase("https://twps.firebaseio.com/users");
            var UID=localStorage.UID;
            var Mail=localStorage.attEmail;
            var pwd=localStorage.attPassword;
            var confOldPwd=document.getElementById("oldPassword").value;
            var newPwd=document.getElementById("newPassword").value;
            var confNewPwd=document.getElementById("confirmNewPassword").value;

            if(pwd===confOldPwd && newPwd===confNewPwd){
                Auth.$changePassword({
                    email: Mail,
                    oldPassword: pwd,
                    newPassword: newPwd
                }).then(function() {
                    console.log("Password changed successfully!");
                    localStorage.attPassword=newPwd;
                    userRef.child(UID).update({
                        password: newPwd
                    });
                    location.href = "../userPage/userPage.html";
                }).catch(function(error) {
                    console.error("Error: ", error);
                });
            }else{
                window.alert("Password sbagliata");
                location.href = "modificheAccount.html";
            }
        }
    }
]);

//Autenticazione utente
app.controller("AuthCtrl", ["$scope", "$firebaseAuth",
    function($scope, $firebaseAuth) {
        var ref = new Firebase("https://twps.firebaseio.com");
        var auth = $firebaseAuth(ref);

        $scope.login = function() {
            var lmail=document.getElementById("logMail").value;
            var lpwd=document.getElementById("logPwd").value;
            console.log(lmail);
            console.log(lpwd);
            $scope.authData = null;
            $scope.error = null;

            auth.$authWithPassword({
                email: lmail,
                password: lpwd
            }).then(function(authData) {
                $scope.authData = authData;
                console.log("Logged in as:", authData.uid);
                localStorage.UID=authData.uid;
                console.log(localStorage.UID);
                location.href="../userPage/userPage.html";
            }).catch(function(error) {
                $scope.error = error;
                console.error("Authentication failed:", error);
            });
        };

        $scope.logout = function(){
            auth.$unauth();
            localStorage.clear();
            location.href="../login/login.html";
        }
    }
]);

//Per ora non so che farmene
app.factory("Profile", ["$firebaseObject",
    function($firebaseObject){
        return function (){
            var UID =localStorage.UID;
            var ref = new Firebase("https://twps.firebaseio.com/users");
            var profileRef= ref.child(UID);

            return $firebaseObject(profileRef);
        }
    }
]);

//Gestione profilo utente
app.controller("ProfileCtrl", ["$scope", "$firebaseObject",
    function($scope, $firebaseObject){
        var ref=new Firebase("https://twps.firebaseio.com/users");

        var UID=localStorage.UID;
        var obj = $firebaseObject(ref.child(UID));
        obj.$loaded().then(function() {
            $scope.profile=obj;
            console.log(obj.nome);
            localStorage.attNome=obj.nome;
            localStorage.attCognome=obj.cognome;
            localStorage.attEmail=obj.email;
            localStorage.attDOB=obj.dateOfBirth;
            localStorage.attLevel=obj.level;
            localStorage.attTOP=obj.typeOfUser;
            localStorage.attContSto=obj.countStories;
            localStorage.attContRev=obj.countReviews;
            localStorage.attContCom=obj.countComics;
            localStorage.attImage=obj.imageProfile;
            localStorage.attPassword=obj.password;
            localStorage.attImageProfile=obj.imageProfile;
        });
    }
]);

app.controller("EventCtrl", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray){
        var libraryRef=new Firebase("https://twps.firebaseio.com/stories");
        $scope.stories=$firebaseArray(libraryRef);
        var query=libraryRef.orderByChild("dataDiCreazione").limitToLast(5);
        $scope.filterStories=$firebaseArray(query);
        var list=$scope.filterStories;

        $scope.getTheStory=function($index) {
            var n=$index;
            var item = list[n];
            console.log(item);
            localStorage.storyReadID=item.$id;
            console.log(localStorage.storyReadID);

            location.href="selectedStory.html";
        }
    }
]);

//Creazione storia
app.controller("CreateStoryCtrl", ["$scope",
   function($scope){
       var storyRef=new Firebase("https://twps.firebaseio.com/stories");

        $scope.createStory=function () {
            $scope.message = null;
            $scope.error = null;
            var title=document.getElementById("titolo").value;
            var subtitle=document.getElementById("sottotitolo").value;
            var genre=document.getElementById("genere").value;
            var textArea=document.getElementById('my_text');
            var racconto=textArea.value;
            var dateOfCreation=new Date();
            var idautore=localStorage.UID;
            var nomeAutore=localStorage.attNome;
            var cognomeAutore=localStorage.attCognome;
            var author=nomeAutore+" "+cognomeAutore;
            var storyID=author+"_"+title+"_"+subtitle;
            var imgCre=localStorage.attImageProfile;

            var contStorie = parseInt(localStorage.attContSto);
            contStorie++;
            localStorage.attContSto=contStorie;

            var userRef = new Firebase("https://twps.firebaseio.com/users");
            var attUserRef = userRef.child(localStorage.UID);
            attUserRef.update({
                countStories: parseInt(localStorage.attContSto)
            });

            storyRef.child(storyID).set({
                titolo: title,
                sottotitolo: subtitle,
                genere: genre,
                testo: racconto,
                dataDiCreazione: dateOfCreation,
                idautore: idautore,
                autore:author,
                imageOfCreator: imgCre,
                rating: {
                    value: 0,
                    total: 0,
                    votes: 0
                }
            });

            location.href="../userPage/userWork.html";
        }



   }
]);

//Gestione Biblioteca
app.controller("LibraryCtrl", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray){
    var libraryRef=new Firebase("https://twps.firebaseio.com/stories");
    $scope.stories=$firebaseArray(libraryRef);
    var query=libraryRef.orderByChild("dataDiCreazione");
    $scope.filterStories=$firebaseArray(query);
    var list=$scope.filterStories;

    $scope.getTheStory=function($index) {
        var n=$index;
        var item = list[n];
        console.log(item);
        localStorage.storyReadID=item.$id;
        console.log(localStorage.storyReadID);
        
        location.href="selectedStory.html";
    }


}]);

app.controller("FumetteriaCtrl", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray){
        var comicRef=new Firebase("https://twps.firebaseio.com/comics");
        $scope.comics=$firebaseArray(comicRef);
        var query=comicRef.orderByChild("dataDiCreazione");
        $scope.filterComics=$firebaseArray(query);
        var list=$scope.filterComics;

        $scope.getTheComic=function($index) {
            var n=$index;
            var item = list[n];
            console.log(item);
            localStorage.comicReadID=item.$id;
            console.log(localStorage.comicReadID);

            location.href="selectedComic.html";
        }


}]);

app.controller("ArchivioCtrl", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray){
        var projectRef=new Firebase("https://twps.firebaseio.com/projects");
        $scope.projects=$firebaseArray(projectRef);
        var query=projectRef.orderByChild("dataDiCreazione");
        $scope.filterProjects=$firebaseArray(query);
        var list=$scope.filterProjects;

        $scope.getTheProject=function($index) {
            var n=$index;
            var item = list[n];
            console.log(item);
            localStorage.projectReadID=item.$id;
            console.log(localStorage.projectReadID);

            location.href="selectedProject.html";
        }


    }]);

//Gestione lavori utente
app.controller("WorkCtrl", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray){
    var workRef=new Firebase("https://twps.firebaseio.com/stories");
    $scope.stories=$firebaseArray(workRef);
    var usID=localStorage.UID;
    var queryStories=workRef.orderByChild("idautore").equalTo(usID);
    $scope.filterStories=$firebaseArray(queryStories);
    var listStories=$scope.filterStories;

    var comicRef=new Firebase("https://twps.firebaseio.com/comics");
    $scope.comics=$firebaseArray(comicRef);
    var queryComics=comicRef.orderByChild("idautore").equalTo(usID);
    $scope.filterComics=$firebaseArray(queryComics);
    var listComics=$scope.filterComics;

    var projectRef=new Firebase("https://twps.firebaseio.com/projects");
    $scope.projects=$firebaseArray(projectRef);
    var queryProjects=projectRef.orderByChild("idautore").equalTo(usID);
    $scope.filterProjects=$firebaseArray(queryProjects);
    var listProjects=$scope.filterProjects;

    var reviewRef=new Firebase("https://twps.firebaseio.com/reviews");
    $scope.reviews=$firebaseArray(reviewRef);
    var queryReviews=reviewRef.orderByChild("idautore").equalTo(usID);
    $scope.filterReviews=$firebaseArray(queryReviews);
    var listReviews=$scope.filterReviews;

    $scope.getTheStory=function($index) {
        var n=$index;
        var item = listStories[n];
        localStorage.storyReadID=item.$id;
        console.log(localStorage.storyReadID);
        location.href="selectedStory.html";
    };

    $scope.getTheComic=function($index) {
        var n=$index;
        var item = listComics[n];
        localStorage.comicReadID=item.$id;
        console.log(localStorage.comicReadID);
        //location.href="selectedComic.html";
    };

    $scope.getTheProject=function($index) {
        var n=$index;
        var item = listProjects[n];
        localStorage.projectReadID=item.$id;
        console.log(localStorage.projectReadID);
        //location.href="selectedProject.html";
    };

    $scope.getTheReview=function($index) {
        var n=$index;
        var item = listReviews[n];
        localStorage.reviewReadID=item.$id;
        console.log(localStorage.reviewReadID);
        //location.href="selectedReview.html";
    };

    $scope.openTextEditor=function(){
        location.href="../createText/textEditor.html";
    }

}]);

//Gestione Storia selezionata
app.controller("attStoryCtrl", ["$scope", "$firebaseObject",
    function($scope, $firebaseObject){
        var ref=new Firebase("https://twps.firebaseio.com/stories");

        var SID=localStorage.storyReadID;
        console.log(SID);
        var obj = $firebaseObject(ref.child(SID));
        obj.$loaded().then(function() {
            $scope.attStory=obj;
            console.log(obj.titolo);
            localStorage.attTitolo=obj.titolo;
            localStorage.attSottotitolo=obj.sottotitolo;
            localStorage.attAutore=obj.autore;
            localStorage.attGenere=obj.genere;
            localStorage.attVotes=obj.rating.votes;
            localStorage.attTotal=obj.rating.total;
            localStorage.attValue=obj.rating.value;
            localStorage.attIdAutore=obj.idautore;
            localStorage.attTesto=obj.testo;
            localStorage.attImageCreator=obj.imageOfCreator;

            var text=localStorage.attTesto;
            text = text.replace(/\n/gi, "<br />");
            document.getElementById('testoStory').innerHTML = text;

            if(localStorage.attIdAutore===localStorage.UID){
                document.getElementById("ratingContainer").style.display="none";
                document.getElementById("reviewContainer").style.display="none";
            }
        });

        $scope.check=function(val){
            localStorage.setItem("numStars", val);
            $scope.checkStars();
        };

        $scope.checkStars=function(){
            var st = localStorage.getItem("numStars");
            var num = "star-" + st;
            document.getElementById(num).checked=true;
        };

        $scope.updateRating=function(){
            var storyID=localStorage.storyReadID;
            var pathST = ref.child(storyID);
            var n=parseInt(localStorage.getItem("numStars"));
            var AttTotal = parseInt(localStorage.attTotal);
            var AttVotes = parseInt(localStorage.attVotes);

            var newTotal=AttTotal+n;
            var newVotes=AttVotes+1;
            var newValue=newTotal/newVotes;

            localStorage.attVotes=newVotes;
            localStorage.attTotal=newTotal;
            localStorage.attValue=newValue;

            pathST.update({
                rating: {
                    value: newValue,
                    votes: newVotes,
                    total: newTotal
                }
            });

        }

    }]);

app.controller("attStoryReviewCtrl", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray){
        var reviewRef=new Firebase("https://twps.firebaseio.com/reviews");
        $scope.reviews=$firebaseArray(reviewRef);
        var SID=localStorage.storyReadID;
        var queryReviews=reviewRef.orderByChild("idstoria").equalTo(SID).limitToLast(5);
        $scope.filterReviews=$firebaseArray(queryReviews);
    }
]);

app.controller("newReviewCtrl", ["$scope", 
    function ($scope) {
        var reviewRef = new Firebase("https://twps.firebaseio.com/reviews");
        
        $scope.createReview=function(){
            $scope.message = null;
            $scope.error = null;

            var textArea=document.getElementById('newReview');
            var recensione=textArea.value;
            var dateOfCreation=new Date();
            var idAutore=localStorage.UID;
            var nomeAutore=localStorage.attNome;
            var cognomeAutore=localStorage.attCognome;
            var author=nomeAutore+" "+cognomeAutore;
            var authorxid=nomeAutore+"_"+cognomeAutore;
            var idStoria=localStorage.storyReadID;
            var titleStoria=localStorage.attTitolo;
            var subtitleStoria=localStorage.attSottotitolo;
            var authorStoria=localStorage.attAutore;
            var titoloRecensione=document.getElementById("titoloReview").value;
            var idRecensione=authorxid+"_"+titoloRecensione+"_"+"recensione di:"+idStoria;

            var contRecensioni = parseInt(localStorage.attContRev);
            contRecensioni++;
            localStorage.attContRev=contRecensioni;

            var userRef = new Firebase("https://twps.firebaseio.com/users");
            var attUserRef = userRef.child(localStorage.UID);
            attUserRef.update({
                countReviews: parseInt(localStorage.attContRev)
            });

            reviewRef.child(idRecensione).set({
                titolo: titoloRecensione,
                autore: author,
                idstoria: idStoria,
                testo: recensione,
                idautore: idAutore,
                dataDiCreazione: dateOfCreation,
                titoloStoria: titleStoria,
                sottotitoloStoria: subtitleStoria,
                autoreStoria: authorStoria
            })
        }
    }
]);

app.controller("modificaProfiloCtrl", ["$scope",
    function($scope){
        var ref=new Firebase("https://twps.firebaseio.com/users");
        var path=ref.child(localStorage.UID);

        var attNome=localStorage.attNome;
        var attCognome=localStorage.attCognome;
        var attDOB=localStorage.attDOB;

        document.getElementById("modnom").placeholder=attNome;
        document.getElementById("modcog").placeholder=attCognome;
        document.getElementById("modDOB").placeholder=attDOB;

        console.log(attNome+" "+attCognome+" "+attDOB);

        
        $scope.updateProfile=function(){

            var newNome=document.getElementById("modnom").value;
            var newCognome=document.getElementById("modcog").value;
            var newDOB=document.getElementById("modDOB").value;
            var newTOP=document.getElementById("modTOP").value;

            if(newNome===""){
                newNome=localStorage.attNome;
            }

            if(newCognome===""){
                newCognome=localStorage.attCognome;
            }

            if(newDOB===""){
                newDOB=localStorage.attDOB;
            }

            path.update({
                nome: newNome,
                cognome: newCognome,
                dateOfBirth: newDOB,
                typeOfUser: newTOP
            });
            location.href="../userPage/userPage.html";

        };

    }

]);

app.controller("caricaImmagineCtrl", ["$scope", "Upload",
    function($scope, Upload){
        $scope.add = function () {
            console.log($scope.user.img);
        };

        $scope.addImgProfile = function () {


            Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                var imgData = base64Url;
                var ref=new Firebase("https://twps.firebaseio.com/users");
                var path=ref.child(localStorage.UID);
                path.update({
                    imageProfile: imgData
                });
                location.href="../userPage/userPage.html";
            });

        };
    }
]);




