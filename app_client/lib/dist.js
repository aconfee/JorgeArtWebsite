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
      .when('/login', {
        templateUrl: '/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'viewModel'
      })
      .when('/admin', {
        templateUrl: '/admin/dashboard/dashboard.view.html',
        controller: 'dashboardController',
        controllerAs: 'viewModel'
      })
      .when('/admin/edit/:projectid', {
        templateUrl: '/admin/newProject/newProject.view.html',
        controller: 'newProjectController',
        controllerAs: 'viewModel'
      })
      .when('/admin/newProject', {
        templateUrl: '/admin/newProject/newProject.view.html',
        controller: 'newProjectController',
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

  homeController.$inject = ['$scope', '$window', '$location', '$sce', 'ProjectsService', 'ResponsiveService'];
  function homeController($scope, $window, $location, $sce, ProjectsService, ResponsiveService){
    var viewModel = this;
    var categoryFilter = $location.search().category; // Once per 'page load'

    // For row resize.
    var currentWidth = $window.innerWidth;
    var rowSize = ResponsiveService.GetHomePageRowSize();

    viewModel.videoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/CJ_GCPaKywg");
    viewModel.coverImage = "./images/cover.png";
    viewModel.showCover = categoryFilter === undefined; // Promo on 'all' page.

    ///
    /// Request the projects to disply on the home page.
    ///
    ProjectsService.GetProjectsHomePage(categoryFilter, function(projectsVm){
      viewModel.projects = projectsVm;
    });

    ///
    /// Adjust the row sizes if need be.
    ///
    angular.element($window).bind('resize', function () {

      // Don't resize if width hasn't changed.
      if($window.innerWidth === currentWidth){
        return;
      }

      // Don't resize if we don't actually need to adjust row size.
      if(rowSize === ResponsiveService.GetHomePageRowSize()){
        return;
      }

      console.log("resizing");

      currentWidth = $window.innerWidth;
      rowSize = ResponsiveService.GetHomePageRowSize();

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
  .controller('loginCtrl', loginCtrl);

loginCtrl.$inject = ['$location', 'AuthentictionService'];
function loginCtrl($location, AuthentictionService){
  var viewModel = this;

  viewModel.pageHeader = {
    title: 'Admin Sign In'
  };

  viewModel.credentials = {
    username: "",
    password: ""
  };

  viewModel.returnPage = '/admin'; // Go to admin page once logged in.
  viewModel.onSubmit = function(){
    viewModel.formError = "";
    if(!viewModel.credentials.username || !viewModel.credentials.password){
      viewModel.formError = "All fields required.";
      return false;
    }
    else{
      viewModel.doLogin();
    }
  };

  viewModel.doLogin = function(){
    viewModel.formError = "";
    AuthentictionService
      .login(viewModel.credentials)
      .error(function(err){
        viewModel.formError = err.message;
      })
      .then(function(){
        //$location.search('page', null); no need to get query param for return page.
        $location.path(viewModel.returnPage);
      });
  };
}

(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('projectPageController', projectPageController);

  projectPageController.$inject = ['$window', '$routeParams', '$location', 'ProjectsService'];
  function projectPageController($window, $routeParams, $location, ProjectsService){
    var viewModel = this;
    viewModel.project = {};

    viewModel.projectId = $routeParams.projectid;

    // Make sure we always start at the top of the page.
    $window.scrollTo(0, 0);

    ProjectsService.GetProject(viewModel.projectId, function(project){
      viewModel.project = project;
    });

    ProjectsService.GetProjectPage($routeParams.projectid, function(pageData){
      viewModel.blogItems = pageData;
    });

    viewModel.nextProject = function(){
      ProjectsService.GetAllProjects(function(projects){
        var i = 0;
        for(; i < projects.length; i++){
          if(projects[i]._id === viewModel.project._id){
            break;
          }
        }

        if(i === projects.length - 1){
          i = -1;
        }

        $location.path('/projects/' + projects[i + 1]._id);
      });
    };

    viewModel.previousProject = function(){
      ProjectsService.GetAllProjects(function(projects){
        var i = 0;
        for(; i < projects.length; i++){
          if(projects[i]._id === viewModel.project._id){
            break;
          }
        }

        if(i === 0){
          i = projects.length;
        }

        $location.path('/projects/' + projects[i - 1]._id);
      });
    };
  }

})();

(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('dashboardController', dashboardController);

  dashboardController.$inject = ['$scope', '$location', '$http', 'ProjectsService', 'AuthentictionService'];
  function dashboardController($scope, $location, $http, ProjectsService, AuthentictionService){

    var viewModel = this;
    viewModel.projects = [];
    viewModel.projectToDelete = {};

    // Immediatelly check if a user is logged in, otherwise leave.
    if(AuthentictionService.isLoggedIn() === false){
      $location.path('/login');
    }

    ///
    /// Request the projects to disply on the home page.
    ///
    ProjectsService.GetAllProjects(function(projects){
      viewModel.projects = projects;
    });

    viewModel.markForDelete = function(index){
      viewModel.projectToDelete = viewModel.projects[index];
    };

    viewModel.deleteProject = function(){
      $http.delete('/api/projects/' + viewModel.projectToDelete._id, {
        headers: {
          Authorization: 'Bearer ' + AuthentictionService.getToken()
        }
      }).then(
        function(response){

          // Refresh projects list.
          ProjectsService.GetAllProjects(function(projects){
            viewModel.projects = projects;
          });
        },
        function(response){
          console.err("Something went wrong deleting a profile.");
      });
    };
  }

})();

(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('newProjectController', newProjectController);

  newProjectController.$inject = ['$scope', '$location', '$http', '$routeParams', 'AuthentictionService', 'UploadService' ,'ProjectsService'];
  function newProjectController($scope, $location, $http, $routeParams, AuthentictionService, UploadService, ProjectsService){
    var viewModel = this;

    // Immediatelly check if a user is logged in, otherwise leave.
    if(AuthentictionService.isLoggedIn() === false){
      $location.path('/login');
    }

    viewModel.isNew = false;
    if($location.absUrl().indexOf('newProject') > -1){
      viewModel.isNew = true;
    }

    viewModel.formMessageHeader = "";
    viewModel.formError = "";
    viewModel.created = false;
    viewModel.newProject = {};
    viewModel.fileData = {};

    ///
    /// Initialize variables if we're editing
    ///
    if(viewModel.isNew === false){
      var projectid = $routeParams.projectid;
      ProjectsService.GetProject(projectid, function(project){
        viewModel.newProject = project;
      });
    }

    ///
    /// Add the project to our db.
    ///
    viewModel.createProject = function(){

      viewModel.newProject.projectCoverImageAspectRatio = getAspectRatio("#projectCoverImage");

      $http.post('/api/projects', viewModel.newProject, {
        headers: {
          Authorization: 'Bearer ' + AuthentictionService.getToken()
        }
      }).then(
        function(response){
          viewModel.formMessageHeader = "Success!";
          viewModel.formError = "Project created.";
          viewModel.created = true;
          $location.path('/admin');
        },
        function(response){
          viewModel.formMessageHeader = "Oops!";
          viewModel.formError = "Something went wrong trying to create project. " + response.data;
          viewModel.created = false;
        }
      );
    };

    viewModel.editProject = function(){
      var projectid = $routeParams.projectid;

      viewModel.newProject.projectCoverImageAspectRatio = getAspectRatio('#projectCoverImage');

      $http.put('/api/projects/' + projectid, viewModel.newProject, {
        headers: {
          Authorization: 'Bearer ' + AuthentictionService.getToken()
        }
      }).then(
        function(response){
          viewModel.formMessageHeader = "Success!";
          viewModel.formError = "Project updated.";
          viewModel.created = true;
          $location.path('/admin');
        },
        function(response){
          viewModel.formMessageHeader = "Oops!";
          viewModel.formError = "Something went wrong trying to save this project. " + response.data;
          viewModel.created = false;
      });
    };

    viewModel.uploadProjectCoverImage = function(){
      UploadService.uploadImage(viewModel.newProject.projectCoverImage,
        function(response){
          viewModel.newProject.projectCoverImage = response.filepath;
        },
        function(response){
          console.log("something went wrong trying to upload file.");
      });
    };

    viewModel.uploadBlogItemCoverImage = function(index){
      UploadService.uploadImage(viewModel.newProject.pageItems[index].content,
        function(response){
          viewModel.newProject.pageItems[index].content = response.filepath;
        },
        function(response){
          console.log("something went wrong trying to upload file.");
      });
    };

    viewModel.uploadToGallery = function(index){
      UploadService.uploadImage(viewModel.fileData,
        function(response){
          viewModel.newProject.pageItems[index].contentArray.push(response.filepath);
        },
        function(response){
          console.log("something went wrong trying to upload file.");
      });
    };

    viewModel.addNewPageItem = function(){
      if(viewModel.newProject.pageItems === undefined){
        viewModel.newProject.pageItems = [];
      }

      viewModel.newProject.pageItems.push({
        position: 0,
        content: "",
        contentArray: []
      });
    };

    viewModel.removePageItem = function(index){
      viewModel.newProject.pageItems.splice(index, 1);
    };

    viewModel.resetProject = function(){
      viewModel.newProject = {};
    };

    var getAspectRatio = function(elementQuery){
      var screenImage = $("#projectCoverImage");
      var theImage = new Image();
      theImage.src = screenImage.attr("src");

      var aspect = theImage.width / theImage.height;

      return aspect;
    };
  }

})();

(function(){
  angular
    .module('PortfolioSPAModule')
    .service('AuthentictionService', AuthentictionService);

    AuthentictionService.$inject = ['$window', '$http'];
    function AuthentictionService($window, $http){
      var saveToken = function(token){
        $window.localStorage['admin-token'] = token;
      };

      var getToken = function(){
        return $window.localStorage['admin-token'];
      };

      var login = function(user){
        return $http.post('/api/login', user).success(function(data){
          saveToken(data.token);
        });
      };

      var logout = function(){
        $window.localStorage.removeItem('admin-token');
      };

      var isLoggedIn = function(){
        var token = getToken();

        if(token){
          var payload = JSON.parse($window.atob(token.split('.')[1]));

          return payload.exp > Date.now() / 1000;
        }
        else{
          return false;
        }
      };

      var currentUser = function(){
        if(isLoggedIn()){
          var token = getToken();
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return {
            username: payload.username
          };
        }
      };

      return {
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        saveToken: saveToken,
        getToken: getToken
      };
    }
})();

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

          projectRows[y].push(projects[ projectsIndex ]);
        }

        // If only one item in row, full size.
        if(projectRows[y].length === 1){
          projectRows[y][0].projectCoverImageAspectRatio = 1;
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
    service.designProjectsFilter = "design";
    service.animationProjectsFilter = "animation";
    service.illustrationProjectsFilter = "illustration";
    service.artworkProjectsFilter = "artwork";
    service.miscProjectsFilter = "misc";

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
    /// Get a project by its id.
    ///
    service.GetProject = function(projectId, callback){

      $http.get('/api/projects/' + projectId).then(
        function(response){
          if(response.status === 200){
            callback(response.data);
          }
        },
        function(response){
          console.error("Something went wrong getting project page " + projectId);
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
    .service('UploadService', UploadService);

    UploadService.$inject = ['$http', 'AuthentictionService'];
    function UploadService($http, AuthentictionService){
      service = this;

      service.uploadImage = function(fileData, successCB, errorCB){

        var fd = new FormData();
        fd.append('file', fileData);
        $http.post("/api/upload", fd, {
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined,
              Authorization: 'Bearer ' + AuthentictionService.getToken()
            }
        })
        .success(function(response){
          successCB(response);
        })
        .error(function(response){
          errorCB(response);
        });
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
    .directive('adminHeader', adminHeader);

  function adminHeader(){
    return{
      restrict:'EA',
      templateUrl: '/common/directives/adminHeader/adminHeader.directive.html',
      scope:{
        title: '@title'
      },
      controller: adminHeaderController,
      controllerAs: 'viewModel'
    };
  }

  ///
  /// Define a controller for this image gallery to use.
  ///
  adminHeaderController.$inject = ['$location', 'AuthentictionService'];
  function adminHeaderController($location, AuthentictionService){
    var viewModel = this;

    viewModel.logout = function(){
      AuthentictionService.logout();
      $location.path('/');
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
    .directive('fileModel', ['$parse', fileModel]);

  function fileModel($parse){
    return{
      restrict:'A',
      link: function(scope, element, attrs){
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
          scope.$apply(function(){
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
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

    ctrl.hoveredThumbIndex = -1;

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

    // For row resize.
    var currentWidth = $window.innerWidth;
    var numColumns = GetNumberOfColumns();

    // Never really want more than 4 columns or balance starts to look shit.
    ctrl.lightboxImage = "";

    ctrl.GalleryThumbClick = function(image){
      // Set modal image
      $scope.selectedImage = image;
    };

    angular.element($window).bind('resize', function () {

      // Don't resize if width hasn't changed.
      if($window.innerWidth === currentWidth){
        return;
      }

      // Don't resize if we don't actually need to adjust row size.
      if(numColumns === GetNumberOfColumns()){
        return;
      }

      currentWidth = $window.innerWidth;
      numColumns = GetNumberOfColumns();

      console.log("resizing");
      // Possiblity to cache here... if necessary.
      ctrl.imageThumbs = FormatImageList($scope.content); // format images with new number of columns based on screen size.
      $scope.$apply(); // This is needed here... will occasionally update on its own.
    });

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
      templateUrl: '/common/directives/imageLightbox/imageLightbox.directive.html',
      controller: imageLightboxController,
      controllerAs: 'viewModel'
    };
  }

  imageLightboxController.$inject = [];
  function imageLightboxController(){
    var ctrl = this;
    ctrl.imageWidth = "";

    $(document).ready(function(){

      $('#lightbox').on('shown.bs.modal', function () {

        var screenImage = $("#lightbox img");
        var theImage = new Image();
        theImage.src = screenImage.attr("src");
        ctrl.imageWidth = theImage.width;

        $(this).find(".modal-dialog").css("width", ctrl.imageWidth);
      });
    });
  }

})();

(function(){
  angular
    .module('PortfolioSPAModule')
    .directive('navigationBar', navigationBar);

  function navigationBar(){
    return{
      restrict:'EA',
      templateUrl: '/common/directives/navigationBar/navigationBar.directive.html',
      controller: navigationBarController,
      controllerAs: 'ctrl'
    };
  }

  navigationBarController.$inject = ['$location'];
  function navigationBarController($location){
    var ctrl = this;

    ctrl.isActive = function(path){
      if(path.length === 1){
        // If checking if we're on homepage...
        return $location.path() === '/' && $location.search().category === undefined;
      }

      return $location.absUrl().indexOf(path) != -1;
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
