const express = require('express');
const { create, index, update, deleteSection } = require('../controllers/Sections');
const validate = require('../middlewares/validate');
const schemas = require('../validations/Sections');
const authenicateToken = require('../middlewares/authenticate');
const idChecker = require('../middlewares/idChecker');

const router = express.Router();

router.route('/:projectId').get(idChecker('projectId'), authenicateToken, index);

router.route('/').post(authenicateToken, validate(schemas.createValidation), create);

router
  .route('/:id')
  .patch(idChecker(), authenicateToken, validate(schemas.updateValidation), update);

router.route('/:id').delete(idChecker(), authenicateToken, deleteSection);

module.exports = router;
