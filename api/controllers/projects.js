var mongoose = require('mongoose');
var Project = mongoose.model('Project');

module.exports.getAllProjects = function(req, res){
  Project.find({}, function (err, docs) {
    if(err){
      console.log(err);
      res.status(400);
      res.json(err);
      return;
    }

    res.status(200);
    res.json(docs);
  });
};

module.exports.createProject = function(req, res){
  console.log(req.body.name);

  if(!req.body.name || !req.body.projectCoverImage || !req.body.pageItems || req.body.pageItems.length === 0){
    res.status(300);
    res.json({message: "Missing essential project details."});
  }

  Project.create(
    req.body,
    function(err, project) {
    if (err) {
      console.log(err);
      res.status(400);
      res.json(err);
    } else {
      console.log(project);
      res.status(201);
      res.json(project);
    }
  });
};

module.exports.getProject = function(req, res){

  Project.findOne({ _id: req.params.projectsid }, function(err, doc){
    if(err){
      console.log(err);
      res.status(400);
      res.json(err);
      return;
    }

    res.status(200);
    res.json(doc);
  });
};

module.exports.editProject = function(req, res){

  Project.findOne({ _id: req.params.projectsid }, function (err, doc){

    if(err){
      console.log(err);
      res.status(500);
      res.json(err);
      return;
    }

    doc.name = req.body.name;
    doc.category = req.body.category;
    doc.projectCoverImage = req.body.projectCoverImage;
    doc.projectCoverImageAspectRatio = req.body.projectCoverImageAspectRatio;
    doc.pageItems = req.body.pageItems;

    doc.save(function(err, doc){
      if(err){
        console.log(err);
        res.status(500);
        res.json(err);
        return;
      }

      res.status(200);
      res.json({"message": "Updated " + req.body.name});
    });
  });
};

module.exports.deleteProject = function(req, res){

  Project.remove({_id: req.params.projectsid }, function(err){
    if(err){
      res.status(500);
      res.json({"message": "Something went wrong trying to delete project: " + err.message});
      return;
    }

    res.status(200);
    res.json({"message": "Project deleted"});
  });
};
