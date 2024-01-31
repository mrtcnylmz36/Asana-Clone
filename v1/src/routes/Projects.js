const express = require('express');
const ProjectController = require('../controllers/Projects');
const validate = require('../middlewares/validate');
const schemas = require('../validations/Projects');
const authenicateToken = require('../middlewares/authenticate');
const idChecker = require('../middlewares/idChecker');

const router = express.Router();

router.route('/').get(authenicateToken, ProjectController.index);

router
  .route('/')
  .post(authenicateToken, validate(schemas.createValidation), ProjectController.create);

router
  .route('/:id')
  .patch(idChecker, authenicateToken, validate(schemas.updateValidation), ProjectController.update);

router.route('/:id').delete(idChecker, authenicateToken, ProjectController.deleteProject);

module.exports = router;
