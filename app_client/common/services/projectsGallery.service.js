(function(){

  angular
    .module('PortfolioSPAModule')
    .service('ProjectsGalleryService', ProjectsGalleryService);



  ProjectsGalleryService.$inject = ['$window'];
  function ProjectsGalleryService($window){
    var service = this;

    var smallScreenMax = 600;
    var mediumScreenMax = 1000;

    service.allProjectsFilter = "ALL";
    service.filmProjectsFilter = "FILM";
    service.artProjectsFilter = "ART";

    ///
    /// Call out to our API to get projects.
    /// Filtr them by the appropriate category.
    /// Organize them into rows according to screen size.
    ///
    service.GetProjects = function(category){
      // Get aspect ratio and store in db when uploaded.
      // Replace with $http call.
      var projectsDto = [
        {"image": "/images/NoMan1.jpg", "aspect": 0.665, "category": "FILM"},
        {"image": "/images/NoMan2.jpg", "aspect": 1.78, "category": "ART"},
        {"image": "/images/NoMan3.jpg", "aspect": 1.77, "category": "ART"},
        {"image": "/images/NoMan4.jpg", "aspect": 1.77, "category": "ART"},
        {"image": "/images/NoMan5.jpeg", "aspect": 1.777, "category": "ART"},
        {"image": "/images/NoMan6.jpg", "aspect": 1.77, "category": "FILM"}
      ];

      var filteredProjectsList = FilterProjectsByCategory(projectsDto, category);
      return MapProjectsDtoToVm(filteredProjectsList);
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

    ///
    /// Get the number of projects we want to show in a row based on how
    /// big the screen is.
    ///
    var GetRowSize = function(){
      var rowSize = 1;

      if($window.innerWidth > smallScreenMax){
        rowSize = 2;
      }

      if($window.innerWidth > mediumScreenMax){
        rowSize = 3;
      }

      return rowSize;
    };

    ///
    /// Take an array of projects and map them to a 2D array of relevent
    /// project info to be used by the view.
    ///
    var MapProjectsDtoToVm = function(projects){
      if(projects === undefined){
        console.error("projects is undefined.");
        return;
      }

      if(projects.length === 0){
        console.error("No projects in the projects array.");
        return;
      }

      if(Array.isArray(projects) === false){
        console.error("Array of projects not provided.");
        return;
      }

      var rowSize = GetRowSize();
      var projectGroups = [];
      var rows = projects.length / rowSize;

      if(rows === 0) rows = 1;

      for (var y = 0; y < rows; y++) {
        projectGroups.push([]);

        for(var x = 0; x < rowSize; x++){
          // Break if no projects remaining.
          var projectsIndex = (rowSize * y) + x;
          if(projectsIndex === projects.length) break;

          projectGroups[y].push(projects[ projectsIndex ]);
        }
      }

      return projectGroups;
    };

  }
})();
