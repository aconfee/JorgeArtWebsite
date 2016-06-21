(function(){

  angular
    .module('PortfolioSPAModule')
    .service('ProjectsService', ProjectsService);

  ProjectsService.$inject = ['$sce', '$http'];
  function ProjectsService($sce, $http){
    var service = this;

    ///
    /// Get a project page by its id.
    ///
    service.GetProjectPage = function(projectId, callback){

      $http.get('/api/projects/' + projectId).then(
        function(response){
          if(response.status === 200){
            callback(MapProjectDataToVm(response.data));
          }
        },
        function(response){
          console.error("Something went wrong getting project page " + projectId);
          // TODO: Redirect to 404 not found.
      });
    };

    ///
    /// Map the data returned by a project page to its view model.
    ///
    var MapProjectDataToVm = function(data){
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
  }

})();
