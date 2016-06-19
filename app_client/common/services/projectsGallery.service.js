(function(){

  angular
    .module('PortfolioSPAModule')
    .service('ProjectsGalleryService', ProjectsGalleryService);



  ProjectsGalleryService.$inject = ['$window'];
  function ProjectsGalleryService($window){
    var service = this;

    var smallScreenMax = 600;
    var mediumScreenMax = 1366;

    service.allProjectsFilter = undefined;
    service.filmProjectsFilter = "film";
    service.artProjectsFilter = "art";

    ///
    /// Call out to our API to get projects.
    /// Filtr them by the appropriate category.
    /// Organize them into rows according to screen size.
    ///
    service.GetProjects = function(category){

      if(category !== service.allProjectsFilter &&
        category !== service.filmProjectsFilter &&
        category !== service.artProjectsFilter){
          console.error("Invalid category provided: " + category);
          return;
      }

      // Get aspect ratio and store in db when uploaded.
      // Replace with $http call.
      // build another document of data consisting of specific project page.. all
      // the blog components.
      var projectsDto = [
        {
          "id": "100", // use this to navigate to specific project url
          "name": "NoMansSky", // could be useful
          "image": "/images/NoMan1.jpg",
          "aspect": 0.665,
          "category": "film"
        },
        {
          "id": "101",
          "name": "NoMansSky2",
          "image": "/images/NoMan2.jpg",
          "aspect": 1.78,
          "category": "art"
        },
        {
          "id": "102",
          "name": "NoMansSky3",
          "image": "/images/NoMan3.jpg",
          "aspect": 1.77,
          "category": "art"
        },
        {
          "id": "103",
          "name": "NoMansSky4",
          "image": "/images/NoMan4.jpg",
          "aspect": 1.77,
          "category": "art"
        },
        {
          "id": "104",
          "name": "NoMansSky5",
          "image": "/images/NoMan5.jpeg",
          "aspect": 1.777,
          "category": "art"
        },
        {
          "id": "105",
          "name": "NoMansSky6",
          "image": "/images/NoMan6.jpg",
          "aspect": 1.77,
          "category": "film"
        }
      ];

      var filteredProjectsList = FilterProjectsByCategory(projectsDto, category);
      return service.MapProjectsDtoToVm(filteredProjectsList);
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
    service.MapProjectsDtoToVm = function(projects){
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
      var projectRows = [];
      var rows = projects.length / rowSize;

      if(rows === 0) rows = 1;

      var projectsIndex = 0;
      for (var y = 0; y < rows; y++) {
        projectRows.push([]);

        for(var x = 0; x < rowSize; x++, projectsIndex++){
          // Break if no projects remaining.
          if(projectsIndex === projects.length) break;

          projectRows[y].push(projects[ projectsIndex ]);
        }
      }

      return projectRows;
    };

  }
})();
