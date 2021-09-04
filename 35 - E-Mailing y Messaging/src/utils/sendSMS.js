const dotenv = require('dotenv');
dotenv.config();

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;

const client = require('twilio')(accountSid, authToken);

module.exports = client;