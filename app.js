const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");

const app = express();

const productRoutes = require("./routes/product");
const listRoutes = require("./routes/list");
const List = require('./models/list');
const Product = require('./models/product');
const ListProduct = require('./models/list-product');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(listRoutes);
app.use(productRoutes);

List.belongsToMany(Product, {through: ListProduct});
Product.belongsToMany(List, {through: ListProduct});

sequelize
  // .sync({force: true})
  .sync()
  .then(res => {
    return List.findById(1);
  })
  .then(list => {
    if(!list) {
      return List.create({name: 'New List'})
    }
    return list;
  })
  .then(list => {
    app.listen(8080, () => {
      console.log("aaa");
    });
  })
  .catch(err => console.log(err));
