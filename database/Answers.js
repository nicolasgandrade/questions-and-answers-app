const { Sequelize } = require('sequelize');
const connection = require('./database');

const Answers = connection.define('answers', {
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    source: {
        type: Sequelize.STRING,
        allowNull: true
    },
    questionId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

Answers.sync({force: false});

module.exports = Answers