module.exports.getAllProjects = function(req, res){
  res.status(200);
  res.json({"text": "get all projects"});
};

module.exports.createProject = function(req, res){
  res.status(200);
  res.json({"text": "create a project"});
};

module.exports.getProject = function(req, res){
  res.status(200);

  console.log("getting project in api controller");

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
  var dataBlob = {
    "id": "200",
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

  res.json(dataBlob);
};

module.exports.editProject = function(req, res){
  res.status(200);
  res.json({"text": "edit project"});
};

module.exports.deleteProject = function(req, res){
  res.status(200);
  res.json({"text": "delete project"});
};
