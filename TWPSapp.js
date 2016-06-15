
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
            var confPwd=document.getElementById('confpass').value;

            if(pwd!==confPwd){
                document.getElementById('confpass').style.borderStyle="solid";
                document.getElementById('confpass').style.borderColor="red";
                document.getElementById('passwordSbagliata').style.display="block";
            }else{
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
                    }).then(function(){
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
                        }).then(function(){
                            location.href = "login.html";
                        });

                    });
                }).catch(function (error) {
                    $scope.error = error;
                    document.getElementById("iscrizioneFallita").style.display="block";
                });
            }
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
                var userRef=new Firebase("https://twps.firebaseio.com/users");
                var UID=localStorage.UID;
                userRef.child(UID).remove();
                $scope.message = "User removed";
            }).catch(function(error) {
                $scope.error = error;
            }).then(function () {
                location.href="../login/iscriviti.html";
            })
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

            document.getElementById("userPageContent").style.display="block";
        });
    }
]);

app.controller("EventCtrl", ["$scope", "$firebaseArray", "$firebaseObject",
    function($scope, $firebaseArray, $firebaseObject){
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
        };

        $scope.getTheAuthor=function($index){
            var n=$index;
            var item=list[n];
            localStorage.storyOfThisId=item.$id;
            var storyRef=new Firebase("https://twps.firebaseio.com/stories");
            var sobj=$firebaseObject(storyRef.child(localStorage.storyOfThisId));

            sobj.$loaded().then(function(){
                localStorage.storyOfThisIdAutore=sobj.idautore;
            });
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
            var textArea=document.getElementById('myText');
            var racconto=textArea.value;
            var dateOfCreation=new Date();
            var idautore=localStorage.UID;
            var nomeAutore=localStorage.attNome;
            var cognomeAutore=localStorage.attCognome;
            var author=nomeAutore+" "+cognomeAutore;
            var storyID=author+"_"+title+"_"+subtitle;
            var imgCre=localStorage.attImageProfile;

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
            }).then(function(){
                var contStorie = parseInt(localStorage.attContSto);
                contStorie++;
                localStorage.attContSto=contStorie;

                var userRef = new Firebase("https://twps.firebaseio.com/users");
                var attUserRef = userRef.child(localStorage.UID);
                attUserRef.update({
                    countStories: parseInt(localStorage.attContSto)
                });
            }).then(function(){
                location.href="../userPage/userWork.html";
            });


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
    listStories.$loaded().then(function(){
        if($scope.filterStories.length!==0){
            document.getElementById("userStoriesDiv").style.display="block";
        }
    });

    var comicRef=new Firebase("https://twps.firebaseio.com/comics");
    $scope.comics=$firebaseArray(comicRef);
    var queryComics=comicRef.orderByChild("idautore").equalTo(usID);
    $scope.filterComics=$firebaseArray(queryComics);
    var listComics=$scope.filterComics;
    listComics.$loaded().then(function () {
        if(listComics.length!==0){
            document.getElementById("userComicsDiv").style.display="block";
        }
    });

    var projectRef=new Firebase("https://twps.firebaseio.com/projects");
    $scope.projects=$firebaseArray(projectRef);
    var queryProjects=projectRef.orderByChild("idautore").equalTo(usID);
    $scope.filterProjects=$firebaseArray(queryProjects);
    var listProjects=$scope.filterProjects;
    listProjects.$loaded().then(function () {
        if(listProjects.length!==0){
            document.getElementById("userProjectsDiv").style.display="block";
        }
    });

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
        location.href="selectedComic.html";
    };

    $scope.getTheProject=function($index) {
        var n=$index;
        var item = listProjects[n];
        localStorage.projectReadID=item.$id;
        console.log(localStorage.projectReadID);
        location.href="selectedProject.html";
    };

    $scope.openTextEditor=function(){
        location.href="../createText/textEditor.html";
    };
        
    $scope.openComicEditor=function () {
        location.href="../createComic/createComic.html";
    };

    $scope.openProjectEditor=function(){
        location.href="../createProject/createProject.html";
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

            if(localStorage.attIdAutore!==localStorage.UID){
                document.getElementById("ratingContainer").style.display="block";
                document.getElementById("reviewContainer").style.display="block";
            }

            document.getElementById("selectedStoryContent").style.display="block";

            $scope.getTheAuthor=function(){
                localStorage.storyOfThisIdAutore=localStorage.attIdAutore;

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
        var queryReviews=reviewRef.orderByChild("idstoria").equalTo(SID);
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
            }).then(function(){
                var contRecensioni = parseInt(localStorage.attContRev);
                contRecensioni++;
                localStorage.attContRev=contRecensioni;

                var userRef = new Firebase("https://twps.firebaseio.com/users");
                var attUserRef = userRef.child(localStorage.UID);
                attUserRef.update({
                    countReviews: parseInt(localStorage.attContRev)
                });
            }).then(function(){
                location.href="selectedStory.html";
            })
        }
    }
]);





