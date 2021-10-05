const sequelize = require('sequelize');
const dbConnection = require('../utilities/connections/mysqlConnection');

const categoryModel = dbConnection.define('category',{
    id: {
        type: sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    worker_id :{
        type: sequelize.BIGINT(20),
        allowNull: false,
        references: {
            model: 'workers', // This is a reference to another model
            key: 'id', // This is the column name of the referenced model
        }
    },
    name :{
        type : sequelize.STRING(50),
        allowNull: false
    },
    charge :{
        type : sequelize.DOUBLE(7,2),
        allowNull: false
    },
    duration :{
        type : sequelize.STRING(10),
        allowNull: false
    },
    negotiable :{
        type : sequelize.BOOLEAN,
        allowNull: false
    },
    status :{
        type : sequelize.BOOLEAN,
        allowNull: false
    },
})
module.exports = categoryModel;
