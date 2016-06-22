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
      var blogItems = [];

      var i = 0;
      for(i = 0; i < data.videos.length; i++){
        // Trust the link provided and add.
        data.videos[i].source = $sce.trustAsResourceUrl(data.videos[i].source);
        blogItems.push(data.videos[i]);
      }

      for(i = 0; i < data.textBlocks.length; i++){
        blogItems.push(data.textBlocks[i]);
      }

      for(i = 0; i < data.coverImages.length; i++){
        blogItems.push(data.coverImages[i]);
      }

      for(i = 0; i < data.galleries.length; i++){
        blogItems.push(data.galleries[i]);
      }

      for(i = 0; i < data.pageBreaks.length; i++){
        blogItems.push(data.pageBreaks[i]);
      }

      // Sort the list by position
      blogItems.sort(function(a, b) {
        return a.position > b.position;
      });

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

          projectRows[y].push(projects[ projectsIndex ]);
        }
      }

      return projectRows;
    };

  }

})();
