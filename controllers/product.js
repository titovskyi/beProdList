const List = require("../models/list");
const Product = require("../models/product");


exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.status(200).json({
        products: products
      })
    })
  // const listId = req.body.listId;
  // let currentList;

  // List.findById(listId)
  //   .then(list => {
  //     currentList = list;
  //     return list
  //       .getProducts()
  //       .then(products => {
  //         if (!products) {
  //           return currentList.addProduct({ name: "First Product" });
  //         }
  //         return products;
  //       })
  //       .then(products => {
  //         res.status(200).json({
  //           products: products
  //         });
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};

exports.createProduct = (req, res, next) => {
  const listId = req.body.id;
  const prodName = req.body.productName;
  let currentList;

  List.findById(listId)
    .then(list => {
      currentList = list;
      return Product.findAll({ where: { name: prodName } });
    })
    .then(products => {
      if (!products.length) {
        return Product.create({
          name: prodName
        });
      }
      return product;
    })
    .then(prod => {
      return currentList.addProduct(prod, { through: { state: true } });
    })
    .then(createdProduct => {
      return currentList.getProducts({where: {name: prodName}}, {through: {where: {listId: listId}}})
    })
    .then(products => {
      res.status(201).json({
        product: products[0]
      });
    })
    .catch(err => console.log(err));
};
