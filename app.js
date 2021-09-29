//Installing express dotenv and bodyparser package
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
dotenv.config();

//Routes
const allRoutes = require('./utilities/connections/allRoutes');
// Set static folder
app.use(express.static(path.join(__dirname, './assets')));
app.use(bodyParser.urlencoded({ extended: true, limit: '7mb' }));
app.use(bodyParser.json({limit: '7mb'}));

//CORS
//Middle ware function
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();//Call next middleware
});

//Inatializing Routes
app.use(allRoutes.user);
app.use(allRoutes.worker);

//Database connection
const sequelize = require('./utilities/connections/mysqlConnection');
const { all } = require('./routes/userRoute');

//404 (Route NOt Found Middleware)
app.use((req, res, next) => {
    const statusCode = 404;
    const endPoints = req.url;
    const method = req.method;
    res.status(statusCode).json({
        message: `${method} method is not allowed for this ${endPoints} endpoint or ${endPoints} not found`
    });
});

//Error Handling or Error Response middleware
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || error;
    //console.log(error)
    res.status(statusCode).json({ message });
});

sequelize.sync()

app.listen(process.env.PORT || 3010);
