const express = require('express');
const {
  create,
  index,
  update,
  deleteTask,
  makeComment,
  deleteComment,
  addSubTask,
  fetchTask,
} = require('../controllers/Tasks');
const validate = require('../middlewares/validate');
const schemas = require('../validations/Tasks');
const authenicateToken = require('../middlewares/authenticate');

const router = express.Router();

router.route('/').post(authenicateToken, validate(schemas.createValidation), create);
router
  .route('/:id')
  .patch(idChecker(), authenicateToken, validate(schemas.updateValidation), update);
router
  .route('/:id/make-comment')
  .post(idChecker(), authenicateToken, validate(schemas.commentValidation), makeComment);

router
  .route('/:id/add-sub-task')
  .post(idChecker(), authenicateToken, validate(schemas.createValidation), addSubTask);

router.route('/:id/:commentId').delete(idChecker(), authenicateToken, deleteComment);

router.route('/:id').get(idChecker(), authenicateToken, fetchTask);

router.route('/:id').delete(idChecker(), authenicateToken, deleteTask);

module.exports = router;
