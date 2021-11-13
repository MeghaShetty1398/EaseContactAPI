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

const getTotalWork = [
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        await models.assignwork.findAll({
            where: {
                worker_id:req.user.id,
                status: true
            },
            attributes: [
                [sequelize.fn('count', sequelize.col('id')), 'total_work'],
            ],

        }).then(result => {
            console.log(result)
            res.json({
                result
            })
        }).catch(err => {
            res.json({
                result: err
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
const getAcceptedWork = [
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        await models.assignwork.findAll({
            where: {
                worker_id:req.user.id,
                accepted:1,
                status: true
            },
            attributes: [
                [sequelize.fn('count', sequelize.col('id')), 'accepted_work'],
            ],

        }).then(result => {
            console.log(result)
            res.json({
                result
            })
        }).catch(err => {
            res.json({
                result: err
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
const getRejectedWork = [
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        await models.assignwork.findAll({
            where: {
                worker_id:req.user.id,
                accepted:2,
                status: true
            },
            attributes: [
                [sequelize.fn('count', sequelize.col('id')), 'rejected_work'],
            ],

        }).then(result => {
            console.log(result)
            res.json({
                result
            })
        }).catch(err => {
            res.json({
                result: err
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
const getPendingApprovalWork = [
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        await models.assignwork.findAll({
            where: {
                worker_id:req.user.id,
                accepted:0,
                status: true
            },
            attributes: [
                [sequelize.fn('count', sequelize.col('id')), 'pending_work'],
            ],

        }).then(result => {
            console.log(result)
            res.json({
                result
            })
        }).catch(err => {
            res.json({
                result: err
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
const getCompletedWork = [
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        await models.assignwork.findAll({
            where: {
                worker_id:req.user.id,
                completed:1,
                status: true
            },
            attributes: [
                [sequelize.fn('count', sequelize.col('id')), 'completed_work'],
            ],

        }).then(result => {
            console.log(result)
            res.json({
                result
            })
        }).catch(err => {
            res.json({
                result: err
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
const getNotCompletedWork = [
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        await models.assignwork.findAll({
            where: {
                worker_id:req.user.id,
                completed:0,
                status: true
            },
            attributes: [
                [sequelize.fn('count', sequelize.col('id')), 'not_completed_work'],
            ],

        }).then(result => {
            console.log(result)
            res.json({
                result
            })
        }).catch(err => {
            res.json({
                result: err
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
    getTotalWork:getTotalWork,
    getAcceptedWork:getAcceptedWork,
    getRejectedWork:getRejectedWork,
    getPendingApprovalWork:getPendingApprovalWork,
    getCompletedWork:getCompletedWork,
    getNotCompletedWork:getNotCompletedWork
}