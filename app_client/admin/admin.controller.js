angular
  .module('PortfolioSPAModule')
  .controller('adminController', adminController);

adminController.$inject = ['$location', '$http', 'authentication'];
function adminController($location, $http, authentication){
  var viewModel = this;

  // Immediatelly check if a user is logged in, otherwise leave.
  if(authentication.isLoggedIn() === false){
    $location.path('/');
  }

  viewModel.formError = "";

  viewModel.createProject = function(){
    $http.post('/api/projects', {lol: "data"}, {
      headers: {
        Authorization: 'Bearer ' + authentication.getToken()
      }
    }).then(
      function(response){
        viewModel.formError = "Project created!";
      },
      function(response){
        viewModel.formError = "Something went wrong trying to create project. " + response.data.message;
      }
    );
  };

  viewModel.logout = function(){
    authentication.logout();
    $location.path('/');
  };
}
