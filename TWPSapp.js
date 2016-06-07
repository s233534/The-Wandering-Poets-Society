
var app = angular.module("twpsApp", ["firebase"]);
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
app.controller("CreateUserCtrl", ["$scope", "Auth",
    function($scope, Auth) {
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

                location.href = "login.html";
            }).catch(function (error) {
                $scope.error = error;
            });
        };
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
        });
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
            var dateOfCreation=Date();
            var idautore=localStorage.UID;
            var nomeAutore=localStorage.attNome;
            var cognomeAutore=localStorage.attCognome;
            var author=nomeAutore+" "+cognomeAutore;
            var storyID=nomeAutore+"_"+cognomeAutore+"_"+title+"_"+subtitle;

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
app.controller("LibraryCtrl", ["$scope", "$firebaseArray", function($scope, $firebaseArray){
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

//Gestione lavori utente
app.controller("WorkCtrl", ["$scope", "$firebaseArray", function($scope, $firebaseArray){
    var workRef=new Firebase("https://twps.firebaseio.com/stories");
    $scope.stories=$firebaseArray(workRef);
    var usID=localStorage.UID;
    var query=workRef.orderByChild("idautore").equalTo(usID);
    $scope.filterStories=$firebaseArray(query);
    var list=$scope.filterStories;

    $scope.getTheStory=function($index) {
        var n=$index;
        var item = list[n];
        localStorage.storyReadID=item.$id;
        console.log(localStorage.storyReadID);
        location.href="selectedStory.html";
    }

}]);

//Gestione Storia selezionata
app.controller("attStoryCtrl", ["$scope", "$firebaseObject",
    function($scope, $firebaseObject){
        var ref=new Firebase("https://twps.firebaseio.com/stories");

        var SID=localStorage.storyReadID;
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
        });

        $scope.check=function(val){
            localStorage.setItem("numStars", val);
            $scope.checkStars();
        };

        $scope.checkStars=function(){
            var st = localStorage.getItem("numStars");
            var num = "star-" + st;
            document.getElementById(num).checked=true;
            var n = localStorage.numStars;
        };

        $scope.updateRating=function(){
            var storyID=localStorage.storyReadID;
            var pathST = ref.child(storyID);
            var n=parseInt(localStorage.numStars);
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