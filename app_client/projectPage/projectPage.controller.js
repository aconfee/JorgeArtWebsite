(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('projectPageController', projectPageController);

  projectPageController.$inject = ['$scope', '$sce', '$window', 'ProjectsGalleryService'];
  function projectPageController($scope, $sce, $window, ProjectsGalleryService){
    var viewModel = this;

    // Make sure we always start at the top of the page.
    $window.scrollTo(0, 0);

    viewModel.text = "No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block.";
    viewModel.videoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/kF0FvsDNjrc");
    viewModel.otherVideoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/CJ_GCPaKywg");
    viewModel.galleryThumbs = [
        "/images/NoMan1.jpg",
        "/images/NoMan2.jpg",
        "/images/NoMan3.jpg",
        "/images/NoMan4.jpg",
        "/images/NoMan5.jpeg",
        "/images/NoMan6.jpg",
        "/images/LastOf1.jpg",
        "/images/LastOf2.jpg",
        "/images/LastOf3.jpg",
        "/images/LastOf4.jpg",
        "/images/LastOf5.jpg",
        "/images/LastOf6.jpg",
        "/images/LastOf7.jpg",
        "/images/LastOf8.jpg"
    ];
  }

})();
