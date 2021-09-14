const CryptoJS = require('crypto-js');
const CryptoJSAesJson = {
    stringify: function (cipherParams) {
        var j = {
            ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
            iv: null, s: null
        };
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
    },
    parse: function (jsonStr) {
        var j = JSON.parse(jsonStr);
        var cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
        return cipherParams;
    }
}

let ENCRYPTION_KEY = 'EaseContact/01-08-2021';

const decrypt = function decrypt(text) {
    //console.log(text,ENCRYPTION_KEY);
    return CryptoJS.AES.decrypt(text, ENCRYPTION_KEY, { format: CryptoJSAesJson }).toString(CryptoJS.enc.Utf8);
}

module.exports = decrypt