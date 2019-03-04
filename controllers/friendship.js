const User = require("../models/user");
const List = require("../models/list");
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
      if (!user) {
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
          if (friend) {
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
          console.log(friend, "res friend");
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
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.shareList = (req, res, next) => {
  const listId = req.body.listId;
  const friendEmail = req.body.friendEmail;

  let friend;
  console.log(listId, friendEmail);

  User.findOne({ where: { email: friendEmail } })
    .then(user => {
      friend = user;
      if (!user) {
        const error = new Error("Пользователь не существует!");
        error.statusCode = 422;
        throw error;
      }
      List.findOne({ where: { id: listId } })
        .then(list => {
          return friend.addLists(list);
        })
        .then(result => {
          res.status(200).json({
            message: "Пользователь добавлен к списку"
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

exports.deleteFriend = (req, res, next) => {
  const friendEmail = req.body.email;
  Friendship.destroy({
    where: { userId: req.userId, friendEmail: friendEmail }
  })
    .then(() => {
      res.status(201).json({
        message: "User Deleted From Friends"
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
