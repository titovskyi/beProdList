const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Friendship = sequelize.define('friendship', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  friendEmail: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Friendship;