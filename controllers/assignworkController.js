const models = require('../utilities/connections/allModels');
const encrypt = require('../utilities/middleware/encrypt');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sendMail = require('../utilities/connections/sendEmail');
const image = require('../utilities/connections/image');
const { admin } = require('../utilities/connections/allModels');
const nowdate = new Date();
const base64ToImage = require('../utilities/connections/base64fun');
const sequelize=require('sequelize');

function assignwork(){
    models.assignwork.belongsTo(models.worker,{foreignKey:'worker_id'} );
    models.assignwork.belongsTo(models.user,{foreignKey:'user_id'});
    models.user.hasMany(models.assignwork,{foreignKey:'user_id'});
    models.worker.hasMany(models.assignwork,{foreignKey:'worker_id'});
}
const getUserWork = async (req, res) => {
    assignwork();
    await models.assignwork.findAll({
        where: {
            user_id:req.user.id,
            status: true
        },
        attributes:['id','user_id','worker_id','details','charge','accepted','completed','status','createdAt'],
        include:[
                {
                    model: models.worker,
                    attributes: ['id','name','mobile','email','gender','age','experience','qualification','profile_image','proof_document','address','pincode','state','city','area','available','status'],
                    required: true,
                    where: {
                        status: true,
                    }
                }, 
            ],
        order: [[sequelize.col('createdAt'), 'DESC'],],
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
const getWorkerWork = async (req, res) => {
    assignwork();
    await models.assignwork.findAll({
        where: {
            worker_id:req.user.id,
            status: true
        },
        attributes:['id','user_id','worker_id','details','charge','accepted','completed','status','createdAt'],
        include:[
                {
                    model: models.user,
                    attributes: ['id','name','email','mobile','address','state','city','area'],
                    required: true,
                    where: {
                        status: true,
                    }
                }, 
            ],
        order: [[sequelize.col('createdAt'), 'DESC'],],
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
const createAssignWorker = [
    check('worker_id').not().isEmpty().withMessage("Invalid Worker ID"),
    check('details').isString().withMessage("Invalid Details"),
    check('string').isString(),
    async (req, res) => {
        console.log(req.user.id)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        
        models.assignwork.create({
            user_id:req.user.id,
            worker_id:req.body.worker_id,
            details:req.body.details,
            charge:req.body.charge,
            accepted:0,
            completed:0,
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
const updateAccepted = [
    check('string').isString(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return res.status(422).json({ errors: errors.array() });
        }
        models.assignwork.findOne({
            where: {
                id:req.body.assignwork_id,
                status: true
            }
        }).then((result) => {
            console.log(result)
            if(result)
            {    result.update({
                    accepted:1
                }).then(result => {
                    res.json({ 'success': true, result: result });    
                }).catch(err => {
                    res.json({
                        result: err
                    });
                });
            }
            else{
                res.status(422).json({ result: { error: 'no assign work found' } });
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
const updateRejected = [
    check('string').isString(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return res.status(422).json({ errors: errors.array() });
        }
        models.assignwork.findOne({
            where: {
                id:req.body.assignwork_id,
                status: true
            }
        }).then((result) => {
            console.log(result)
            if(result)
            {    result.update({
                    accepted:2
                }).then(result => {
                    res.json({ 'success': true, result: result });    
                }).catch(err => {
                    res.json({
                        result: err
                    });
                });
            }
            else{
                res.status(422).json({ result: { error: 'no assign work found' } });
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
    createAssignWorker:createAssignWorker,
    getWorkerWork:getWorkerWork,
    getUserWork:getUserWork,
    updateAccepted:updateAccepted,
    updateRejected:updateRejected
}