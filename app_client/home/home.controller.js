// Using function scopes to prevent global scope variables.
// God, I can't wait to use typescript.
(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('homeController', homeController);

  homeController.$inject = ['$scope', '$window', '$location', '$sce', 'ProjectsService', 'ResponsiveService'];
  function homeController($scope, $window, $location, $sce, ProjectsService, ResponsiveService){
    var viewModel = this;
    var categoryFilter = $location.search().category; // Once per 'page load'

    // For row resize.
    var currentWidth = $window.innerWidth;
    var rowSize = ResponsiveService.GetHomePageRowSize();

    viewModel.videoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/CJ_GCPaKywg");
    viewModel.coverImage = "./images/cover.png";
    viewModel.showVideo = categoryFilter === undefined; // Promo on 'all' page.

    ///
    /// Request the projects to disply on the home page.
    ///
    ProjectsService.GetProjectsHomePage(categoryFilter, function(projectsVm){
      viewModel.projects = projectsVm;
    });

    ///
    /// Adjust the row sizes if need be.
    ///
    angular.element($window).bind('resize', function () {

      // Don't resize if width hasn't changed.
      if($window.innerWidth === currentWidth){
        return;
      }

      // Don't resize if we don't actually need to adjust row size.
      if(rowSize === ResponsiveService.GetHomePageRowSize()){
        return;
      }

      console.log("resizing");

      currentWidth = $window.innerWidth;
      rowSize = ResponsiveService.GetHomePageRowSize();

      // Possiblity to cache here... if necessary.
      ProjectsService.GetProjectsHomePage(categoryFilter, function(projectsVm){
        viewModel.projects = projectsVm;
        //$scope.$apply(); // Not needed... two way bind automatically digests.
      });
    });
  }

})();
