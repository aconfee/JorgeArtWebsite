module.exports.uploadImage = function(req, res){
  res.status(200);
  res.json({ filepath: '/images/' + req.files[0].filename });
};
