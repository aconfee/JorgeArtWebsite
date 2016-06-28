/*
* Angular application.
*/

(function(){

  // Define the app module and it's dependencies.
  angular.module('PortfolioSPAModule', ['ngRoute']);

  // Create a config for our app -- configure our routes.
  function config ($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeController',
        controllerAs: 'viewModel'
      })
      .when('/about', {
        templateUrl: 'about/about.view.html',
        controller: 'aboutController',
        controllerAs: 'viewModel'
      })
      .when('/projects/:projectid', {
        templateUrl: 'projectPage/projectPage.view.html',
        controller: 'projectPageController',
        controllerAs: 'viewModel'
      })
      .when('/login', {
        templateUrl: '/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'viewModel'
      })
      .when('/admin', {
        templateUrl: '/admin/admin.view.html',
        controller: 'adminController',
        controllerAs: 'viewModel'
      })
      .otherwise({redirectTo: '/'});

    // Pretty up URLs. Base defined in index.html.
    $locationProvider.html5Mode(true);
  }

  // Add the config to our app.
  angular
    .module('PortfolioSPAModule')
    .config(['$routeProvider', '$locationProvider', config]);

})();
