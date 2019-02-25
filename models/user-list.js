const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UserList = sequelize.define('userList', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  }
})

module.exports = UserList;