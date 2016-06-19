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
