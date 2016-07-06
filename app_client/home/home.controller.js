// Using function scopes to prevent global scope variables.
// God, I can't wait to use typescript.
(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('homeController', homeController);

  homeController.$inject = ['$scope', '$window', '$location', '$sce', 'ProjectsService'];
  function homeController($scope, $window, $location, $sce, ProjectsService){
    var viewModel = this;
    var categoryFilter = $location.search().category; // Once per 'page load'

    console.log("entering home page controller");

    viewModel.videoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/CJ_GCPaKywg");
    viewModel.showVideo = categoryFilter === undefined; // Promo on 'all' page.

    ///
    /// Request the projects to disply on the home page.
    ///
    ProjectsService.GetProjectsHomePage(categoryFilter, function(projectsVm){
      viewModel.projects = projectsVm;
    });

    ///
    /// Re-get the projects if page is resized (getting projects will rebuild the rows
    /// according to screen size).
    /// TODO: Only get projects when resizing is done so we're not making a million calls.
    ///
    /*
    angular.element($window).bind('resize', function () {
      // Possiblity to cache here... if necessary.
      ProjectsService.GetProjectsHomePage(categoryFilter, function(projectsVm){
        viewModel.projects = projectsVm;
        //$scope.$apply(); // Not needed... two way bind automatically digests.
      });
    });
    */
  }

})();
