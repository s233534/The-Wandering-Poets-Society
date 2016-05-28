
var app = angular.module("twpsApp", ["firebase"]);
/*
app.controller("ProfileCtrl", ["$scope", "$firebaseObject",  function($scope, $firebaseObject){
    var userRef=new Firebase("https://twps.firebaseio.com/users");
    $scope.profile=$firebaseObject(userRef.child('Ianus'));
    console.log($scope.profile);

}]);
*/

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

app.controller("WorkCtrl", ["$scope", "$firebaseArray", function($scope, $firebaseArray){
    var workRef=new Firebase("https://twps.firebaseio.com/stories");
    $scope.stories=$firebaseArray(workRef);
    var usID=localStorage.UID;
    var query=workRef.orderByChild("idautore").equalTo(usID);
    $scope.filterStories=$firebaseArray(query);
    var list=$scope.filterStories;

    $scope.getTheStory=function($index) {
        var n=$index;
        console.log(n);
        var item = list[n];
        console.log(item);
        localStorage.storyReadID=item.$id;
        console.log(localStorage.storyReadID);
        location.href="selectedStory.html";
    }

}]);

app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var ref = new Firebase("https://twps.firebaseio.com");
        return $firebaseAuth(ref);
    }
]);

// and use it in our controller
app.controller("SampleCtrl", ["$scope", "Auth",
    function($scope, Auth) {
        $scope.createUser = function() {
            $scope.message = null;
            $scope.error = null;

            Auth.$createUser({
                email: $scope.email,
                password: $scope.password
            }).then(function(userData) {
                $scope.message = "User created with uid: " + userData.uid;
                location.href="login/login.html";
                console.log(userData.uid);
            }).catch(function(error) {
                $scope.error = error;
            });
        };

        $scope.removeUser = function() {
            $scope.message = null;
            $scope.error = null;

            Auth.$removeUser({
                email: $scope.email,
                password: $scope.password
            }).then(function() {
                $scope.message = "User removed";
            }).catch(function(error) {
                $scope.error = error;
            });
        };
    }
]);

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
    }
]);

app.controller("ProfileCtrl", ["$scope", "$firebaseObject",
    function($scope, $firebaseObject){
        var ref=new Firebase("https://twps.firebaseio.com/users");

        var UID=localStorage.UID;
        $scope.profile=$firebaseObject(ref.child(UID));
    }
]);