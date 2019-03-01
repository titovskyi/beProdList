const express = require("express");
const { body } = require("express-validator/check");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const User = require("../models/user");
const friendshipController = require("../controllers/friendship");

router.get("/friends", isAuth, friendshipController.getFriends);
router.post("/friend", 
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Введите верный email.")
    .custom((value, { req }) => {
      console.log(value, "value");
      return User.findOne({ where: { email: value } }).then(userDoc => {
        if (userDoc) {
          return Promise.reject("Пользователь не зарегестрирован.");
        }
      });
    }),
  isAuth,
  friendshipController.createFriend
);

module.exports = router;
