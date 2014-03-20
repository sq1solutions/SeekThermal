
var baseUrl = "https://qa2-ext-m-api.californiapsychics.com";

function getError(data) {
  if (!!data && !!data.responseStatus)
    return data.responseStatus.message;
  return "There was an error. Please contact the customer support.";
}

// When ready...
window.addEventListener("load",function() {
  // Set a timeout...
  setTimeout(function(){
    // Hide the address bar!
    window.scrollTo(0, 1);
  }, 0);
});

//added run command to be able to use root data throughout the application.
angular.module('CP', ['ionic', 'ngCookies', 'CP.routes', 'CP.controllers', 'CP.factories', 'CP.services'])



.run(function($rootScope){})
.directive('numbersOnly', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '' 
           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
});


