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
