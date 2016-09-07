(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('projectPageController', projectPageController);

  projectPageController.$inject = ['$window', '$routeParams', '$location', 'ProjectsService'];
  function projectPageController($window, $routeParams, $location, ProjectsService){
    var viewModel = this;
    viewModel.project = {};

    viewModel.projectId = $routeParams.projectid;

    // Make sure we always start at the top of the page.
    $window.scrollTo(0, 0);

    ProjectsService.GetProject(viewModel.projectId, function(project){
      viewModel.project = project;
    });

    ProjectsService.GetProjectPage($routeParams.projectid, function(pageData){
      viewModel.blogItems = pageData;

      console.log('proejct received');
      setTimeout(function(){
        console.log('parsing pins...');
        $window.parsePins();
      }, 500);
    });

    viewModel.nextProject = function(){
      ProjectsService.GetAllProjects(function(projects){
        var i = 0;
        for(; i < projects.length; i++){
          if(projects[i]._id === viewModel.project._id){
            break;
          }
        }

        if(i === projects.length - 1){
          i = -1;
        }

        $location.path('/projects/' + projects[i + 1]._id);
      });
    };

    viewModel.previousProject = function(){
      ProjectsService.GetAllProjects(function(projects){
        var i = 0;
        for(; i < projects.length; i++){
          if(projects[i]._id === viewModel.project._id){
            break;
          }
        }

        if(i === 0){
          i = projects.length;
        }

        $location.path('/projects/' + projects[i - 1]._id);
      });
    };
  }

})();
