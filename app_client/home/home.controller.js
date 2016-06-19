// Using function scopes to prevent global scope variables.
// God, I can't wait to use typescript.
(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('homeController', homeController);

  homeController.$inject = ['$scope', '$window', '$location', '$sce', 'ProjectsGalleryService'];
  function homeController($scope, $window, $location, $sce, ProjectsGalleryService){
    var viewModel = this;
    var currentProjectsCategoryFilter = $location.search().category; // Once per 'page load'

    viewModel.showVideo = currentProjectsCategoryFilter === undefined; // Promo on 'all' page.

    // TODO: Make the main gallery a directive and pass projectRows into it.
    viewModel.projects = ProjectsGalleryService.GetProjects(currentProjectsCategoryFilter);

    // Turn into a service to return screen width and height.
    // This service should have a method to just get num of rows that should display.
    angular.element($window).bind('resize', function () {
      // Possiblity to cache here... if necessary.
      viewModel.projects = ProjectsGalleryService.GetProjects(currentProjectsCategoryFilter);
      $scope.$apply(); // This is needed here... will occasionally update on its own.
    });

    viewModel.videoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/CJ_GCPaKywg");
  }

})();
