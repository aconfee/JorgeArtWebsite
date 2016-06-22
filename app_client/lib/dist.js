/*
* Angular application.
*/

(function(){

  // Define the app module and it's dependencies.
  angular.module('PortfolioSPAModule', ['ngRoute']);

  // Create a config for our app -- configure our routes.
  function config ($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeController',
        controllerAs: 'viewModel'
      })
      .when('/about', {
        templateUrl: 'about/about.view.html',
        controller: 'aboutController',
        controllerAs: 'viewModel'
      })
      .when('/projects/:projectid', {
        templateUrl: 'projectPage/projectPage.view.html',
        controller: 'projectPageController',
        controllerAs: 'viewModel'
      })
      .otherwise({redirectTo: '/'});

    // Pretty up URLs. Base defined in index.html.
    $locationProvider.html5Mode(true);
  }

  // Add the config to our app.
  angular
    .module('PortfolioSPAModule')
    .config(['$routeProvider', '$locationProvider', config]);

})();

(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('projectPageController', projectPageController);

  projectPageController.$inject = ['$window', '$routeParams', 'ProjectsService'];
  function projectPageController($window, $routeParams, ProjectsService){
    var viewModel = this;

    // Make sure we always start at the top of the page.
    $window.scrollTo(0, 0);

    ProjectsService.GetProjectPage($routeParams.projectid, function(pageData){
      viewModel.blogItems = pageData;
    });
  }

})();

// Using function scopes to prevent global scope variables.
// God, I can't wait to use typescript.
(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('homeController', homeController);

  homeController.$inject = ['$scope', '$window', '$location', '$sce', 'ProjectsService'];
  function homeController($scope, $window, $location, $sce, ProjectsService){
    var viewModel = this;
    var categoryFilter = $location.search().category; // Once per 'page load'

    viewModel.videoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/CJ_GCPaKywg");
    viewModel.showVideo = categoryFilter === undefined; // Promo on 'all' page.

    ///
    /// Request the projects to disply on the home page.
    ///
    ProjectsService.GetProjectsHomePage(categoryFilter, function(projectsVm){
      viewModel.projects = projectsVm;
    });

    ///
    /// Re-get the projects if page is resized (getting projects will rebuild the rows
    /// according to screen size).
    /// TODO: Only get projects when resizing is done so we're not making a million calls.
    ///
    angular.element($window).bind('resize', function () {
      // Possiblity to cache here... if necessary.
      ProjectsService.GetProjectsHomePage(categoryFilter, function(projectsVm){
        viewModel.projects = projectsVm;
        //$scope.$apply(); // Not needed... two way bind automatically digests.
      });
    });
  }

})();

angular
  .module('PortfolioSPAModule')
  .controller('aboutController', aboutController);

aboutController.$inject = ['$scope'];
function aboutController($scope){
  var viewModel = this;

  viewModel.myVariable = "I'm pretty cool, I guess.";
}

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
            var filteredProjectsList = FilterProjectsByCategory(response.data.projects, category);
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

(function(){

  angular
    .module('PortfolioSPAModule')
    .service('ResponsiveService', ResponsiveService);

  ResponsiveService.$inject = ['$window'];
  function ResponsiveService($window){
    var service = this;

    var smallScreenMax = 900;
    var mediumScreenMax = 1500;

    ///
    /// Get the number of projects we want to show in a row based on how
    /// big the screen is.
    ///
    service.GetHomePageRowSize = function(){
      var rowSize = 1;

      if($window.innerWidth > smallScreenMax){
        rowSize = 2;
      }

      if($window.innerWidth > mediumScreenMax){
        rowSize = 3;
      }

      return rowSize;
    };
  }

})();

(function(){
  angular
    .module('PortfolioSPAModule')
    .directive('coverImage', coverImage);

  function coverImage(){
    return{
      restrict:'EA',
      scope:{
        content: '=content'
      },
      templateUrl: '/common/directives/coverImage/coverImage.directive.html'
    };
  }
})();

(function(){
  angular
    .module('PortfolioSPAModule')
    .directive('imageLightbox', imageLightbox);

  function imageLightbox(){
    return{
      restrict:'EA',
      scope:{
        content: '=content'
      },
      templateUrl: '/common/directives/imageLightbox/imageLightbox.directive.html'
    };
  }
})();

(function(){
  angular
    .module('PortfolioSPAModule')
    .controller('imageGalleryController', imageGalleryController)
    .directive('imageGallery', imageGallery);

  function imageGallery(){
    return{
      restrict:'EA',
      scope:{
        content: '=content',
        selectedImage: '=selectedImage'
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
    ctrl.lightboxImage = "";

    ctrl.GalleryThumbClick = function(image){
      // Set modal image
      $scope.selectedImage = image;
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

(function(){
  angular
    .module('PortfolioSPAModule')
    .directive('embededVideo', embededVideo);

  function embededVideo(){
    return{
      restrict:'EA',
      scope:{
        embededUrl: '=embededUrl'
      },
      templateUrl: '/common/directives/embededVideo/embededVideo.directive.html'
    };
  }
})();

(function(){
  angular
    .module('PortfolioSPAModule')
    .directive('navigationBar', navigationBar);

  function navigationBar(){
    return{
      restrict:'EA',
      templateUrl: '/common/directives/navigationBar/navigationBar.directive.html'
    };
  }
})();

(function(){
  angular
    .module('PortfolioSPAModule')
    .directive('underlinePageBreak', underlinePageBreak);

  function underlinePageBreak(){
    return{
      restrict:'EA',
      templateUrl: '/common/directives/pageBreak/underline.directive.html'
    };
  }
})();

(function(){
  angular
    .module('PortfolioSPAModule')
    .directive('textBlock', textBlock);

  function textBlock(){
    return{
      restrict:'EA',
      scope:{
        content: '=content'
      },
      templateUrl: '/common/directives/textBlock/textBlock.directive.html'
    };
  }
})();
