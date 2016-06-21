(function(){

  angular
    .module('PortfolioSPAModule')
    .controller('projectPageController', projectPageController);

  projectPageController.$inject = ['$scope', '$sce', '$window', '$routeParams', 'ProjectsGalleryService'];
  function projectPageController($scope, $sce, $window, $routeParams, ProjectsGalleryService){
    var viewModel = this;

    // Make sure we always start at the top of the page.
    $window.scrollTo(0, 0);

    viewModel.projectId = $routeParams.projectid;

    viewModel.lightboxImage = "BAD";
    viewModel.text = "No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block.";
    viewModel.videoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/kF0FvsDNjrc");
    viewModel.otherVideoLink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/CJ_GCPaKywg");
    viewModel.coverImage = "/images/NoMan2.jpg";
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

    // Each element will likely have to be it's own schema, so we'll have different
    // arrays of each schema type.
    // Our service should fetch this raw data, then sort it by position (put all objects
    // of each type into one array, then sort by position).
    // The final array returned by our service should match blog items below.
    // As a bonus, Jorge will be able to update the position value for any of these.
    var originalDataFromService = {
      "videos": [
        {
          "position": 1,
          "type": "video",
          "source": viewModel.videoLink
        }
      ],
      "textBlocks": [
        {
          "position": 2,
          "type": "text",
          "text": viewModel.text
        },
        {
          "position": 7,
          "type": "text",
          "text": viewModel.text
        }
      ],
      "coverImages": [
        {
          "position": 4,
          "type": "coverImage",
          "source": viewModel.coverImage
        }
      ],
      "galleries": [
        {
          "position": 5,
          "type": "gallery",
          "imageList": viewModel.galleryThumbs
        },
        {
          "position": 8,
          "type": "gallery",
          "imageList": viewModel.galleryThumbs
        }
      ],
      "pageBreaks": [
        {
          "position": 3,
          "type": "pageBreak"
        },
        {
          "position": 6,
          "type": "pageBreak"
        }
      ]
    };

    // Ideally Project in database will contain this pageData, as well as
    // an id and a coverSource, aspect, name, and category
    viewModel.blogItems = [
      {
        "position": 1,
        "type": "video",
        "source": viewModel.videoLink
      },
      {
        "position": 2,
        "type": "text",
        "text": viewModel.text
      },
      {
        "position": 3,
        "type": "pageBreak"
      },
      {
        "position": 4,
        "type": "coverImage",
        "source": viewModel.coverImage
      },
      {
        "position": 5,
        "type": "gallery",
        "imageList": viewModel.galleryThumbs
      },
      {
        "position": 6,
        "type": "pageBreak"
      },
      {
        "position": 7,
        "type": "text",
        "text": viewModel.text
      },
      {
        "position": 8,
        "type": "gallery",
        "imageList": viewModel.galleryThumbs
      }
    ];
  }

})();
