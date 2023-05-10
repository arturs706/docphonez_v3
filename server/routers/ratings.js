const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const client = require('../db/conn');
const authenticateToken = require('../middleware/authz');
var moment = require('moment'); 
const { v4: uuidv4 } = require('uuid');


router.get('/retrieveallratings', bodyParser.json(), authenticateToken, async (req, res) => {
    const userEmail = req.user.email;
    const user = await client.query("SELECT usid FROM users WHERE email = $1", [userEmail]);
    if (user.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const userid = user.rows[0].usid;
    const SELECT_RATINGS = `SELECT * FROM ratings WHERE userid = $1`;
    try {
        const ratings = await client.query(SELECT_RATINGS, [userid]);
        res.status(200).json({ "status": "success", "data": ratings.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });  
    }
});

router.post('/addrating', bodyParser.json(), authenticateToken, async (req, res) => {
    const mysqlTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const ratingid = uuidv4();
    const useremail = req.user.email;
    const user = await client.query("SELECT usid FROM users WHERE email = $1", [useremail]);
    if (user.rows.length === 0) {
        res.status(400).json({ error: 'User not found' });
        return;
    }
    const userid = user.rows[0].usid;
    const { productname, rating } = req.body;
    const product = await client.query("SELECT modelnr FROM products WHERE prodname = $1", [productname]);
    
    const productModel = product.rows[0].modelnr;
    const INSERT_RATING = `INSERT INTO ratings (ratingid, productmodel, productname, userid, rating, created_at) VALUES ($1, $2, $3, $4, $5, $6)`;
    try {
        await client.query(INSERT_RATING, [ratingid, productModel, productname, userid, rating, mysqlTimestamp]);
        res.status(200).json({ message: 'Rating added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;