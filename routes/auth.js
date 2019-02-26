const express = require("express");
const { body } = require("express-validator/check");
const User = require("../models/user");
const authController = require('../controllers/auth');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.put("/singup", [
  body("email")
    .isEmail()
    .withMessage("Введите верный email.")
    .custom((value, { req }) => {
      console.log(value, 'value');
      return User.findOne({ where: { email: value } })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('email уже существует.');
          }
        });
    }),
  body('password').trim().isLength({min: 5}),
  body('login').trim().not().isEmpty()
], authController.singup);

router.post('/login',  authController.login);
router.get('/check-login', isAuth, authController.checkToken);

module.exports = router;
