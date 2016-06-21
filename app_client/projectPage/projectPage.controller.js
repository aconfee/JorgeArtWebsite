(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('projectPageController', projectPageController);

  projectPageController.$inject = ['$window', '$routeParams', 'ProjectsService'];
  function projectPageController($window, $routeParams, ProjectsService){
    var viewModel = this;

    // Make sure we always start at the top of the page.
    $window.scrollTo(0, 0);

    // DEBUG TODO REMOVE
    viewModel.projectId = $routeParams.projectid;

    ProjectsService.GetProjectPage($routeParams.projectid, function(pageData){
      viewModel.blogItems = pageData;
    });
  }

})();
