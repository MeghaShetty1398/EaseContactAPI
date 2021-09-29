const models = require('../utilities/connections/allModels');
const encrypt = require('./../utilities/middleware/encrypt');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sendMail = require('./../utilities/connections/sendEmail');
const image = require('../utilities/connections/image');
const base64ToImage = require('../utilities/connections/base64fun');
const { user } = require('../utilities/connections/allModels');
const nowdate = new Date();

const getWorker = async (req, res) => {
    await models.worker.findAll({
        where: {
            status: true
        },
        attributes: ['id','name','mobile','email','gender','age','experience','qualification','profile_image','proof_document','address','pincode'],
  
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
    check('age').isNumeric().withMessage("Invalid Age"),
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
            pincode:req.body.pincode,
            state:req.body.state,
            city:req.body.city,
            area:req.body.area,
            password:hashPassword,
            status: 1,
        }).then((result) => {  
            models.worker.findOne({
                where: { id: result.id }
            })
            .then(re => {
                re.profile_image = base64ToImage(req, 'worker', result.id, 'profile_image', req.body.profile_image);
                re.proof_document = base64ToImage(req, 'worker', result.id, 'proof_document', req.body.proof_document);
                re.save();
            })       
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
const checkWorkerCredential = [
    check('email').isEmail().withMessage("Invalid Email"),
    check('password').isLength({ min: 5 }).withMessage("Invalid Password"),
    check('string').isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const worker = await models.worker.findOne({ where: { email: req.body.email } });
        if (!worker) { return res.status(200).json({ 'error': 'Invalid Email' }); }

        const validPass = await bcrypt.compare(req.body.password, worker.password);
        if (!validPass) { return res.status(200).json({ 'error': 'Invalid Password' }); }

        models.worker.findOne({
            where: {
                email: worker.email
            },
            attributes: ['id','name','mobile','email','gender','age','experience','qualification','address','pincode'],
       
        }).then(result => {
            res.json({ 'success': true, 'token': jwt.sign({ id: user.id }, process.env.ENC_KEY), 'user': result });
        }).catch(err => {
            res.status(422).json({
                result: err
            });
        });

    }
];
module.exports = {
    getWorker:getWorker,
    checkWorkerCredential:checkWorkerCredential,
    createWorker:createWorker
}