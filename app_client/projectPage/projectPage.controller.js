(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('projectPageController', projectPageController);

  projectPageController.$inject = ['$window', '$routeParams', 'ProjectsService'];
  function projectPageController($window, $routeParams, ProjectsService){
    var viewModel = this;

    viewModel.projectId = $routeParams.projectid;

    // Make sure we always start at the top of the page.
    $window.scrollTo(0, 0);

    ProjectsService.GetProjectPage($routeParams.projectid, function(pageData){
      viewModel.blogItems = pageData;
    });
  }

})();
