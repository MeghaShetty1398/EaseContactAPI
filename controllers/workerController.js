const models = require('../utilities/connections/allModels');
const encrypt = require('./../utilities/middleware/encrypt');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sendMail = require('./../utilities/connections/sendEmail');
const image = require('../utilities/connections/image');
const { user } = require('../utilities/connections/allModels');
const nowdate = new Date();

const getWorker = async (req, res) => {
    await models.worker.findAll({
        where: {
            status: true
        },
        attributes: ['id','name','mobile','email','gender','age','experience','qualification','address','pincode'],
  
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

const createWorker = [
    check('name').matches(/^[a-zA-Z ]+$/i).isLength({ min: 2 }),
    check('mobile').isNumeric().isLength({ min: 10, max: 10 }),
    check('email').isEmail().withMessage("Invalid Email"),
    check('gender').isString().withMessage("Invalid Gender"),
    check('age').isInt().withMessage("Invalid Age"),
    check('experience').isNumeric().withMessage("Invalid Experience"),
    check('qualification').isString().withMessage("Invalid Qualification"),
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
        models.worker.create({
            name:req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            gender:req.body.gender,
            age:req.body.age,
            experience:req.body.experience,
            qualification:req.body.qualification,
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
    getWorker:getWorker,
    createWorker:createWorker
}