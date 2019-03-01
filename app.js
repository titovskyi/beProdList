const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");

const app = express();

const productRoutes = require("./routes/product");
const listRoutes = require("./routes/list");
const authRoutes = require("./routes/auth");
const friendshipRoutes = require("./routes/friendship");

const List = require("./models/list");
const Product = require("./models/product");
const ListProduct = require("./models/list-product");
const User = require("./models/user");
const UserList = require("./models/user-list");
const Friendship = require("./models/friendship");

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
app.use(authRoutes);
app.use(friendshipRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ error: message, data: data });
});

List.belongsToMany(Product, { through: ListProduct });
// Product.belongsToMany(List, { through: ListProduct });
User.belongsToMany(List, {through: UserList});

// User.belongsToMany(Product, {through: UserProduct});
User.hasMany(Product);
// User.hasMany(Friendship);
Friendship.belongsTo(User);

sequelize
  // .sync({force: true})
  .sync()
  .then(list => {
    app.listen(8080, () => {
      console.log("aaa");
    });
  })
  .catch(err => console.log(err));
