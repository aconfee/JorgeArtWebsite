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
      templateUrl: '/common/directives/imageLightbox/imageLightbox.directive.html',
      controller: imageLightboxController,
      controllerAs: 'viewModel'
    };
  }

  imageLightboxController.$inject = [];
  function imageLightboxController(){
    var ctrl = this;
    ctrl.imageWidth = "";

    $(document).ready(function(){

      $('#lightbox').on('shown.bs.modal', function () {

        var screenImage = $("#lightbox img");
        var theImage = new Image();
        theImage.src = screenImage.attr("src");
        ctrl.imageWidth = theImage.width;

        $(this).find(".modal-dialog").css("width", ctrl.imageWidth);
      });
    });
  }

})();
