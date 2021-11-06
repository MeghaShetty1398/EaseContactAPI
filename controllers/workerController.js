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

function workerRelation() {
   models.workercategory.belongsTo(models.worker,{foreignKey:'worker_id'} );
   models.workercategory.belongsTo(models.category,{foreignKey:'category_id'});
   models.category.hasMany(models.workercategory,{foreignKey:'category_id'})
}
function workerReviewRelation()
{
    models.workerreview.belongsTo(models.worker,{foreignKey:'worker_id'} );
    models.workerreview.belongsTo(models.user,{foreignKey:'user_id'});
    models.user.hasMany(models.workerreview,{foreignKey:'user_id'});
    models.worker.hasMany(models.workerreview,{foreignKey:'worker_id'});
}
const getWorker = async (req, res) => {
    workerRelation()
    await models.category.findAll({
        // where: {
        //     status: true
        // },
        // attributes: ['id','name','mobile','email','gender','age','experience','qualification','profile_image','proof_document','address','pincode','state','city','area','available','status'],
        // include:[
        //     {
        //         model: models.category,
        //         attributes: ['id','name','charge','duration','negotiable','status'],
        //         required: true,
        //         where: {
        //             status: true,
        //         } 
        //     }, 
        // ]
        where: {
            status: true
        },
        attributes:['name'],
        include:[
                {
                    model: models.workercategory,
                    attributes: ['id','name','charge','duration','negotiable','status'],
                    required: true,
                    where: {
                        status: true,
                    } ,
                    include:[
                        {
                            model: models.worker,
                            attributes: ['id','name','mobile','email','gender','age','experience','qualification','profile_image','proof_document','address','pincode','state','city','area','available','status'],
                            
                            required: true,
                            where: {
                                status: true,
                            } 
                        }, 
                    ]
                }, 
            ]
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
            available:1,
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
            attributes: ['id','name','mobile','email','gender','age','experience','qualification','address','pincode','profile_image','available'],
       
        }).then(result => {
            res.json({ 'success': true, 'token': jwt.sign({ id: worker.id }, process.env.ENC_KEY), 'user': result });
        }).catch(err => {
            res.status(422).json({
                result: err
            });
        });

    }
];

//Worker Review
const createWorkerReview = [
    check('worker_id').not().isEmpty().withMessage("Invalid Worker ID"),
    check('review').isString().withMessage("Invalid Details"),
    check('string').isString(),
    async (req, res) => {
        console.log(req.user.id)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        
        models.workerreview.create({
            user_id:req.user.id,
            worker_id:req.body.worker_id,
            review:req.body.review,
            status: 1,
        }).then((result) => {
            res.json({ 'success': true, 'error': false });           
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

//Worker review
const getWorkerReview = async (req, res) => {
    workerReviewRelation()
    await models.workerreview.findAll({
        where: {
            worker_id:req.user.id,
            status: true
        },
        attributes:['user_id','worker_id','review'],
        include:[
                {
                    model: models.user,
                    attributes: ['id','name','email','mobile','address','state','city','area'],
                    required: true,
                    where: {
                        status: true,
                    }
                }, 
            ]
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
const getWorkerProfile = async (req, res) => {
    await models.worker.findAll({
        where: {
            id:req.user.id,
            status: true
        },
        attributes:['id','name','mobile','email','gender','age','experience','qualification','profile_image','proof_document','address','pincode','state','city','area','available','status','available'],
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
const updateAvailability = [
    check('string').isString(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return res.status(422).json({ errors: errors.array() });
        }
        models.worker.findOne({
            where: {
                id:req.user.id,
                status: true
            }
        }).then((result) => {
            console.log(result)
            if(result)
            {    result.update({
                    available:req.body.available,
                }).then(result => {
                    res.json({ 'success': true, result: result });    
                }).catch(err => {
                    res.json({
                        result: err
                    });
                });
            }
            else{
                res.status(422).json({ result: { error: 'no worker found' } });
            }

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
    checkWorkerCredential:checkWorkerCredential,
    createWorker:createWorker,
    createWorkerReview:createWorkerReview,
    getWorkerReview:getWorkerReview,
    getWorkerProfile:getWorkerProfile,
    updateAvailability:updateAvailability
}