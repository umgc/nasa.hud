var express = require ('express');
var router = express.Router();

var file_controller = require('../controllers/filesController');
var roles_controller = require('../controllers/rolesController');
var tasks_controller = require('../controllers/tasksController');

router.get('/getfiles', file_controller.get_files);
router.get('/lint/:filename', file_controller.lint_file);
router.get('/roles/:filename', roles_controller.get_roles);
router.get('/tasks/:filename/:role', tasks_controller.get_tasks);
router.get('/getimage/:filename', file_controller.get_image);

router.get('/', function(req, res) {
    res.status(200).json('Maestro HUD Backend Services')
})

module.exports = router;