app.controller("SearchCtrl", ["$scope", "$firebaseArray", 
    function($scope, $firebaseArray){
        var searchCat=document.getElementById("searchCarat").value;
        console.log(searchCat);

        $scope.search=function(){
            var searchCat=document.getElementById("searchCarat").value;
            var searchVal=document.getElementById("searchCampo").value;

            var storyRef=new Firebase("https://twps.firebaseio.com/stories");
            var comicRef=new Firebase("https://twps.firebaseio.com/comics");
            var projectRef=new Firebase("https://twps.firebaseio.com/projects");

            $scope.stories=$firebaseArray(storyRef);
            var queryStories=storyRef.orderByChild(searchCat).equalTo(searchVal);
            $scope.filterStories=$firebaseArray(queryStories);
            var listStories=$scope.filterStories;

            $scope.comics=$firebaseArray(comicRef);
            var queryComics=comicRef.orderByChild(searchCat).equalTo(searchVal);
            $scope.filterComics=$firebaseArray(queryComics);
            var listComics=$scope.filterComics;
            
            $scope.projects=$firebaseArray(projectRef);
            var queryProjects=projectRef.orderByChild(searchCat).equalTo(searchVal);
            $scope.filterProjects=$firebaseArray(queryProjects);
            var listProjects=$scope.filterProjects;

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
                location.href="selectedComic.html";
            };

            $scope.getTheProject=function($index) {
                var n=$index;
                var item = listProjects[n];
                localStorage.projectReadID=item.$id;
                console.log(localStorage.projectReadID);
                location.href="selectedProject.html";
            };
        };

    }
]);

app.controller("attAuthorCtrl", ["$scope", "$firebaseObject",
    function ($scope, $firebaseObject) {
        var ref=new Firebase("https://twps.firebaseio.com/users");

        var USRID=localStorage.storyOfThisIdAutore;
        console.log(USRID);
        var obj = $firebaseObject(ref.child(USRID));
        console.log(obj);
        obj.$loaded().then(function() {
            $scope.profile=obj;
            console.log(obj.nome);
            document.getElementById("selectedAuthorContent").style.display="block";
        });
    }
]);


app.controller("UserListCtrl", ["$scope", "$firebaseArray", "$firebaseObject",
    function($scope, $firebaseArray, $firebaseObject){
        var userRef=new Firebase("https://twps.firebaseio.com/users");
        $scope.users=$firebaseArray(userRef);
        var query=userRef.orderByChild("nome");
        $scope.filterUsers=$firebaseArray(query);
        var list=$scope.filterUsers;

        $scope.getTheAuthor=function($index){
            var n=$index;
            var item=list[n];
            localStorage.storyOfThisId=item.$id;
            var userRef=new Firebase("https://twps.firebaseio.com/users");
            var obj=$firebaseObject(userRef.child(localStorage.storyOfThisId));

            obj.$loaded().then(function(){
                localStorage.storyOfThisIdAutore=localStorage.storyOfThisId;
            });
        }
    }
]);

