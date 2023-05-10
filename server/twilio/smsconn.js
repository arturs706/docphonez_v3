require('dotenv').config();


const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const smsclient = require('twilio')(accountSid, authToken);

module.exports = smsclient;