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

function categoryRelation()
{
    models.category.hasOne(models.workercategory,{foreignKey:'category_id'})
}
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
        const category = await models.category.findOne({ where: { name: req.body.name } });
        console.log(req.user.id)
        models.workercategory.create({
            worker_id:req.user.id,
            category_id:category.id,
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
        const category = await models.category.findOne({ where: { name: req.body.name } });
        models.workercategory.findOne({
            where: {
                id: req.body.id,
                status: true
            }
        }).then((result) => {
            console.log(result)
            if(result)
            {    result.update({
                    category_id:category.id,
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

        await models.workercategory.findOne({
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
// const getAllCategory = async (req, res) => {
//     categoryRelation()
//     await models.category.findAll({
//         where: {
//             status: true
//         },
//         attributes: ['id','name','status'],
//         include:[
//             {
//                 model: models.workercategory,
//                 attributes: ['id','worker_id','charge','duration','negotiable','status'],
//                 required: true,
//                 where: {
//                     status: true,
//                 } 
//             }, 
//         ]
//     }).then(result => {
//         res.json({
//             message: result
//         })
//     }).catch(err => {
//         res.json({
//             result: err
//         });
//     });
// }
const getAllCategory = [ 
    async (req, res) => {
        categoryRelation();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        await models.workercategory.findAll({
            where: {
                worker_id:req.user.id,
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
]
 module.exports = {
    getAllCategory:getAllCategory,
    createCategory:createCategory,
    updateCategory:updateCategory,
    deleteCategory:deleteCategory
 }