app.controller("attAuthorWorkCtrl", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray){
        var workRef=new Firebase("https://twps.firebaseio.com/stories");
        $scope.stories=$firebaseArray(workRef);
        var USRID=localStorage.storyOfThisIdAutore;
        var queryStories=workRef.orderByChild("idautore").equalTo(USRID);
        $scope.filterStories=$firebaseArray(queryStories);
        var listStories=$scope.filterStories;
        listStories.$loaded().then(function(){
            if($scope.filterStories.length!==0){
                document.getElementById("storieAutoreSelezionato").style.display="block";
            }
        });


        var comicRef=new Firebase("https://twps.firebaseio.com/comics");
        $scope.comics=$firebaseArray(comicRef);
        var queryComics=comicRef.orderByChild("idautore").equalTo(USRID);
        $scope.filterComics=$firebaseArray(queryComics);
        var listComics=$scope.filterComics;
        listComics.$loaded().then(function () {
            if(listComics.length!==0){
                document.getElementById("fumettiAutoreSelezionato").style.display="block";
            }
        });


        var projectRef=new Firebase("https://twps.firebaseio.com/projects");
        $scope.projects=$firebaseArray(projectRef);
        var queryProjects=projectRef.orderByChild("idautore").equalTo(USRID);
        $scope.filterProjects=$firebaseArray(queryProjects);
        var listProjects=$scope.filterProjects;
        listProjects.$loaded().then(function () {
            if(listProjects.length!==0){
                document.getElementById("progettiAutoreSelezionato").style.display="block";
            }
        });


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
            location.href="selectedComic.html";
        };

        $scope.getTheProject=function($index) {
            var n=$index;
            var item = listProjects[n];
            localStorage.projectReadID=item.$id;
            console.log(localStorage.projectReadID);
            location.href="selectedProject.html";
        };

    }]);

app.controller("createComicCtrl", ["$scope",
    function($scope){
        var comicRef=new Firebase("https://twps.firebaseio.com/comics");

        $scope.createNewComic = function () {
            $scope.message = null;
            $scope.error = null;
            var title=document.getElementById("titoloFumetto").value;
            var subtitle=document.getElementById("sottotitoloFumetto").value;
            var genre=document.getElementById("genereFumetto").value;
            var dateOfCreation=new Date();
            var idAutore=localStorage.UID;
            var nomeAutore=localStorage.attNome;
            var cognomeAutore=localStorage.attCognome;
            var author=nomeAutore+" "+cognomeAutore;
            var comicID=author+"_"+title+"_"+subtitle;
            localStorage.comicInProgressID=comicID;
            var imgCre=localStorage.attImageProfile;



            comicRef.child(comicID).set({
                titolo: title,
                sottotitolo: subtitle,
                genere: genre,
                dataDiCreazione: dateOfCreation,
                idautore: idAutore,
                autore:author,
                imageOfCreator: imgCre,
                rating: {
                    value: 0,
                    total: 0,
                    votes: 0
                }

            }).then(function () {
                var contFumetti = parseInt(localStorage.attContCom);
                contFumetti++;
                localStorage.attContCom=contFumetti;

                var userRef = new Firebase("https://twps.firebaseio.com/users");
                var attUserRef = userRef.child(localStorage.UID);
                attUserRef.update({
                    countComics: parseInt(localStorage.attContCom)
                });
            }).then(function () {
                document.getElementById("imagesInputContainer").style.display="block";
            })

        };

    }
]);

