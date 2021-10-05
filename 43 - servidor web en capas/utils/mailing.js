const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporterGmail = nodemailer.createTransport({    
    secure: false, // use SSL    
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass
    },
    tls: {
        rejectUnauthorized: false
    }    
});

const transporter = nodemailer.createTransport(({
    host: "smtp.ethereal.email", // hostname
    secure: false, // use SSL
    port: 587, // port for secure SMTP
    auth: {
        user: 'reese.jast@ethereal.email',
        pass: 'P2jXvvMkbfcFGypmxG'
    },
    tls: {
        rejectUnauthorized: false
    }
}));

module.exports = {transporter, transporterGmail};

