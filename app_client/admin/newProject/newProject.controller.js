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

    ///
    /// Remove an item from the gallery content array.
    ///
    viewModel.deleteFromContentArray = function(pageItemIndex, itemIndex){

      var validIndices = viewModel.contentArrayAccessCheck(pageItemIndex, itemIndex);
      if(validIndices === false) return;

      viewModel.newProject.pageItems[pageItemIndex].contentArray.splice(itemIndex, 1);
    };

    ///
    /// Reorder an item in the content array by shifting it up or down (left or right). 
    ///
    viewModel.moveContentArrayItem = function(pageItemIndex, itemIndex, moveUp /* bool */){
      var validIndices = viewModel.contentArrayAccessCheck(pageItemIndex, itemIndex);
      if(validIndices === false) return;

      var temp = viewModel.newProject.pageItems[pageItemIndex].contentArray[itemIndex];

      if(moveUp){
        if(viewModel.contentArrayAccessCheck(pageItemIndex, itemIndex - 1) === false){
          return;
        }

        viewModel.newProject.pageItems[pageItemIndex].contentArray[itemIndex] = viewModel.newProject.pageItems[pageItemIndex].contentArray[itemIndex - 1];
        viewModel.newProject.pageItems[pageItemIndex].contentArray[itemIndex - 1] = temp;
      }
      else{
        if(viewModel.contentArrayAccessCheck(pageItemIndex, itemIndex + 1) === false){
          return;
        }

        viewModel.newProject.pageItems[pageItemIndex].contentArray[itemIndex] = viewModel.newProject.pageItems[pageItemIndex].contentArray[itemIndex + 1];
        viewModel.newProject.pageItems[pageItemIndex].contentArray[itemIndex + 1] = temp;
      }
    };

    viewModel.contentArrayAccessCheck = function(pageItemIndex, itemIndex){
      // If page item list is not valid or page item index is invalid, leave.
      if(viewModel.newProject.pageItems === undefined ||
        pageItemIndex >= viewModel.newProject.pageItems.length ||
        pageItemIndex < 0){
          return false;
      }

      // If content array on this page item isn't valid, leave.
      if(viewModel.newProject.pageItems[pageItemIndex].contentArray === undefined ||
        viewModel.newProject.pageItems[pageItemIndex].contentArray.length === 0){
          return false;
      }

      // If content item index is invalid, leave.
      if(itemIndex >= viewModel.newProject.pageItems[pageItemIndex].contentArray.length ||
        itemIndex < 0){
          return false;
      }

      return true;
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
