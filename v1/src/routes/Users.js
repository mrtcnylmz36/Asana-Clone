const express = require('express');
const {
  create,
  index,
  login,
  projectList,
  resetPassword,
  update,
  deleteUser,
  changePassword,
  updateProfileImage,
} = require('../controllers/Users');
const validate = require('../middlewares/validate');
const schemas = require('../validations/Users');
const authenicateToken = require('../middlewares/authenticate');

const router = express.Router();

router.get('/', index);

router.route('/').post(validate(schemas.createValidation), create);

router.route('/').patch(authenicateToken, validate(schemas.updateValidation), update);

router.route('/login').post(validate(schemas.loginValidation), login);

router.route('/projects').get(authenicateToken, projectList);

router.route('/reset-password').post(validate(schemas.resetPasswordValidation), resetPassword);

router
  .route('/change-password')
  .post(authenicateToken, validate(schemas.changePasswordValidation), changePassword);

router.route('/update-profile-image').post(authenicateToken, updateProfileImage);

router.route('/:id').delete(authenicateToken, deleteUser);

module.exports = router;
