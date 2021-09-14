const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    pool:true,
    host: 'mails.book-a-book.in',
    port: 465,
    secure: true,
    auth: {
        user: 'admin@book-a-book.in',
        pass: 'CsS2!$fCzFf7'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
});

const sendMail = async (from, to, subject, htmldata) => {
    const message = {
        from: from, // Sender address
        to: to,         // List of recipients
        subject: subject, // Subject line
        //text: 'Have the most fun you can in a car. Get your Tesla today!', // Plain text body
        html: htmldata,
        /* attachments: [
            { // Use a URL as an attachment
              filename: 'your-testla.png',
              path: 'https://media.gettyimages.com/photos/view-of-tesla-model-s-in-barcelona-spain-on-september-10-2018-picture-id1032050330?s=2048x2048'
          }
        ] */
    };

    let result = null;
    transport.sendMail(message, function (err, info) {
        if (err) {
            //console.log(err)
            return result = { result: { error: err } };
        } else {
            //console.log(info);
            return result = { result: info }
        }
    });

    return await result;
}


module.exports = sendMail;