app.controller("addComicPagesCtrl", ["$scope", "Upload",
    function($scope, Upload){
        var CID=localStorage.comicInProgressID;

        $scope.add1 = function () {
            console.log($scope.user.img);
        };

        $scope.addPagina1 = function () {
            Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                var imgData = base64Url;
                var ref=new Firebase("https://twps.firebaseio.com/comics");
                var CID=localStorage.comicInProgressID;
                var path=ref.child(CID);
                path.update({
                    pagina1: imgData
                }).then(function () {
                    document.getElementById("formPagina2").style.display="block";
                });
            });

        };

        $scope.add2 = function () {
            console.log($scope.user.img);
        };

        $scope.addPagina2 = function () {
            Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                var imgData = base64Url;
                var ref=new Firebase("https://twps.firebaseio.com/comics");
                var CID=localStorage.comicInProgressID;
                var path=ref.child(CID);
                path.update({
                    pagina2: imgData
                }).then(function () {
                    document.getElementById("formPagina3").style.display="block";
                });
            });

        };

        $scope.add3 = function () {
            console.log($scope.user.img);
        };

        $scope.addPagina3 = function () {
            Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                var imgData = base64Url;
                var ref=new Firebase("https://twps.firebaseio.com/comics");
                var CID=localStorage.comicInProgressID;
                var path=ref.child(CID);
                path.update({
                    pagina3: imgData
                }).then(function () {
                    document.getElementById("formPagina4").style.display="block";
                });
            });

        };

        $scope.add4 = function () {
            console.log($scope.user.img);
        };

        $scope.addPagina4 = function () {
            Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                var imgData = base64Url;
                var ref=new Firebase("https://twps.firebaseio.com/comics");
                var CID=localStorage.comicInProgressID;
                var path=ref.child(CID);
                path.update({
                    pagina4: imgData
                }).then(function () {
                    document.getElementById("formPagina5").style.display="block";
                });
            });

        };

        $scope.add5 = function () {
            console.log($scope.user.img);
        };

        $scope.addPagina5 = function () {
            Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                var imgData = base64Url;
                var ref=new Firebase("https://twps.firebaseio.com/comics");
                var CID=localStorage.comicInProgressID;
                var path=ref.child(CID);
                path.update({
                    pagina5: imgData
                }).then(function () {
                    document.getElementById("formPagina6").style.display="block";
                });
            });

        };

        $scope.add6 = function () {
            console.log($scope.user.img);
        };

        $scope.addPagina6 = function () {
            Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                var imgData = base64Url;
                var ref=new Firebase("https://twps.firebaseio.com/comics");
                var CID=localStorage.comicInProgressID;
                var path=ref.child(CID);
                path.update({
                    pagina6: imgData
                }).then(function () {
                    document.getElementById("formPagina7").style.display="block";
                });
            });

        };

        $scope.add7 = function () {
            console.log($scope.user.img);
        };

        $scope.addPagina7 = function () {
            Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                var imgData = base64Url;
                var ref=new Firebase("https://twps.firebaseio.com/comics");
                var CID=localStorage.comicInProgressID;
                var path=ref.child(CID);
                path.update({
                    pagina7: imgData
                }).then(function () {
                    document.getElementById("formPagina8").style.display="block";
                });
            });

        };

        $scope.add8 = function () {
            console.log($scope.user.img);
        };

        $scope.addPagina8 = function () {
            Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                var imgData = base64Url;
                var ref=new Firebase("https://twps.firebaseio.com/comics");
                var CID=localStorage.comicInProgressID;
                var path=ref.child(CID);
                path.update({
                    pagina8: imgData
                }).then(function () {
                    document.getElementById("formPagina9").style.display="block";
                });
            });

        };
        $scope.add9 = function () {
            console.log($scope.user.img);
        };

        $scope.addPagina9 = function () {
            Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                var imgData = base64Url;
                var ref=new Firebase("https://twps.firebaseio.com/comics");
                var CID=localStorage.comicInProgressID;
                var path=ref.child(CID);
                path.update({
                    pagina9: imgData
                }).then(function () {
                    document.getElementById("formPagina10").style.display="block";
                });
            });

        };

        $scope.add10 = function () {
            console.log($scope.user.img);
        };
        
        $scope.salvaFumetto=function () {
            Upload.base64DataUrl($scope.user.img).then(function (base64Url) {
                var imgData = base64Url;
                var ref=new Firebase("https://twps.firebaseio.com/comics");
                var path=ref.child(CID);
                path.update({
                    paginaFinale: imgData
                }).then(function () {
                   location.href="../userPage/userWork.html";
                });
            });
        }


    }
]);

