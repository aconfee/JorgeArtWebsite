var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var s3 = new AWS.S3({params: {Bucket: process.env.S3_BUCKET_NAME}});

var multer = require('multer');
var multerS3 = require('multer-s3');

module.exports.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

// Here's a pointless change.
module.exports.uploadImage = function(req, res){
  res.status(200);
  res.json({ filepath: req.files[0].location });
};
