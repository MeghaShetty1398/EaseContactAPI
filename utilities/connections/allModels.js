const { technicainmaster } = require('./allRoutes');

const Models = {
    user: require('../../models/user'),
    worker: require('../../models/worker'),
    otp:require('../../models/otp'),
    category: require('../../models/category'),
    workercategory:require('../../models/workercategory'),
    assignwork:require('../../models/assignwork')
}

module.exports = Models;
