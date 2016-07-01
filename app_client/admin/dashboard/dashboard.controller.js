(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('dashboardController', dashboardController);

  dashboardController.$inject = ['$scope', '$location', '$http', 'ProjectsService', 'AuthentictionService'];
  function dashboardController($scope, $location, $http, ProjectsService, AuthentictionService){

    // Immediatelly check if a user is logged in, otherwise leave.
    if(AuthentictionService.isLoggedIn() === false){
      $location.path('/login');
    }

    var viewModel = this;

    viewModel.projects = [];

    ///
    /// Request the projects to disply on the home page.
    ///
    ProjectsService.GetAllProjects(function(projects){
      viewModel.projects = projects;
    });

    viewModel.logout = function(){
      AuthentictionService.logout();
      $location.path('/');
    };
  }

})();
