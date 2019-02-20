const List = require('../models/list');
const Product = require('../models/product');
const ListProduct = require("../models/list-product");

exports.getLists = (req, res, next) => {
  console.log('sss');
  List.findAll()
    .then(lists => {
      res.status(200).json({
        lists: lists
      });
    })
    .catch(err => console.log(err));
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
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.createList = (req, res, next) => {
  console.log('create');
  const listName = req.body.listName;
  List.create({
    name: listName
  })
    .then(result => {
      res.status(201).json({
        message: "List Created",
        post: listName
      });
    })
    .catch(err => console.log(err))
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
        message: "List Updated",
      });
    })
    .catch(err => console.log(err))
}

exports.deleteList = (req, res, next) => {
  const listId = req.body.deleteListId;
  List.findById(listId)
    .then(list => {
      return list.destroy();
    })
    .then(result => {
      res.status(201).json({
        message: "List Deleted",
      });
    })
    .catch(err => console.log(err))
}

exports.changeState = (req, res, next) => {
  const prodId = req.body.listProduct.productId;
  const listId = req.body.listProduct.listId;
  const newState = req.body.listProduct.state;

  ListProduct.findAll({where: {listId: listId, productId: prodId}})
    .then(products => {
      let product = products[0];
      product.state = newState;
      return product.save();
    })
    .then(() => {
      let product;
      List.findById(listId)
        .then((list) => {
          list.getProducts({through: {where: {productId: prodId}}})
          .then((products) => {
            res.status(201).json({
              product: products[0]
            })
          })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
};

exports.deleteFromList = (req, res, next) => {
  const productId = req.body.listProduct.productId;
  const listId = req.body.listProduct.listId;

  ListProduct.destroy({where: {listId: listId, productId: productId}})
  .then(list => {
    res.status(201).json({
      message: "Product Deleted From List",
    });
  })
  .catch(err => console.log(err))
}
