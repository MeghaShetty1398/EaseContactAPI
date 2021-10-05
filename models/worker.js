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
        type : sequelize.STRING(3),
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
        type : sequelize.INTEGER,
        allowNull: false
    },
    qualification :{
        type : sequelize.STRING(30),
        allowNull: false
    },
    profile_image:{
        type: sequelize.STRING(500),
        allowNull: true
    },
    proof_document:{
        type: sequelize.STRING(500),
        allowNull: true
    },
    password :{
        type : sequelize.STRING(191),
        allowNull: false
    },
    available :{
        type : sequelize.BOOLEAN,
        allowNull: false
    },
    status :{
        type : sequelize.BOOLEAN,
        allowNull: false
    },
})
module.exports = workerModel;
