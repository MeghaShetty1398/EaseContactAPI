const models = require('../utilities/connections/allModels');
const encrypt = require('./../utilities/middleware/encrypt');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sendMail = require('./../utilities/connections/sendEmail');
const image = require('../utilities/connections/image');
const { user } = require('../utilities/connections/allModels');
const nowdate = new Date();

/*function userRelation() {
    models.signup.belongsTo(models.userType, { foreignKey: 'user_type_id' });
    models.signup.belongsTo(models.stream, { foreignKey: 'stream_id' });
    models.signup.belongsTo(models.subStream, { foreignKey: 'substream_id' });
    models.signup.belongsTo(models.state, { foreignKey: 'state_id' });
    models.signup.belongsTo(models.city, { foreignKey: 'city_id' });
    models.signup.belongsTo(models.area, { foreignKey: 'area_id' });
}*/
const getUser = async (req, res) => {
    userRelation();
    await models.signup.findAll({
        where: {
            status: true
        },
        attributes: ['id', 'name', 'mobile', 'email',  'age'],
  
    }).then(result => {
        res.json({
            message: result
        })
    }).catch(err => {
        res.json({
            result: err
        });
    });
}
//const salt = await bcrypt.genSalt(10);
//const hashPassword = await bcrypt.hash(req.body.password, salt);

const checkUserCredential = [
    check('email').isEmail().withMessage("Invalid Email"),
    check('password').isLength({ min: 5 }).withMessage("Invalid Password"),
    check('string').isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const user = await models.user.findOne({ where: { email: req.body.email } });
        if (!user) { return res.status(200).json({ 'error': 'Invalid Email' }); }

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) { return res.status(200).json({ 'error': 'Invalid Password' }); }

        models.user.findOne({
            where: {
                email: user.email
            },
            attributes: ['id','name','email','mobile','address','state','city','area'],
       
        }).then(result => {
            res.json({ 'success': true, 'token': jwt.sign({ id: user.id }, process.env.ENC_KEY), 'user': result });
        }).catch(err => {
            res.status(422).json({
                result: err
            });
        });

    }
];

const createUser = [
    check('name').matches(/^[a-zA-Z ]+$/i).isLength({ min: 2 }),
    check('mobile').isNumeric().isLength({ min: 10, max: 10 }),
    check('email').isEmail().withMessage("Invalid Email"),
    check('address').isString().withMessage("Invalid Address"),
    check('pincode').isString().withMessage("Invalid Pincode"),
    check('area').isString().withMessage("Invalid Area"),
    check('state').isString().withMessage("Invalid State"),
    check('city').isString().withMessage("Invalid City"),
    check('password').isString().withMessage("Invalid Password"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        models.user.create({
            name:req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            address:req.body.address,
            address:req.body.address,
            pincode:req.body.pincode,
            state:req.body.state,
            city:req.body.city,
            area:req.body.area,
            password:hashPassword,
            status: 1,
        }).then((result) => {         
            res.json({ 'success': true, 'error': false });
        }).catch(err => {
                res.json({
                    result: err.message
                });
            }).catch(err => {
            if (err.message.toLowerCase() === "validation error") {
                res.json({
                    result: err.errors
                });
            } else {
                res.json({
                    result: err.message
                });
            }
        });
    }
]

module.exports = {
    getUser: getUser,
    checkUserCredential: checkUserCredential,
    createUser:createUser
}