app.controller("attComicCtrl", ["$scope", "$firebaseObject",
    function($scope, $firebaseObject){
        var ref=new Firebase("https://twps.firebaseio.com/comics");

        var CID=localStorage.comicReadID;
        console.log(CID);
        var obj = $firebaseObject(ref.child(CID));
        obj.$loaded().then(function() {
            $scope.attComic=obj;
            console.log(obj.titolo);
            localStorage.attComTitolo=obj.titolo;
            localStorage.attComSottotitolo=obj.sottotitolo;
            localStorage.attComAutore=obj.autore;
            localStorage.attComGenere=obj.genere;
            localStorage.attComVotes=obj.rating.votes;
            localStorage.attComTotal=obj.rating.total;
            localStorage.attComValue=obj.rating.value;
            localStorage.attIdAutore=obj.idautore;
            localStorage.attImageCreator=obj.imageOfCreator;

            if(obj.pagina1!==null){
                document.getElementById("attComicPage1").style.display="block";
            }

            if(obj.pagina2!==null){
                document.getElementById("attComicPage2").style.display="block";
            }

            if(obj.pagina3!==null){
                document.getElementById("attComicPage3").style.display="block";
            }

            if(obj.pagina4!==null){
                document.getElementById("attComicPage4").style.display="block";
            }

            if(obj.pagina5!==null){
                document.getElementById("attComicPage5").style.display="block";
            }

            if(obj.pagina6!==null){
                document.getElementById("attComicPage6").style.display="block";
            }

            if(obj.pagina7!==null){
                document.getElementById("attComicPage7").style.display="block";
            }

            if(obj.pagina8!==null){
                document.getElementById("attComicPage8").style.display="block";
            }

            if(obj.pagina9!==null){
                document.getElementById("attComicPage9").style.display="block";
            }

            if(obj.paginaFinale!==null){
                document.getElementById("attComicPage10").style.display="block";
            }

            if(localStorage.attIdAutore!==localStorage.UID){
                document.getElementById("ratingComicContainer").style.display="block";
                document.getElementById("reviewComicContainer").style.display="block";
            }

            $scope.getTheAuthor=function(){
                localStorage.storyOfThisIdAutore=localStorage.attIdAutore;

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
            var comicID=localStorage.comicReadID;
            var pathST = ref.child(comicID);
            var n=parseInt(localStorage.getItem("numStars"));
            var AttTotal = parseInt(localStorage.attComTotal);
            var AttVotes = parseInt(localStorage.attComVotes);

            var newTotal=AttTotal+n;
            var newVotes=AttVotes+1;
            var newValue=newTotal/newVotes;

            localStorage.attComVotes=newVotes;
            localStorage.attComTotal=newTotal;
            localStorage.attComValue=newValue;

            pathST.update({
                rating: {
                    value: newValue,
                    votes: newVotes,
                    total: newTotal
                }
            });

        }
    }
]);

app.controller("newReviewComicCtrl", ["$scope",
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
            var idComic=localStorage.comicReadID;
            var titleStoria=localStorage.attComTitolo;
            var subtitleStoria=localStorage.attComSottotitolo;
            var authorStoria=localStorage.attComAutore;
            var titoloRecensione=document.getElementById("titoloReview").value;
            var idRecensione=authorxid+"_"+titoloRecensione+"_"+"recensione di:"+idStoria;


            reviewRef.child(idRecensione).set({
                titolo: titoloRecensione,
                autore: author,
                idcomic: idComic,
                testo: recensione,
                idautore: idAutore,
                dataDiCreazione: dateOfCreation,
                titoloStoria: titleStoria,
                sottotitoloStoria: subtitleStoria,
                autoreStoria: authorStoria
            }).then(function(){
                var contRecensioni = parseInt(localStorage.attContRev);
                contRecensioni++;
                localStorage.attContRev=contRecensioni;

                var userRef = new Firebase("https://twps.firebaseio.com/users");
                var attUserRef = userRef.child(localStorage.UID);
                attUserRef.update({
                    countReviews: parseInt(localStorage.attContRev)
                });
            }).then(function(){
                location.href="selectedProject.html";
            })
        }
    }
]);

app.controller("attComicReviewCtrl", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray){
        var reviewRef=new Firebase("https://twps.firebaseio.com/reviews");
        $scope.reviews=$firebaseArray(reviewRef);
        var CID=localStorage.comicReadID;
        var queryReviews=reviewRef.orderByChild("idcomic").equalTo(CID);
        $scope.filterReviews=$firebaseArray(queryReviews);
    }
]);

app.controller("createProjectCtrl", ["$scope", 
    function($scope){
        var proRef=new Firebase("https://twps.firebaseio.com/projects");
        
        $scope.createNewProject=function(){
            $scope.message = null;
            $scope.error = null;
            var titPro=document.getElementById("titoloProgetto").value;
            var tipPro=document.getElementById("tipoProgetto").value;
            var text=document.getElementById("soggettoProgetto");
            var sectext=document.getElementById("motivazioniProgetto");
            var sogPro=text.value;
            var motPro=sectext.value;
            var idAutore=localStorage.UID;
            var nomeAutore=localStorage.attNome;
            var cognomeAutore=localStorage.attCognome;
            var author=nomeAutore+" "+cognomeAutore;
            var projectID=author+"_"+titPro+"_"+tipPro;
            var imgCre=localStorage.attImageProfile;

            proRef.child(projectID).set({
                titolo: titPro,
                tipologiaDelProgetto: tipPro,
                soggetto: sogPro,
                idautore: idAutore,
                autore: author,
                imageOfCreator: imgCre,
                partecipanti: author,
                motivazioni: motPro,
                rating: {
                    votes: 0,
                    total: 0,
                    value: 0
                }
            }).then(function(){
                location.href="../userPage/userWork.html";
            })
        }
    }
]);

