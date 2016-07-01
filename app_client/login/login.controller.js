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
