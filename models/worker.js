const sequelize = require('sequelize');
const dbConnection = require('../utilities/connections/mysqlConnection');

const workerModel = dbConnection.define('worker',{
    id: {
        type: sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    name :{
        type : sequelize.STRING(50),
        allowNull: false
    },
    mobile :{
        type : sequelize.STRING(12),
        unique: true,
        allowNull: false
    },
    email :{
        type : sequelize.STRING(191),
        unique: true,
        allowNull: false
    },
    gender :{
        type : sequelize.STRING(6),
        allowNull: false
    },
    age :{
        type : sequelize.INTEGER,
        allowNull: false
    },
    address :{
        type : sequelize.STRING(500),
        allowNull: false
    },
    pincode :{
        type : sequelize.STRING(10),
        allowNull: false
    },
    state :{
        type: sequelize.STRING(20),
        allowNull: false,
    },
    city :{
        type: sequelize.STRING(20),
        allowNull: false,
    },
    area :{
        type: sequelize.STRING(20),
        allowNull: false,
    },
    experience :{
        type : sequelize.NUMBER(3,2),
        allowNull: false
    },
    qualification :{
        type : sequelize.STRING(30),
        allowNull: false
    },
    password :{
        type : sequelize.STRING(191),
        allowNull: false
    },
    status :{
        type : sequelize.BOOLEAN,
        allowNull: false
    }
})
module.exports = workerModel;
