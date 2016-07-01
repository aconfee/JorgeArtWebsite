(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('dashboardController', dashboardController);

  dashboardController.$inject = ['$scope', '$location', '$http', 'ProjectsService', 'AuthentictionService'];
  function dashboardController($scope, $location, $http, ProjectsService, AuthentictionService){

    var viewModel = this;
    viewModel.projects = [];
    viewModel.projectToDelete = {};

    // Immediatelly check if a user is logged in, otherwise leave.
    if(AuthentictionService.isLoggedIn() === false){
      $location.path('/login');
    }

    ///
    /// Request the projects to disply on the home page.
    ///
    ProjectsService.GetAllProjects(function(projects){
      viewModel.projects = projects;
    });

    viewModel.markForDelete = function(index){
      viewModel.projectToDelete = viewModel.projects[index];
    };

    viewModel.deleteProject = function(){
      $http.delete('/api/projects/' + viewModel.projectToDelete._id, {
        headers: {
          Authorization: 'Bearer ' + AuthentictionService.getToken()
        }
      }).then(
        function(response){

          // Refresh projects list.
          ProjectsService.GetAllProjects(function(projects){
            viewModel.projects = projects;
          });
        },
        function(response){
          console.err("Something went wrong deleting a profile.");
      });
    };
  }

})();
