angular
  .module('jorgePortfolioApp')
  .controller('homeController', homeController);

homeController.$inject = ['$scope', '$window'];
function homeController($scope, $window){
  var viewModel = this;

  // This is a DTO. Move it into a service where it will be formatted and sent
  // to this view.
  // Get aspect ratio and store in db when uploaded.
  var projects = [
    {"image": "/images/NoMan1.jpg", "aspect": 0.665},
    {"image": "/images/NoMan2.jpg", "aspect": 1.78},
    {"image": "/images/NoMan3.jpg", "aspect": 1.77},
    {"image": "/images/NoMan4.jpg", "aspect": 1.77},
    {"image": "/images/NoMan5.jpeg", "aspect": 1.777},
    {"image": "/images/NoMan6.jpg", "aspect": 1.77}
  ];


  // RESIZE SERVICE
  var screenWidth = $window.innerWidth;
  var screenHeight = $window.innerHeight;

  // Turn into a service to return screen width and height.
  // This service should have a method to just get num of rows that should display.
  var w = angular.element($window);
    w.bind('resize', function () {

    rowSize = 1;

    if($window.innerWidth > 600){
      rowSize = 2;
    }
    if($window.innerWidth > 1000){
      rowSize = 3;
    }

    viewModel.projectRows = formatProjectGroups(projects, rowSize);
    $scope.$apply();
  });

  // HOME GALLERY SERVICE
  // Move to service.
  var rowSize = 1;

  if(screenWidth > 600){
    rowSize = 2;
  }
  if(screenWidth > 1000){
    rowSize = 3;
  }

  // Move to service.
  var formatProjectGroups = function(projects, rowSize){
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

    if(rowSize === undefined || rowSize <= 0){
      console.error("rowSize is undefined or invalid.");
      return;
    }

    var projectGroups = [];
    var rows = projects.length / rowSize;

    if(rows === 0) rows = 1;

    for (var y = 0; y < rows; y++) {
      projectGroups.push([]);

      for(var x = 0; x < rowSize; x++){
        // Break if no projects remaining.
        var projectsIndex = (rowSize * y) + x;
        if(projectsIndex === projects.length) break;

        projectGroups[y].push(projects[ projectsIndex ]);
      }
    }

    return projectGroups;
  };

  viewModel.projectRows = formatProjectGroups(projects, rowSize);

  viewModel.exampleData = {
    exampleItem: 'Example text from home controller being passed to example-directive.'
  };
}
