const User = require("../models/user");
const Friendship = require("../models/friendship");

exports.getFriends = (req, res, next) => {
  console.log(req.userId, "req.userid");
  Friendship.findAll({ where: { userId: req.userId } })
    .then(friends => {
      res.status(200).json({
        friends: friends
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createFriend = (req, res, next) => {
  const email = req.body.email;

  User.findOne({ where: { email: email } })
    .then(user => {
      if(!user) {
        const error = new Error("Пользователь не зарегестрирован!");
        error.statusCode = 422;
        throw error;
      }
      if (user.id === req.userId) {
        const error = new Error("Вы пытаетесь добавить самого себя!");
        error.statusCode = 422;
        throw error;
      }
      return Friendship.findOne({
        where: { userId: req.userId, friendEmail: email }
      })
        .then(friend => {
          if(friend) {
            const error = new Error("Пользователь уже добавлен!");
            error.statusCode = 422;
            throw error;
          }
          return Friendship.create({
            userId: req.userId,
            friendEmail: user.email
          });
        })
        .then(friend => {
          console.log(friend, 'res friend');
          res.status(200).json({
            message: "Friend added!",
            friend: friend
          });
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    // .then(() => {
    //   return Friendship.findAll({where: {userId: req.userId}})
    //     .then(friends => {
    //       res.status(200).json({
    //         message: "Friend added!",
    //         friends: friends
    //       });
    //     })
    //     .catch(err => {
    //       if (!err.statusCode) {
    //         err.statusCode = 500;
    //       }
    //       next(err);
    //     });
    // })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
