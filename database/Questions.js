const { Sequelize } = require('sequelize');
const connection = require('./database');

const Questions = connection.define('questions', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    question: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Questions.sync({force: false}).then(() => {});

module.exports = Questions;