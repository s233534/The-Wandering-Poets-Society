
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
        location.href="Selected Story.html";
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
        location.href="Selected Story.html";
    }

}]);