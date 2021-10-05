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

const createCategory = [
    check('name').isString().withMessage("Invalid category name"),
    check('charge').isNumeric().withMessage("Invalid charges"),
    check('duration').isString().withMessage("Invalid duration"),
    check('negotiable').not().isEmpty().withMessage("Invalid Negotiable status"),
    check('string').isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        console.log(req.user.id)
        models.category.create({
            worker_id:req.user.id,
            name:req.body.name,
            charge:req.body.charge,
            duration:req.body.duration,
            negotiable:req.body.negotiable,
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


const updateCategory = [
    check('id').isInt().withMessage("Invalid category ID"),
    check('name').isString().withMessage("Invalid category name"),
    check('charge').isNumeric().withMessage("Invalid charges"),
    check('duration').isString().withMessage("Invalid duration"),
    check('negotiable').not().isEmpty().withMessage("Invalid Negotiable status"),
    check('string').isString(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        models.category.findOne({
            where: {
                id: req.body.id,
                status: true
            }
        }).then((result) => {
            console.log(result)
            if(result)
            {    result.update({
                    name:req.body.name,
                    charge:req.body.charge,
                    duration:req.body.duration,
                    negotiable:req.body.negotiable,
                    status: 1,
                }).then(result => {
                    res.json({ 'success': true, result: result });    
                }).catch(err => {
                    res.json({
                        result: err
                    });
                });
            }
            else{
                res.status(422).json({ result: { error: 'no category found' } });
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

const deleteCategory = [
    check('category_id').isInt().withMessage("Invalid category ID"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        await models.category.findOne({
            where: {
                id: req.body.category_id,
                status: true
            }
        }).then(result => {
            if (result) {
                result.update({
                    status: 0
                }).then(result => {
                    res.json({
                        result: 'category Deleted'
                    })
                }).catch(err => {
                    res.json({
                        result: err
                    });
                });
            }else{
                res.json({
                    result: 'This category does not exists'
                })
            }

        }).catch(err => {
            res.json({
                result: err
            });
        });
    }
]
const getAllCategory = async (req, res) => {
    await models.category.findAll({
        where: {
            status: true
        },
        attributes: ['id','name','charge','duration','negotiable','status'],
    }).then(result => {
        if (result) {
            res.json({
                result: result
            })
        } else {
            res.json({
                result:'No category found'
            })
        }      
    }).catch(err => {
        res.json({
            result: err
        });
    });
} 
 module.exports = {
    getAllCategory:getAllCategory,
    createCategory:createCategory,
    updateCategory:updateCategory,
    deleteCategory:deleteCategory
 }