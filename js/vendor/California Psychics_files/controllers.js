 angular.module('CP.controllers', [])

.controller('MainCtrl', ['$scope', '$ionicSideMenuDelegate', '$cookieStore', 'getSitePhoneNumber', function($scope, $ionicSideMenuDelegate, $cookieStore, getSitePhoneNumber) {
  $scope.loggedIn = $cookieStore.get('loggedIn');

  if ($scope.loggedIn == "true")
    $scope.loggedOut = "";
  else
    $scope.loggedOut = "true";

  $scope.displayNameHeader = $cookieStore.get('displayNameHeader');
  $scope.displayNameMenu = $cookieStore.get('displayNameMenu');

  $scope.$on("userLoggedIn",function(event,params) {
      $scope.loggedIn = params.loggedIn;
      $scope.displayNameHeader = params.displayNameHeader;
      $scope.displayNameMenu = params.displayNameMenu;
  });

  $scope.leftButtons = [{
    type: 'button-icon button ion-navicon',
    tap: function(e) {
      $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
    }
  }];

  getSitePhoneNumber.get().success(function(data){
    var phone = data.masPhoneNumber;
    phone = phone.substring(0,3).concat(".", phone.substring(3,6), ".", phone.substring(6,10));
    $scope.masPhoneNumber = phone;
  });

}])

.controller('SignInCtrl', ['$rootScope', '$scope', '$http', '$location', '$cookieStore', 'userService', 'getError', function($rootScope, $scope, $http, $location, $cookieStore, userService, getError) {
  $scope.showForm = true;
  $scope.formData = {};
  var displayNameHeader = "";
  var displayNameMenu = "";
  
  $scope.signIn = function(){
      userService.authenticate(this.formData).
        success(function(data){
          displayNameHeader = (data.displayName != "") ? data.displayName : data.firstName;
          displayNameMenu = (data.displayName != "") ? data.displayName : (data.firstName + " " + data.lastName);

          $cookieStore.put('authToken', data.sessionId);
          $cookieStore.put('custId', data.custId);
          $cookieStore.put('displayNameHeader', displayNameHeader);
          $cookieStore.put('displayNameMenu', displayNameMenu);
          $cookieStore.put('loggedIn', 'true');

          $rootScope.$broadcast('userLoggedIn',{'displayNameHeader': displayNameHeader, 'displayNameMenu': displayNameMenu, 'loggedIn': "true"});

          $location.path('/psychic-list');
        }).
        error(function(data){
          //$scope.error = getError.message(data);
          $scope.error = 'Invalid Email Address/PIN. Please Try Again.';
        });
    }
}])

.controller('SignOutCtrl', ['$rootScope', '$scope', '$location', '$cookieStore', 'getError', function($rootScope, $scope, $location, $cookieStore, getError) {
  $cookieStore.put('loggedIn','');
  $rootScope.$broadcast('userLoggedIn',{'displayNameHeader': "", 'displayNameMenu': "", 'loggedIn': ""});
  $location.path('/sign-in');
}])

.controller('RetrievePinCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.showForm = true;
  $scope.formData = {};

  $scope.retrievePin = function(){
    formData = this.formData;
    $http({
      url: baseUrl + '/account/retrievepin',
      method: 'POST',
      data: { email: formData.email, birthDate: formData.birthDate.concat("T07:00:00.000Z") },
      cache: false,
      responseType: 'json'
    }).
    success(function(data, status, headers, config){
      console.log('retrieve pin success');
    }).
    error(function(data){
        //$scope.error = getError.message(data);
        $scope.error = 'Invalid Email Address/Birthdate. Please Try Again.';
    });
  }
}])



.controller('CustomerStatusCtrl', ['$rootScope', '$scope', '$http', '$state', 'getError', function($rootScope, $scope, $http, $state, getError) {
  $scope.showForm = true;
  
  $scope.getCustomerStatus = function(){
    $http({
      url: baseUrl + '/account',
      method: 'POST',
      data: { custId: $rootScope.custId },
      cache: false,
      responseType: 'json'
    }).
    success(function(data, status, headers, config){
      console.log('getting customer status success');
    }).
    error(function(data){
      $scope.error = getError.message(data);
    });
  }
  
}])


.controller('PsychicListCtrl', ['$scope', '$http', '$state', 'getPsychics', function($scope, $http, $state, getPsychics) {
  $scope.showForm = true;
  $scope.psychics = [];

  getPsychics.all().success(function(data){
    $scope.psychics = data;
  });
  
}])

.controller('PsychicDetailCtrl', ['$scope', '$http', '$state', '$stateParams', 'getPsychics', function($scope, $http, $state, $stateParams, getPsychics) {
  $scope.showForm = true;
  $scope.psychic = [];

  getPsychics.get($stateParams.extId).success(function(data){
    $scope.psychic = data;
  });
  
}]);


