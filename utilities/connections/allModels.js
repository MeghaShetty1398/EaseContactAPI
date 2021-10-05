const { technicainmaster } = require('./allRoutes');

const Models = {
    user: require('../../models/user'),
    worker: require('../../models/worker'),
    otp:require('../../models/otp'),
    category:require('../../models/category')
}

module.exports = Models;
