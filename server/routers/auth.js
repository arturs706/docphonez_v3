require('dotenv').config();
const client = require('../db/conn')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/jwt');
const { serialize } = require('cookie');
const bodyParser = require('body-parser');


router.post('/login', bodyParser.json(), async (req, res) => {
    try {
        const {email, passwd} = req.body;
        
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        //check the length of the array
        if (user.rows.length === 0) {return res.status(401).json({"status": "error", "message": "Incorrect email or password"})}
        if (user.rows[0].authmethod === 'google' || user.rows[0].authmethod === 'facebook') {
            return res.status(403).json({"status": "error", "message": "You cannot login using this method"});
        }
        //check if user is verified
        const isunderverification = await client.query("SELECT email_ver FROM users WHERE email = $1", [req.body.email]);
        if (isunderverification.rows.length > 0) {
            if (isunderverification.rows[0].email_ver === false) {
                return res.status(403).json({"status": "error", "message": "Please verify your email address"});
            }
        }
    
        const validPassword = await bcrypt.compare(passwd, user.rows[0].passwd);
        if (!validPassword) {return res.status(401).json({"status": "error", "message": "Incorrect email or password"})}
        const tokens = generateToken(user.rows[0]);
        const accessToken = tokens.accessToken;
        const refreshToken = tokens.refreshToken;
        const serialized = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        res.setHeader('Set-Cookie', serialized);
        res.status(200).json({message : 'Logged in successfully', "status": "success", "accessToken": accessToken});
    } catch (error) {
        res.status(401).json({error : error.message});
    } 
});

router.post('/refresh_token', bodyParser.json(), (req, res) => {
   try {
    const refreshToken = req.cookies.refreshToken;    
    if(refreshToken === null) {return res.status(401).json({error : 'No token provided'})}
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {return res.status(403).json({err: err.message})}
        let tokens = generateToken(user);
        const serialized = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });
        res.setHeader('Set-Cookie', serialized);
        res.json({accessToken: tokens.accessToken});
        })
        } catch (err) {
            res.status(401).json({err: err.message});
        }
});

router.delete('/logout', bodyParser.json(), (req, res) => {
    res.clearCookie('refreshToken');
    req.session = null;
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'You have been logged out.' });
  });



module.exports = router;
