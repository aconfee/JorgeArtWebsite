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
