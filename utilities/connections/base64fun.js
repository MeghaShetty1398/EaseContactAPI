const image = require('./image');
const fs = require('fs');

function base64ToImage(req, userType, prodid, folderT, img = null) {

    const url = `http://${req.headers.host}/`;
    const dirName = `${userType}/${prodid}/${folderT}`;
    const file = {
        encoding: { encoding: 'base64' },

        front: '',
        ftype: '',
        fbase64: '',
        front_name: '',
    }

    if (img) {
        file.front = img.split(';base64,');
    } else {
        file.front = image.split(';base64,');
    }
    let title = req.body.title;
    let name = req.body.name;
    file.ftype = file.front[0].split('data:image/')[1];
    file.fbase64 = file.front[1];
    if(title){
        file.front_name = `${dirName}/${Date.now()}_${title.replace(/\s/g, '')}.${file.ftype}`;
    }
    else{
        file.front_name = `${dirName}/${Date.now()}_${name.replace(/\s/g, '')}.${file.ftype}`;
    }

    if (!fs.existsSync(dirName)) { fs.mkdirSync(`./assets/${dirName}`, { recursive: true }); }
    fs.writeFileSync(`./assets/${file.front_name}`, file.fbase64, file.encoding);

    return `${url}${file.front_name}`;
}

module.exports = base64ToImage;