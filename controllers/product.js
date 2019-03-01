const List = require("../models/list");
const Product = require("../models/product");
const User = require("../models/user");

exports.getProducts = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      user
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

exports.createProduct = (req, res, next) => {
  const listId = req.body.id;
  const prodName = req.body.productName;
  let prodDep = req.body.department;
  let currentList;
  let currentProduct;
  if (prodDep === "another") {
    prodDep = "Другое";
  }

  console.log(prodDep, "prodDep");

  Product.findOne({ where: { name: prodName, userId: req.userId } })
    .then(product => {
      if (!product) {
        return Product.create({
          name: prodName,
          department: prodDep,
          userId: req.userId
        });
      }
      product.department = prodDep;
      product.save();
      return product;
    })
    .then(product => {
      currentProduct = product;
      return List.findById(listId)
        .then(list => {
          currentList = list;
          return list.addProduct(product, { through: { state: true } });
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .then(list => {
      return currentList.getProducts({ where: { name: prodName } }).then(products => {
        res.status(201).json({
          product: products[0]
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
    });
};
