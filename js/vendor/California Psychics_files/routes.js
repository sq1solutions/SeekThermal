 angular.module('CP.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  // Main Menu State Setup

  .state('mainmenu', {
    url: '/main-menu',
    abstract: true, 
    templateUrl: "main-menu.html"
  })

   // Authentication

  .state('mainmenu.signin', {
    url: "/sign-in",
    views: {
      'menuContent': {
        templateUrl: "templates/auth/sign-in.html",
        controller: 'SignInCtrl'
      }
    }
  })

  .state('signout', {
    url: "/sign-out",
    controller: 'SignOutCtrl'
  })

  .state('forgotpassword', {
    url: '/forgot-password', 
    templateUrl: 'templates/auth/forgot-password.html'
  })

  .state('retrievepin', {
    url: '/retrieve-pin',
    templateUrl: 'templates/auth/retrieve-pin.html',
    controller: 'RetrievePinCtrl'
  })

  .state('retrievalsuccess', {
    url: '/retrieval-success',
    templateUrl: 'templates/auth/retrieval-success.html',
    controller: 'RetrievalSuccessCtrl'
  })
    .state('privacy', {
    url: '/privacy',
    templateUrl: 'templates/footer/privacy.html',
  })

    .state('terms', {
    url: '/terms',
    templateUrl: 'templates/footer/terms.html',
  })

   // Main Menu 

  .state('psychiclist', {
    url: "/psychic-list",
    templateUrl: "templates/main-menu/psychic-list.html",
    controller: "PsychicListCtrl"
  })
  .state('psychic', {
    url: "/psychic/:extId",
    templateUrl: "templates/main-menu/psychic-detail.html",
    controller: "PsychicDetailCtrl"
  })

  .state('mainmenu.adddollars', {
    url: "/add-dollars",
    views: {
      'menuContent': {
        templateUrl: "templates/main-menu/add-dollars.html",
        controller: "AddDollarsCtrl"
      }
    }
  })

  .state('mainmenu.psychiclist', {
    url: "/horoscopes",
    views: {
      'menuContent': {
        templateUrl: "templates/main-menu/horoscopes.html",
        controller: "HoroscopesCtrl"
      }
    }
  })

  .state('mainmenu.about', {
    url: "/about-ue",
    views: {
      'menuContent': {
        templateUrl: "templates/main-menu/about-us.html",
        controller: "AboutUsCtrl"
      }
    }
  })

  .state('mainmenu.myaccount', {
    url: "/my-account",
    views: {
      'menuContent': {
        templateUrl: "templates/main-menu/my-account.html",
        controller: "MyAccountCtrl"
      }
    }
  })

  .state('mainmenu.support', {
    url: "/support",
    views: {
      'menuContent': {
        templateUrl: "templates/main-menu/support.html",
        controller: "SupportCtrl"
      }
    }
  });

  $urlRouterProvider.otherwise("/main-menu/sign-in");

});