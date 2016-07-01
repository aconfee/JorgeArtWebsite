(function(){

  angular
    .module('PortfolioSPAModule')
    .service('ProjectsService', ProjectsService);

  ProjectsService.$inject = ['$sce', '$http', 'DataMappingService'];
  function ProjectsService($sce, $http, DataMappingService){
    var service = this;

    service.allProjectsFilter = undefined;
    service.filmProjectsFilter = "film";
    service.artProjectsFilter = "art";

    ///
    /// Get all the projects raw data
    ///
    service.GetAllProjects = function(callback){
      $http.get('/api/projects/').then(
        function(response){
          if(response.status === 200){

            response.data.sort(function(a, b) {
              return a.position > b.position;
            });

            callback(response.data);
          }
        },
        function(response){
          console.error("Something went wrong getting all projects.");
          // TODO: Redirect to 404 not found.
      });
    };

    ///
    /// Get a project page by its id.
    ///
    service.GetProjectPage = function(projectId, callback){

      $http.get('/api/projects/' + projectId).then(
        function(response){
          if(response.status === 200){
            callback(DataMappingService.MapProjectDataToProjectPageVm(response.data));
          }
        },
        function(response){
          console.error("Something went wrong getting project page " + projectId);
          // TODO: Redirect to 404 not found.
      });
    };

    ///
    /// Get all projects as they are needed on the home page.
    ///
    service.GetProjectsHomePage = function(category, callback){

      if(category !== service.allProjectsFilter &&
        category !== service.filmProjectsFilter &&
        category !== service.artProjectsFilter){
          console.error("Invalid category provided: " + category);
          return;
      }

      $http.get('/api/projects/').then(
        function(response){
          if(response.status === 200){
            var filteredProjectsList = FilterProjectsByCategory(response.data, category);
            var mapped =  DataMappingService.MapProjectsDataToHomePageVm(filteredProjectsList);

            callback(mapped);
          }
        },
        function(response){
          console.log("Something went wrong while getting all projects.");
      });
    };

    ///
    /// Filter the projects by the provided category.
    ///
    var FilterProjectsByCategory = function(projects, category){
      var filteredProjects = [];

      if(category === service.allProjectsFilter){
        return projects;
      }

      for(var i = 0; i < projects.length; i++){
        // If the project category matches, add it to our results.
        if(projects[i].category === category){
          filteredProjects.push(projects[i]);
        }
      }

      return filteredProjects;
    };
  }

})();
