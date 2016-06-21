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

angular
  .module('PortfolioSPAModule')
  .controller('aboutController', aboutController);

aboutController.$inject = ['$scope'];
function aboutController($scope){
  var viewModel = this;

  viewModel.myVariable = "I'm pretty cool, I guess.";
}

// Using function scopes to prevent global scope variables.
// God, I can't wait to use typescript.
(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('homeController', homeController);

  homeController.$inject = ['$scope', '$window', '$location', '$sce', 'ProjectsGalleryService'];
  function homeController($scope, $window, $location, $sce, ProjectsGalleryService){
    var viewModel = this;
    var currentProjectsCategoryFilter = $location.search().category; // Once per 'page load'

    viewModel.showVideo = currentProjectsCategoryFilter === undefined; // Promo on 'all' page.

    // TODO: Make the main gallery a directive and pass projectRows into it.
    viewModel.projects = ProjectsGalleryService.GetProjects(currentProjectsCategoryFilter);

    // Turn into a service to return screen width and height.
    // This service should have a method to just get num of rows that should display.
    angular.element($window).bind('resize', function () {
      // Possiblity to cache here... if necessary.
      viewModel.projects = ProjectsGalleryService.GetProjects(currentProjectsCategoryFilter);
      $scope.$apply(); // This is needed here... will occasionally update on its own.
    });

    viewModel.videoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/CJ_GCPaKywg");
  }

})();

(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('projectPageController', projectPageController);

  projectPageController.$inject = ['$scope', '$sce', '$window', '$routeParams', 'ProjectsGalleryService'];
  function projectPageController($scope, $sce, $window, $routeParams, ProjectsGalleryService){
    var viewModel = this;

    // Make sure we always start at the top of the page.
    $window.scrollTo(0, 0);

    viewModel.projectId = $routeParams.projectid;

    viewModel.lightboxImage = "BAD";
    viewModel.text = "No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block.";
    viewModel.videoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/kF0FvsDNjrc");
    viewModel.otherVideoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/CJ_GCPaKywg");
    viewModel.coverImage = "/images/NoMan2.jpg";
    viewModel.galleryThumbs = [
        "/images/NoMan1.jpg",
        "/images/NoMan2.jpg",
        "/images/NoMan3.jpg",
        "/images/NoMan4.jpg",
        "/images/NoMan5.jpeg",
        "/images/NoMan6.jpg",
        "/images/LastOf1.jpg",
        "/images/LastOf2.jpg",
        "/images/LastOf3.jpg",
        "/images/LastOf4.jpg",
        "/images/LastOf5.jpg",
        "/images/LastOf6.jpg",
        "/images/LastOf7.jpg",
        "/images/LastOf8.jpg"
    ];

    // Each element will likely have to be it's own schema, so we'll have different
    // arrays of each schema type.
    // Our service should fetch this raw data, then sort it by position (put all objects
    // of each type into one array, then sort by position).
    // The final array returned by our service should match blog items below.
    // As a bonus, Jorge will be able to update the position value for any of these.
    var originalDataFromService = {
      "videos": [
        {
          "position": 1,
          "type": "video",
          "source": viewModel.videoLink
        }
      ],
      "textBlocks": [
        {
          "position": 2,
          "type": "text",
          "text": viewModel.text
        },
        {
          "position": 7,
          "type": "text",
          "text": viewModel.text
        }
      ],
      "coverImages": [
        {
          "position": 4,
          "type": "coverImage",
          "source": viewModel.coverImage
        }
      ],
      "galleries": [
        {
          "position": 5,
          "type": "gallery",
          "imageList": viewModel.galleryThumbs
        },
        {
          "position": 8,
          "type": "gallery",
          "imageList": viewModel.galleryThumbs
        }
      ],
      "pageBreaks": [
        {
          "position": 3,
          "type": "pageBreak"
        },
        {
          "position": 6,
          "type": "pageBreak"
        }
      ]
    };

    // Ideally Project in database will contain this pageData, as well as
    // an id and a coverSource, aspect, name, and category
    viewModel.blogItems = [
      {
        "position": 1,
        "type": "video",
        "source": viewModel.videoLink
      },
      {
        "position": 2,
        "type": "text",
        "text": viewModel.text
      },
      {
        "position": 3,
        "type": "pageBreak"
      },
      {
        "position": 4,
        "type": "coverImage",
        "source": viewModel.coverImage
      },
      {
        "position": 5,
        "type": "gallery",
        "imageList": viewModel.galleryThumbs
      },
      {
        "position": 6,
        "type": "pageBreak"
      },
      {
        "position": 7,
        "type": "text",
        "text": viewModel.text
      },
      {
        "position": 8,
        "type": "gallery",
        "imageList": viewModel.galleryThumbs
      }
    ];
  }

})();

(function(){

  angular
    .module('PortfolioSPAModule')
    .service('ProjectsGalleryService', ProjectsGalleryService);



  ProjectsGalleryService.$inject = ['$window'];
  function ProjectsGalleryService($window){
    var service = this;

    var smallScreenMax = 900;
    var mediumScreenMax = 1500;

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
