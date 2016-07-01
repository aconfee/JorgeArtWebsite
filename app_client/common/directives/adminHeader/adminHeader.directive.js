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
