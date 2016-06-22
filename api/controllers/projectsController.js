module.exports.getAllProjects = function(req, res){
  res.status(200);

  var lotsOfText = "No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block.";
  var galleryExample  = [
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

  var projectOne = {
    "id": "200",
    "position": 1,
    "name": "No Mans Sky",
    "category": "film",
    "projectCoverImage": "/images/NoMan5.jpeg",
    "projectCoverImageAspectRatio": 1.777,
    "videos": [
      {
        "position": 1,
        "type": "video",
        "source": "https://www.youtube.com/embed/kF0FvsDNjrc"
      }
    ],
    "textBlocks": [
      {
        "position": 2,
        "type": "text",
        "text": lotsOfText
      }
    ],
    "coverImages": [

    ],
    "galleries": [
      {
        "position": 8,
        "type": "gallery",
        "imageList": galleryExample
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

  var projectTwo = {
    "id": "300",
    "position": 2,
    "name": "No Mans Sky 2",
    "category": "film",
    "projectCoverImage": "/images/NoMan6.jpg",
    "projectCoverImageAspectRatio": 1.777,
    "videos": [
      {
        "position": 1,
        "type": "video",
        "source": "https://www.youtube.com/embed/kF0FvsDNjrc"
      }
    ],
    "textBlocks": [
      {
        "position": 2,
        "type": "text",
        "text": lotsOfText
      },
      {
        "position": 7,
        "type": "text",
        "text": lotsOfText
      }
    ],
    "coverImages": [
      {
        "position": 4,
        "type": "coverImage",
        "source": "/images/NoMan2.jpg"
      }
    ],
    "galleries": [
      {
        "position": 5,
        "type": "gallery",
        "imageList": galleryExample
      },
      {
        "position": 8,
        "type": "gallery",
        "imageList": galleryExample
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

  var projectThree = {
    "id": "400",
    "position": 3,
    "name": "No Mans Sky 3",
    "category": "art",
    "projectCoverImage": "/images/NoMan4.jpg",
    "projectCoverImageAspectRatio": 1.777,
    "videos": [
    ],
    "textBlocks": [
      {
        "position": 2,
        "type": "text",
        "text": lotsOfText
      }
    ],
    "coverImages": [
      {
        "position": 4,
        "type": "coverImage",
        "source": "/images/NoMan2.jpg"
      }
    ],
    "galleries": [
    ],
    "pageBreaks": [
    ]
  };

  var projectsDto = {"projects": [
    projectOne,
    projectTwo,
    projectThree
  ]};

/*
  var projectsDto = {"projects": [
    {
      "id": "100", // use this to navigate to specific project url
      "name": "NoMansSky", // could be useful
      "image": "/images/NoMan1.jpg",
      "aspect": 0.665,
      "category": "film"
    },
    {
      "id": "101",
      "name": "NoMansSky2",
      "image": "/images/NoMan2.jpg",
      "aspect": 1.78,
      "category": "art"
    },
    {
      "id": "102",
      "name": "NoMansSky3",
      "image": "/images/NoMan3.jpg",
      "aspect": 1.77,
      "category": "art"
    },
    {
      "id": "103",
      "name": "NoMansSky4",
      "image": "/images/NoMan4.jpg",
      "aspect": 1.77,
      "category": "art"
    },
    {
      "id": "104",
      "name": "NoMansSky5",
      "image": "/images/NoMan5.jpeg",
      "aspect": 1.777,
      "category": "art"
    },
    {
      "id": "105",
      "name": "NoMansSky6",
      "image": "/images/NoMan6.jpg",
      "aspect": 1.77,
      "category": "film"
    }
  ]};
  */
  res.json(projectsDto);
};

module.exports.createProject = function(req, res){
  res.status(200);
  res.json({"text": "create a project"});
};

module.exports.getProject = function(req, res){
  res.status(200);

  var lotsOfText = "No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block. No mans sky is a diddy I worked on. This is a text block.";
  var galleryExample  = [
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
  var projectOne = {
    "id": "200",
    "position": 1,
    "name": "No Mans Sky",
    "category": "film",
    "projectCoverImage": "/images/NoMan5.jpeg",
    "projectCoverImageAspectRatio": 1.777,
    "videos": [
      {
        "position": 1,
        "type": "video",
        "source": "https://www.youtube.com/embed/kF0FvsDNjrc"
      }
    ],
    "textBlocks": [
      {
        "position": 2,
        "type": "text",
        "text": lotsOfText
      },
      {
        "position": 7,
        "type": "text",
        "text": lotsOfText
      }
    ],
    "coverImages": [
      {
        "position": 4,
        "type": "coverImage",
        "source": "/images/NoMan2.jpg"
      }
    ],
    "galleries": [
      {
        "position": 5,
        "type": "gallery",
        "imageList": galleryExample
      },
      {
        "position": 8,
        "type": "gallery",
        "imageList": galleryExample
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

  res.json(projectOne);
};

module.exports.editProject = function(req, res){
  res.status(200);
  res.json({"text": "edit project"});
};

module.exports.deleteProject = function(req, res){
  res.status(200);
  res.json({"text": "delete project"});
};
