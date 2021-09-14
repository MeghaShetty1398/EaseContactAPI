const sequelize = require('sequelize');
DB_HOST = 'localhost'

DB_NAME =  'easecontactdb'
DB_USER_NAME = 'root';
DB_PASSWORD = ''
const dbConnection = new sequelize(DB_NAME, DB_USER_NAME, DB_PASSWORD, {

    host: process.env.DB_HOST || 'localhost',
    dialect: "mysql",
    //logging: false,
});

dbConnection.authenticate()
    .then(() => {
        console.log('Connection has been established succesfully')
    })
    .catch(err => {
        throw new Error(`Unable to connect to the database: ${err}`);
    })

module.exports = dbConnection
