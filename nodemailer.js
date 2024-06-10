const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

function sendMail(to, subject, text, html) {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to,
        subject,
        text,
        html
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                reject(error);
            } else {
                console.log('Email sent successfully:', info.response);
                resolve(info);
            }
        });
    });
}

module.exports = sendMail;
