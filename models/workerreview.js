const sequelize = require('sequelize');
const dbConnection = require('../utilities/connections/mysqlConnection');

const workerreviewModel = dbConnection.define('reviewworker',{
    id: {
        type: sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    user_id :{
        type: sequelize.BIGINT(20),
        allowNull: false,
        references: {
            model: 'users', // This is a reference to another model
            key: 'id', // This is the column name of the referenced model
        }
    },
    worker_id :{
        type: sequelize.BIGINT(20),
        allowNull: false,
        references: {
            model: 'workers', // This is a reference to another model
            key: 'id', // This is the column name of the referenced model
        }
    },
    review :{
        type : sequelize.STRING(100),
        allowNull: false
    },
    status :{
        type : sequelize.BOOLEAN,
        allowNull: false
    },
})
module.exports = workerreviewModel;
