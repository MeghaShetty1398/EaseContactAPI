const sequelize = require('sequelize');
const dbConnection = require('../utilities/connections/mysqlConnection');

const categoryModel = dbConnection.define('category',{
    id: {
        type: sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    name :{
        type : sequelize.STRING(50),
        allowNull: false
    },
    status :{
        type : sequelize.BOOLEAN,
        allowNull: false
    },
})
module.exports = categoryModel;
