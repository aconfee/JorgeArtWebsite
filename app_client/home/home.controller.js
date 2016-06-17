// Using function scopes to prevent global scope variables.
// God, I can't wait to use typescript.
(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('homeController', homeController);

  homeController.$inject = ['$scope', '$window', 'ProjectsGalleryService'];
  function homeController($scope, $window, ProjectsGalleryService){
    var viewModel = this;
    var currentProjectsCategoryFilter = ProjectsGalleryService.allProjectsFilter;

    // TODO: Make the main gallery a directive and pass projectRows into it.
    viewModel.projects = ProjectsGalleryService.GetProjects(currentProjectsCategoryFilter);

    // Turn into a service to return screen width and height.
    // This service should have a method to just get num of rows that should display.
    angular.element($window).bind('resize', function () {
      // Possiblity to cache here... if necessary.
      viewModel.projects = ProjectsGalleryService.GetProjects(currentProjectsCategoryFilter);
    });

    viewModel.exampleData = {
      exampleItem: 'Example text from home controller being passed to example-directive.'
    };

    viewModel.GetProjects = function(categoryFilter){
      if(categoryFilter != ProjectsGalleryService.allProjectsFilter &&
        categoryFilter != ProjectsGalleryService.filmProjectsFilter &&
        categoryFilter != ProjectsGalleryService.artProjectsFilter){
          console.error("Invalid categoryFilter provided: " + categoryFilter);
          return;
      }

      currentProjectsCategoryFilter = categoryFilter;
      viewModel.projects = ProjectsGalleryService.GetProjects(categoryFilter);
    };
  }

})();
