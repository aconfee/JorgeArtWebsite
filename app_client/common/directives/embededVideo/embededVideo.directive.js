(function(){
  angular
    .module('PortfolioSPAModule')
    .directive('embededVideo', embededVideo);

  function embededVideo(){
    return{
      restrict:'EA',
      scope:{
        embededUrl: '=embededUrl'
      },
      templateUrl: '/common/directives/embededVideo/embededVideo.directive.html'
    };
  }
})();
