const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.singup = (req, res, next) => {
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
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      return User.create({
        login: login,
        email: email,
        password: hashedPw,
        status: 'I am new!'
      })
    })
    .then(result => {
      res.status(201).json({
        message: 'User created',
        userId: result.id
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
