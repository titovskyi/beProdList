const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.singup = (req, res, next) => {
  console.log(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.status = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const login = req.body.login;
  const password = req.body.password;
  console.log(email);
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      return User.create({
        login: login,
        email: email,
        password: hashedPw,
        status: "I am new!"
      });
    })
    .then(result => {
      res.status(201).json({
        message: "User created",
        userId: result.id
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, "user email");
  let loadedUser;
  User.findOne({ where: { email: email } })
    .then(user => {
      console.log(user, "currentuser");
      if (!user) {
        const error = new Error("Пользователь с таким email не найден");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error("Неверный пароль");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser.id
        },
        "sashkatitov"
      );
      loadedUser.userToken = token;
      loadedUser
        .save()
        .then(() => {
          res.status(200).json({
            email: loadedUser.email,
            userId: loadedUser.id,
            userLogin: loadedUser.login,
            userToken: loadedUser.userToken
          });
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.checkToken = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if(!user) {
        const error = new Error('Авторизуйтесь.');
        error.statusCode = 401;
        throw error;
      }
      res.status(200).json({
        email: user.email,
        userId: user.id,
        userLogin: user.login,
        userToken: user.userToken
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
