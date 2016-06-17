(function(){
  angular
    .module('PortfolioSPAModule')
    .service('ProjectsGalleryService', ProjectsGalleryService);

  var smallScreenMax = 600;
  var mediumScreenMax = 1000;

  ProjectsGalleryService.$inject = ['$window'];
  function ProjectsGalleryService($window){
    var service = this;

    ///
    /// Call out to our API to get projects.
    ///
    service.GetProjects = function(){
      // Get aspect ratio and store in db when uploaded.
      // Replace with $http call.
      var projectsDto = [
        {"image": "/images/NoMan1.jpg", "aspect": 0.665},
        {"image": "/images/NoMan2.jpg", "aspect": 1.78},
        {"image": "/images/NoMan3.jpg", "aspect": 1.77},
        {"image": "/images/NoMan4.jpg", "aspect": 1.77},
        {"image": "/images/NoMan5.jpeg", "aspect": 1.777},
        {"image": "/images/NoMan6.jpg", "aspect": 1.77}
      ];

      return MapProjectsDtoToVm(projectsDto);
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
