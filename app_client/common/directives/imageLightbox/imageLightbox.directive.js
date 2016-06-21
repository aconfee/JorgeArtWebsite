(function(){
  angular
    .module('PortfolioSPAModule')
    .directive('imageLightbox', imageLightbox);

  function imageLightbox(){
    return{
      restrict:'EA',
      scope:{
        content: '=content'
      },
      templateUrl: '/common/directives/imageLightbox/imageLightbox.directive.html'
    };
  }
})();