app.controller("attProjectCtrl", ["$scope", "$firebaseObject",
    function($scope, $firebaseObject){
        var ref=new Firebase("https://twps.firebaseio.com/projects");

        var PID=localStorage.projectReadID;
        console.log(PID);
        var obj = $firebaseObject(ref.child(PID));
        obj.$loaded().then(function() {
            $scope.attProject=obj;
            console.log(obj.titolo);
            localStorage.attProTitolo=obj.titolo;
            localStorage.attProAutore=obj.autore;
            localStorage.attProTipo=obj.tipologiaDelProgetto;
            localStorage.attProVotes=obj.rating.votes;
            localStorage.attProTotal=obj.rating.total;
            localStorage.attProValue=obj.rating.value;
            localStorage.attIdAutore=obj.idautore;
            localStorage.attProSoggetto=obj.soggetto;
            localStorage.attImageCreator=obj.imageOfCreator;
            localStorage.attProPartecipanti=obj.partecipanti;
            localStorage.attProMotivazioni=obj.motivazioni;

            var text=localStorage.attProSoggetto;
            text = text.replace(/\n/gi, "<br />");
            document.getElementById('testoProject').innerHTML = text;

            var sectext=localStorage.attProMotivazioni;
            sectext = sectext.replace(/\n/gi, "<br />");
            document.getElementById('motiviProject').innerHTML = sectext;

            if(localStorage.attIdAutore!==localStorage.UID){
                document.getElementById("ratingContainer").style.display="block";
                document.getElementById("reviewContainer").style.display="block";
            }

            document.getElementById("selectedProjectContent").style.display="block";

            $scope.getTheAuthor=function(){
                localStorage.storyOfThisIdAutore=localStorage.attIdAutore;

            }
        });

        $scope.partecipa=function(){
            var proRef=new Firebase("https://twps.firebaseio.com/projects");
            var PID=localStorage.projectReadID;
            var oldPart=localStorage.attProPartecipanti;
            var newPart=oldPart+", "+localStorage.attNome+" "+localStorage.attCognome;
            if(localStorage.UID!==localStorage.attIdAutore){
                proRef.child(PID).update({
                    partecipanti: newPart
                })
            }
        };

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
            var projectID=localStorage.projectReadID;
            var pathST = ref.child(projectID);
            var n=parseInt(localStorage.getItem("numStars"));
            var AttTotal = parseInt(localStorage.attProTotal);
            var AttVotes = parseInt(localStorage.attProVotes);

            var newTotal=AttTotal+n;
            var newVotes=AttVotes+1;
            var newValue=newTotal/newVotes;

            localStorage.attProVotes=newVotes;
            localStorage.attProTotal=newTotal;
            localStorage.attProValue=newValue;

            pathST.update({
                rating: {
                    value: newValue,
                    votes: newVotes,
                    total: newTotal
                }
            });

        }

}]);

app.controller("newReviewProjectCtrl", ["$scope",
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
            var idProgetto=localStorage.projectReadID;
            var titleStoria=localStorage.attProTitolo;
            var subtitleStoria=localStorage.attProTipo;
            var authorStoria=localStorage.attProAutore;
            var titoloRecensione=document.getElementById("titoloReview").value;
            var idRecensione=authorxid+"_"+titoloRecensione+"_"+"recensione di:"+idStoria;


            reviewRef.child(idRecensione).set({
                titolo: titoloRecensione,
                autore: author,
                idprogetto: idProgetto,
                testo: recensione,
                idautore: idAutore,
                dataDiCreazione: dateOfCreation,
                titoloStoria: titleStoria,
                sottotitoloStoria: subtitleStoria,
                autoreStoria: authorStoria
            }).then(function(){
                var contRecensioni = parseInt(localStorage.attContRev);
                contRecensioni++;
                localStorage.attContRev=contRecensioni;

                var userRef = new Firebase("https://twps.firebaseio.com/users");
                var attUserRef = userRef.child(localStorage.UID);
                attUserRef.update({
                    countReviews: parseInt(localStorage.attContRev)
                });
            }).then(function(){
                location.href="selectedProject.html";
            })
        }
    }
]);

app.controller("attProjectReviewCtrl", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray){
        var reviewRef=new Firebase("https://twps.firebaseio.com/reviews");
        $scope.reviews=$firebaseArray(reviewRef);
        var PID=localStorage.projectReadID;
        var queryReviews=reviewRef.orderByChild("idprogetto").equalTo(PID);
        $scope.filterReviews=$firebaseArray(queryReviews);
    }
]);


/*

 <script src="//code.jquery.com/jquery-1.10.2.js"></script>
 <script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
 */