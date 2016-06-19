(function(){
  angular
    .module('PortfolioSPAModule')
    .directive('embededVideo', embededVideo);

  function embededVideo(){
    return{
      restrict:'EA',
      scope:{
        link: '=link'
      },
      templateUrl: '/common/directives/embededVideo/embededVideo.directive.html'
    };
  }
})();
