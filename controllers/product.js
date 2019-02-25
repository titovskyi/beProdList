const List = require("../models/list");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.status(200).json({
      products: products
    });
  });
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
  let prodDep = req.body.department;

  let currentList;

  List.findById(listId)
    .then(list => {
      currentList = list;
      return Product.findAll({ where: { name: prodName } });
    })
    .then(products => {
      console.log(products, "products");
      if (!products.length) {
        if (prodDep === "another") {
          prodDep = 'Другое';
        }
        return Product.create({
          name: prodName,
          department: prodDep
        });
      }
      if (products[0].department !== prodDep && prodDep !== "another") {
        products[0].department = prodDep;
        products[0].save();
      }
      if (prodDep === "another") {
        products[0].department = "Другое";
        products[0].save();
      }
      return products[0];
    })
    .then(prod => {
      return currentList.addProduct(prod, { through: { state: true } });
    })
    .then(createdProduct => {
      return currentList.getProducts(
        { where: { name: prodName } },
        { through: { where: { listId: listId } } }
      );
    })
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
};
