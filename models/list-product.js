const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ListProduct = sequelize.define('listProduct', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
})

module.exports = ListProduct;