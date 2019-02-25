const List = require("../models/list");
const Product = require("../models/product");
const User = require("../models/user");

exports.getProducts = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      user.getProducts().then(products => {
        res.status(200).json({
          products: products
        });
      }).catch(err => {
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
    })
};

exports.createProduct = (req, res, next) => {
  const listId = req.body.id;
  const prodName = req.body.productName;
  let prodDep = req.body.department;
  let currentList;
  let currentProduct;
  console.log(prodDep, "prodDep");
  Product.findOne({ where: { name: prodName } })
    .then(product => {
      if (!product) {
        return Product.create({
          name: prodName
        });
      }
      return product;
    })
    .then(product => {
      currentProduct = product;
      return User.findById(req.userId)
        .then(user => {
          currentUser = user;
          return user
            .getProducts({ where: { name: prodName } })
            .then(products => {
              if (!products.length) {
                if (prodDep === "another") {
                  prodDep = "Другое";
                }
              }
              return currentUser.addProduct(currentProduct, {
                through: { department: prodDep }
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
    })
    .then(result => {
      return List.findById(listId)
        .then(list => {
          currentList = list;
          return list
            .getProducts({ where: { name: prodName } })
            .then(products => {
              if (!products.length) {
                if (prodDep === "another") {
                  prodDep = "Другое";
                }
              }
              return currentList.addProduct(currentProduct, {
                through: { state: true, department: prodDep }
              });
            })
            .then(list => {
              console.log(list, "product");
              currentList
                .getProducts({ where: { name: prodName } })
                .then(products => {
                  res.status(201).json({
                    product: products[0]
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
