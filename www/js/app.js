// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory("tutors", ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase("https://tutorsatseidenberg.firebaseio.com/tutors");

  //Query to filter out who's working
  var queryRef = itemsRef.orderByChild("atWork").equalTo(true);

  return $firebaseArray(queryRef);
}])

.factory("items", ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase("https://tutorsatseidenberg.firebaseio.com/items");

  return $firebaseArray(itemsRef);
}])

.controller('EmailCtrl', function($cordovaEmailComposer, $scope) {
  $cordovaEmailComposer.isAvailable().then(function() {
    // is available
    alert("available");
  }, function() {
    // not available
    alert("not available");
  });

  $scope.doSomething = function(email) {
    $ionicPopup.prompt({
      title: "Pressed in EmailCtrl",
      inputPlaceholder: 'Email: ' + email,
      okText: 'OK'
    }).then(function(res) {    // promise
    })
  }

  $scope.sendEmail = function(address) {

    var email = {
      to: address,
      subject: 'Tutor question',
    };

    $cordovaEmailComposer.open(email).then(null, function() {
      // user cancelled email
    });
  }
})

.controller("ListCtrl", function($scope, $ionicPopup, tutors, items, $ionicListDelegate) {
  $scope.tutors = tutors;
  $scope.items = items;
  $scope.addItem = function() {
    var name = prompt("What do you need to buy?");
    if (name) {
      $scope.items.$add({
        "name": name
      });
    }
  }

  $scope.purchaseItem = function(item) {
    var itemsRef = new Firebase("https://tutorsatseidenberg.firebaseio.com/items/" +
      item.$id);
    itemsRef.child('status').set('purchased');
    $ionicListDelegate.closeOptionButtons();
  }

  $scope.sellItem = function(item) {
    var itemsRef = new Firebase("https://tutorsatseidenberg.firebaseio.com/items/" +
      item.$id);
    $scope.items.$remove(item).then(function(ref) {
      ref.key() === item.$id; // true
    });

    $ionicListDelegate.closeOptionButtons();
  }

  $scope.sellItem = function(item) {
    var itemsRef = new Firebase("https://tutorsatseidenberg.firebaseio.com/items/" +
      item.$id);
    itemsRef.child('status').set('available');
    $ionicListDelegate.closeOptionButtons();
  }

  $scope.doSomething = function(email) {
    $ionicPopup.prompt({
      title: "Pressed in RegularCtrl",
      inputPlaceholder: 'Email: ' + email,
      okText: 'OK'
    }).then(function(res) {    // promise
    })
  }

})
