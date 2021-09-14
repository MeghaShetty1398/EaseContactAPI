const decrypt = require('./decrypt');
const encrypt = require('./encrypt');

module.exports = function (req, res, next) {
    console.log(encrypt('EaseContact_pghsuijbndkflghghghnbgdrkljsnmjcfbkgsru'))
    if (!req.query.string) return res.status(400).json({ error: 'Unauthorized API Access1' });
    let enc = Buffer.from(req.query.string, 'base64').toString();

    if (JSON.parse(decrypt(enc)) === process.env.ENC_KEY) {
        next();
    } else {
        return res.status(400).json({ error: 'Unauthorized API Access' });//, string: JSON.parse(decrypt(req.query.string)) 
    }
}