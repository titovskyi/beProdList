const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UserProduct = sequelize.define('userProduct', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
})

module.exports = UserProduct;