(function(){

  angular
    .module('PortfolioSPAModule')
    .service('DataMappingService', DataMappingService);

  DataMappingService.$inject = ['$sce', 'ResponsiveService'];
  function DataMappingService($sce, ResponsiveService){
    var service = this;

    ///
    /// Map the data returned by a project page to its view model.
    ///
     service.MapProjectDataToProjectPageVm = function(data){
      var blogItems = data.pageItems;

      // Sort the list by position
      blogItems.sort(function(a, b) {
        return a.position > b.position;
      });

      // Trust all video links as secure.
      for(var i = 0; i < data.pageItems.length; i++){
        if(data.pageItems[i].type === "video"){
          data.pageItems[i].content = $sce.trustAsResourceUrl(data.pageItems[i].content);
        }
      }

      return blogItems;
    };

    ///
    /// Take an array of projects and map them to a 2D array of relevent
    /// project info to be used by the view.
    ///
    service.MapProjectsDataToHomePageVm = function(projects){
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

      projects.sort(function(a, b) {
        return a.position > b.position;
      });

      var rowSize = ResponsiveService.GetHomePageRowSize();
      var projectRows = [];
      var rows = projects.length / rowSize;

      if(rows === 0) rows = 1;

      var projectsIndex = 0;
      for (var y = 0; y < rows; y++) {
        projectRows.push([]);

        for(var x = 0; x < rowSize; x++, projectsIndex++){
          // Break if no projects remaining.
          if(projectsIndex === projects.length) break;

          if(rowSize === 1){
            projects[projectsIndex].projectCoverImageAspectRatio = 1;
          }

          projectRows[y].push(projects[ projectsIndex ]);
        }
      }

      return projectRows;
    };

  }

})();
