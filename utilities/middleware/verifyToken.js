const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');
    console.log(token)
    if (!token) return res.status(400).json({ error: 'Access Denied' });
    try {        
        const verified = jwt.verify(token.split(' ')[1], process.env.ENC_KEY);
        console.log(verified)
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid Token','message':error,'token':token });
    }
}