var express = require('express');
var router = express.Router();
var ctrlProjects = require('../controllers/projectsController');

router.get('/projects', ctrlProjects.getAllProjects); // done
router.post('/projects', ctrlProjects.createProject);

router.get('/projects/:projectsid', ctrlProjects.getProject); // done
router.put('/projects/:projectsid', ctrlProjects.editProject);
router.delete('/projects/:projectsid', ctrlProjects.deleteProject);

module.exports = router;