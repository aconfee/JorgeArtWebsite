(function(){
  angular
    .module('PortfolioSPAModule')
    .controller('imageGalleryController', imageGalleryController)
    .directive('imageGallery', imageGallery);

  function imageGallery(){
    return{
      restrict:'EA',
      scope:{
        content: '=content'
      },
      templateUrl: '/common/directives/imageGallery/imageGallery.directive.html',
      controller: imageGalleryController,
      controllerAs: 'ctrl'
    };
  }

  ///
  /// Define a controller for this image gallery to use.
  ///
  imageGalleryController.$inject = ['$scope', '$window'];
  function imageGalleryController($scope, $window){
    var ctrl = this;
    var tinyScreenMax = 600;
    var smallScreenMax = 650;
    var mediumScreenMax = 1000;
    // Never really want more than 4 columns or balance starts to look shit.

    ctrl.GalleryThumbClick = function(){
      console.log("thumb clicked!");
    };

    angular.element($window).bind('resize', function () {
      console.log("resizing");
      // Possiblity to cache here... if necessary.
      ctrl.imageThumbs = FormatImageList($scope.content); // format images with new number of columns based on screen size.
      $scope.$apply(); // This is needed here... will occasionally update on its own.
    });

    var GetNumberOfColumns = function(){
      var numCols = 2;

      //if($window.innerWidth > tinyScreenMax){
        numCols = 2;
      //}
      if($window.innerWidth > smallScreenMax){
        numCols = 3;
      }
      if($window.innerWidth > mediumScreenMax){
        numCols = 4;
      }

      return numCols;
    };

    var FormatImageList = function(images){
      var columns = [];
      var numColumns = GetNumberOfColumns();
      var rows = Math.ceil(images.length / numColumns);

      var imagesIndex = 0;
      for (var y = 0; y < rows; y++) {
        for(var x = 0; x < numColumns; x++, imagesIndex++){
          if(columns[x] === undefined){
            columns.push([]);
          }

          // Break if no projects remaining.
          if(imagesIndex === images.length) break;

          columns[x].push(images[ imagesIndex ]);
        }
      }

      return columns;
    };

    ctrl.imageThumbs = FormatImageList($scope.content);
  }

})();
