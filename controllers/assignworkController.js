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
module.exports = {
    createAssignWorker:createAssignWorker
}