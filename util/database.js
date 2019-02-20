const Sequelize = require('sequelize');

const sequelize = new Sequelize('productapp', 'titovskyi', 'titovskyi', {
  dialect: 'postgres',
  host: '192.168.1.221',
  port: '5432'
  // host: 'demo.broscorp.net',
  // port: '44403'
});

module.exports = sequelize;