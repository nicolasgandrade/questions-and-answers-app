const Sequelize = require('sequelize');

const connection = new Sequelize('ask-app', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection