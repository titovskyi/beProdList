const List = require("../models/list");
const Product = require("../models/product");
const ListProduct = require("../models/list-product");
const User = require("../models/user");

exports.getLists = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      console.log(user, "currentusers");
      return user.getLists()
        .then(lists => {
          console.log(lists, "currentlists");
          res.status(200).json({
            lists: lists
          });
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getList = (req, res, next) => {
  const listId = req.params.listId;
  let currentList;
  List.findById(listId)
    .then(list => {
      currentList = list;
      return list
        .getProducts()
        .then(products => {
          res.status(200).json({
            products: products
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

exports.createList = (req, res, next) => {
  console.log(req.userId, "create");
  const listName = req.body.listName;
  let currentUser;
  User.findById(req.userId)
    .then(user => {
      currentUser = user;
      if (!user) {
        const error = new Error("Авторизуйтесь!");
        error.statusCode = 401;
        throw error;
      }
      return List.create({
        name: listName
      });
    })
    .then(newList => {
      console.log(newList, 'newList');
      return currentUser.addLists(newList);
    })
    .then(result => {
      res.status(201).json({
        message: "List Created",
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateList = (req, res, next) => {
  const listId = req.body.listId;
  const listName = req.body.listName;
  List.findById(listId)
    .then(list => {
      list.name = listName;
      return list.save();
    })
    .then(() => {
      res.status(201).json({
        message: "List Updated"
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteList = (req, res, next) => {
  const listId = req.body.deleteListId;
  List.findById(listId)
    .then(list => {
      return list.destroy();
    })
    .then(result => {
      res.status(201).json({
        message: "List Deleted"
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.changeState = (req, res, next) => {
  const prodId = req.body.listProduct.productId;
  const listId = req.body.listProduct.listId;
  const newState = req.body.listProduct.state;

  ListProduct.findAll({ where: { listId: listId, productId: prodId } })
    .then(products => {
      let product = products[0];
      product.state = newState;
      return product.save();
    })
    .then(() => {
      let product;
      List.findById(listId)
        .then(list => {
          list
            .getProducts({ through: { where: { productId: prodId } } })
            .then(products => {
              res.status(201).json({
                product: products[0]
              });
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

exports.deleteFromList = (req, res, next) => {
  const productId = req.body.listProduct.productId;
  const listId = req.body.listProduct.listId;

  ListProduct.destroy({ where: { listId: listId, productId: productId } })
    .then(list => {
      res.status(201).json({
        message: "Product Deleted From List"
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
