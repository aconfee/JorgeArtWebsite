angular
  .module('PortfolioSPAModule')
  .controller('adminController', adminController);

adminController.$inject = ['$scope', '$location', '$http', 'AuthentictionService', 'UploadService'];
function adminController($scope, $location, $http, AuthentictionService, UploadService){
  var viewModel = this;

  // Immediatelly check if a user is logged in, otherwise leave.
  if(AuthentictionService.isLoggedIn() === false){
    $location.path('/login');
  }

  viewModel.formMessageHeader = "";
  viewModel.formError = "";
  viewModel.created = false;
  viewModel.newProject = {};
  viewModel.fileData = {};

  viewModel.createProject = function(){
    var aspect = $('#projectCoverImage').width() / $('#projectCoverImage').height();
    viewModel.newProject.projectCoverImageAspectRatio = aspect;

    $http.post('/api/projects', viewModel.newProject, {
      headers: {
        Authorization: 'Bearer ' + AuthentictionService.getToken()
      }
    }).then(
      function(response){
        viewModel.formMessageHeader = "Success!";
        viewModel.formError = "Project created.";
        viewModel.created = true;
      },
      function(response){
        viewModel.formMessageHeader = "Oops!";
        viewModel.formError = "Something went wrong trying to create project. " + response.data.message;
        viewModel.created = false;
      }
    );
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

  viewModel.logout = function(){
    AuthentictionService.logout();
    $location.path('/');
  };
}
