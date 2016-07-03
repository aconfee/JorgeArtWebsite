var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: __dirname + '/../../public/images/' });

var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrlProjects = require('../controllers/projects');
var ctrlAuth = require('../controllers/authentication');
var ctrlUpload = require('../controllers/upload');

router.get('/projects', ctrlProjects.getAllProjects); // done
router.post('/projects', auth, ctrlProjects.createProject);

router.get('/projects/:projectsid', ctrlProjects.getProject); // done
router.put('/projects/:projectsid', auth, ctrlProjects.editProject);
router.delete('/projects/:projectsid', auth, ctrlProjects.deleteProject);

router.post('/register', ctrlAuth.register); // Use in postman to add a user if need ever be.
router.post('/login', ctrlAuth.login);

router.post('/upload', upload.any(), auth, ctrlUpload.uploadImage);

module.exports = router;
