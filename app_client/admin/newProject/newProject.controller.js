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
    if(viewModel.isNew === false){
      var projectid = $routeParams.projectid;
      ProjectsService.GetProject(projectid, function(project){
        viewModel.newProject = project;
      });
    }

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
