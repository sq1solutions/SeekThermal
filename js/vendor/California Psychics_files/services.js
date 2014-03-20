angular.module('CP.services', [])

.service('loggedInStatus', function () {
  var loggedIn = "";
  return {
    getStatus: function () {
      return loggedIn;
    },
    setStatus: function (value) {
      loggedIn = value;
    }
  };
})

.service('getError', function() {
  return {
    message: function(data) {
      if (!!data && !!data.responseStatus)
        return data.responseStatus.message;
      else
        return "There was an error. Please contact the customer support.";
    }
  }
})

.service('getSitePhoneNumber', ['$http', function($http) {
  return {
    get: function() {
      return $http({
        url: baseUrl + '/site',
        method: 'GET',
        cache: false,
        responseType: 'json'
      });
    }
  };
}])

.service('userService', ['$http', function($http){
  return {
    authenticate: function(data) {
      return $http({
        url: baseUrl + '/authenticate',
        method: 'POST',
        headers: { "Authorization": "Basic " + btoa(data.email + ':' + data.pin) },
        cache: false,
        responseType: 'json'
      });
    }
  };
}])

.service('getPsychics', ['$http', function($http) {
  return {
    all: function() {
      return $http({
        url: baseUrl + '/psychics',
        method: 'GET',
        cache: false,
        responseType: 'json'
      });
    },
    get: function(extId) {
      // Simple index lookup
      return $http({
        url: baseUrl + '/psychics/' + extId,
        method: 'GET',
        cache: false,
        responseType: 'json'
      });
    }
  };
}])

.service('userInfoFactory', ['$http', function($http) {
  return {
    get: function(custId) {
      // Simple index lookup
      return $http({
        url: baseUrl + '/customers/' + custId + '/details',
        method: 'GET',
        cache: false,
        responseType: 'json'
      });
    }
  };
}])
;