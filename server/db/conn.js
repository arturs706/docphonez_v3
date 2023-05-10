require('dotenv').config();
const { Client } = require('pg')

const client = new Client(process.env.DATABASE_URL_HOST)

client.connect(function(err) {
    if (err) {
        console.log('Error connecting to database', err);
        return;
    }
    console.log('Connection established');
});

module.exports = client;