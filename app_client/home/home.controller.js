angular
  .module('PortfolioSPAModule')
  .controller('homeController', homeController);

homeController.$inject = ['$scope', '$window', 'ProjectsGalleryService'];
function homeController($scope, $window, ProjectsGalleryService){
  var viewModel = this;

  // TODO: Make the main gallery a directive and pass projectRows into it.
  viewModel.projects = ProjectsGalleryService.GetProjects();

  // Turn into a service to return screen width and height.
  // This service should have a method to just get num of rows that should display.
  angular.element($window).bind('resize', function () {
    // Possiblity to cache here... if necessary.
    console.log("controller resizing.");
    viewModel.projects = ProjectsGalleryService.GetProjects();
    $scope.$apply();
  });

  viewModel.exampleData = {
    exampleItem: 'Example text from home controller being passed to example-directive.'
  };
}
