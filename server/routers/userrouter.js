const passport = require('passport');
const router = require('express').Router();
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
const dbclient = require('../db/conn');
const FacebookStrategy = require("passport-facebook").Strategy;
const bodyParser = require('body-parser');
const { serialize } = require('cookie');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/jwt');
const { v4: uuidv4 } = require('uuid');
var moment = require('moment'); 
const nodemailer = require('nodemailer');
const authenticateToken = require('../middleware/authz')
const bcrypt = require('bcrypt');
const smsclient = require('../twilio/smsconn');


const establishConnection = async () => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    });
    return transporter;
  }
  const sendEmail = async (customerEmail, userfullname) => {
    try {
      const transporter = await establishConnection();
      const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: customerEmail,
        subject: "Welcome to DoctorPhonez",
        html: emailtext(userfullname)
      };
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
    

  const emailtext = (userfullname) => `
  <body style='background-color: #fff; font-family: "Roboto", sans-serif; font-size: 16px; line-height: 1.4; color: #000235;'>
    <div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
      <h1 style='margin-top: 20px;'>Welcome to DoctorPhonez!</h1>
    </div>
    <div style='padding: 20px;'>
      <p>Dear ${userfullname},</p>
      <p>We are excited to welcome you to DoctorPhonez! As a member of our community, you'll have access to the latest and greatest mobile phones and accessories on the market.</p>
      <p>Our expert staff is always available to help you find the perfect phone and accessories to fit your lifestyle and budget. Whether you're looking for the latest iPhone or Samsung Galaxy, 
      or just need a new phone case or charger, we've got you covered.</p>
      <p>If you ever have any questions or need assistance, our support team is always here to help. You can reach us by email or phone, and we'll get back to you as soon as possible.</p>
      <p>Thank you again for choosing DoctorPhonez. We look forward to helping you stay connected and up-to-date with the latest mobile technology!</p>
    </div>
    <div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
      <p style='margin-top: 20px;'>Best regards,</p>
      <p style='margin-top: 10px;'>The DoctorPhonez Team</p>
    </div>
  </body>
  `;
  

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://pm.doctorphonez.co.uk/api/v1/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        const fullName = profile.displayName;
        const userEmail = profile.emails[0].value;
        const provider = profile.provider;
        const getUser = `SELECT * FROM users WHERE email = '${userEmail}'`;
        dbclient.query(getUser, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                if (res.rows.length > 0) {
                    if (res.rows[0].authmethod === 'google') {    
                        return cb(null, {fullName, userEmail, provider});
                    } else {
                        cb(null, null);
                    }
                } else {
                    return cb(null, {fullName, userEmail, provider});
                }
            }
        })}));

passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "https://pm.doctorphonez.co.uk/api/v1/facebook/callback",
        profileFields: ['id', 'email', 'displayName', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
      },
      function(accessToken, refreshToken, profile, cb) {
        const fullName = profile.displayName;
        const provider = profile.provider;
        const userEmail = profile.emails[0].value;
        const getUser = `SELECT * FROM users WHERE email = '${userEmail}'`;
        dbclient.query(getUser, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                if (res.rows.length > 0) {
                    if (res.rows[0].authmethod === 'facebook') {
                        return cb(null, {fullName, userEmail, provider});
                    } else {
                        
                        cb(null, null);
                    }
                } else {
                    return cb(null, {fullName, userEmail, provider});
                }
            }
        });
        
    }
    )
  );

router.get("/login/failed", bodyParser.json(), (req, res) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate."
        })});

router.get("/login/success", bodyParser.json(), (req, res) => {
    if (req.user) {
        const fullname = req.user.fullName;
        const email = req.user.userEmail;
        const provider = req.user.provider;
        dbclient.query(`SELECT * FROM users WHERE email = '${email}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else if (result.rows.length > 0) {
                const tokens = generateToken({email: email});
                const accessToken = tokens.accessToken;
                const refreshToken = tokens.refreshToken;
                const serialized = serialize('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7,
                    path: '/'
                });                
                res.setHeader('Set-Cookie', serialized);
                req.session = null;
                res.status(200).json({message : 'Logged in successfully', "status": "success", "accessToken": accessToken});
                
            } else if (result.rows.length === 0){
                var qty = 0;
                const uuid = uuidv4();
                const mysqlTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');
                if (qty === 0) {
                dbclient.query(`INSERT INTO users (usid, fullname, email, email_ver, authmethod, created_at) VALUES ('${uuid}', '${fullname}','${email}', '${true}', '${provider}', '${mysqlTimestamp}')`, (err, result) => {
                    qty = qty + 1;
                    if (err) {
                        console.log("Error creating user" - err);
                        res.status(400).json({message : 'Error creating user', "status": "error"});
                    } else {
                        const tokens = generateToken({email: email});
                        const accessToken = tokens.accessToken;
                        const refreshToken = tokens.refreshToken;
                        const serialized = serialize('refreshToken', refreshToken, {
                            httpOnly: true,
                            maxAge: 60 * 60 * 24 * 7,
                            path: '/'
                        });
                        res.setHeader('Set-Cookie', serialized);
                        req.session = null;
                        res.status(200).json({message : 'Logged in successfully', "status": "success", "accessToken": accessToken});
                        sendEmail(email, fullname);

                    }
                });
            }}
        })
    } else {
        res.status(401).json({message: 'User not logged in'});
    }
});

router.get("/facebook", bodyParser.json(), passport.authenticate("facebook", { scope: ["email"] }));

    
router.get('/google', bodyParser.json(), passport.authenticate('google', { 
    scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email']
}));

router.get("/facebook/callback", bodyParser.json(), passport.authenticate("facebook", {
      successRedirect: CLIENT_URL,
      failureRedirect: CLIENT_URL + "/account/login/failed",
    })
  );

router.get('/google/callback', bodyParser.json(), passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: CLIENT_URL + "/account/login/failed",
}));

passport.serializeUser(function(user, done) {
    done(null, user);
}
);

passport.deserializeUser(function(user, done) {
    done(null, user);
}
);

router.get('/users', bodyParser.json(), authenticateToken, async (req, res) => {
    try {
        const users = await dbclient.query('SELECT usid, fullname, dob, gender, mob_phone, email, created_at FROM users');
        res.json({users : users.rows});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

const localregemailtext = (userfullname, token) => `                
<body style='background-color: #fff; font-family: 'Roboto', sans-serif; font-size: 16px; line-height: 1.4; color: #000235;'>
<div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
<h1 style='margin-top: 20px;'>Registration Verification</h1>
</div>
<div style='padding: 20px;'>
<p>Dear ${userfullname},</p>
<p>Thank you for registering with DoctorPhonez! Please click on the link below to confirm your registration:</p>
<p><div style='margin-top: 20px';> Hello, please click the link below to verify your email address. <br> <a href='${CLIENT_URL}/account/register/${token}'>Verify email</a><div></p>
<p>If you cannot click on the link, please copy and paste the following URL into your browser:</p>
<p>${CLIENT_URL}/account/register/${token}</p>
<p>If you did not register for an account with DoctorPhonez, please disregard this email.</p>
</div>
<div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
<p style='margin-top: 20px;'>This email confirms that your registration has been received. Thank you for choosing DoctorPhonez!</p>
</div>
</body>`

  const sendEmailLocal = async (customerEmail, userfullname, token) => {
    try {
      const transporter = await establishConnection();
      const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: customerEmail,
        subject: "Verify your email @ DoctorPhonez",
        html: localregemailtext(userfullname, token)
      };
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }

  router.post('/register', bodyParser.json(), async (req, res) => {
    try {
        const isunderverification = await dbclient.query("SELECT email_ver FROM users WHERE email = $1", [req.body.email]);
        if (isunderverification.rows.length > 0) {
            if (isunderverification.rows[0].email_ver === false) {
                return res.status(403).json({"status": "error", "message": "Email already exists and is under verification"});
            }
        }
        if (!req.body || !req.body.email || !req.body.fullname || !req.body.dob || !req.body.gender || !req.body.mob_phone || !req.body.passwd) {
            return res.status(400).json({"status": "error", "message": "Missing required fields"});
        }
        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const emailExists = await dbclient.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
        if (emailExists.rows.length > 0) {
            return res.status(403).json({"status": "error", "message": "Email already exists"});
        }
        const mob_phoneExists = await dbclient.query('SELECT * FROM users WHERE mob_phone = $1', [req.body.mob_phone]);
        if (mob_phoneExists.rows.length > 0) {
            return res.status(403).json({"status": "error", "message": "Mobile number already exists"});
        }

        const uuid = uuidv4();
        const hashedPassword = await bcrypt.hash(req.body.passwd, 10);
        const token = generateToken(req.body.email);
        const verificationToken = token.verificationToken;
        const user = await dbclient.query('INSERT INTO users (usid, fullname, dob, gender, mob_phone, email, passwd, email_ver_token, authmethod, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [uuid, req.body.fullname, req.body.dob, (req.body.gender).toLowerCase(), req.body.mob_phone, req.body.email, hashedPassword, verificationToken,'local', mysqlTimestamp]);
        if (user.rows.length > 0) {
            sendEmailLocal(req.body.email, req.body.fullname, verificationToken);
            res.status(201).json({"status": "success", "message": "Verification email has been sent"});
          } else {
            res.status(400).json({"status": "error", "message": "User not found."});
          }                 
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.post('/register/success/:token', bodyParser.json(), async (req, res) => {
    try {
        const token = req.params.token;
        //check if token has expired
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        if (decoded.exp * 1000 < Date.now()        ) {
            return res.status(403).json({"status": "error", "message": "Token has expired"});
        }
        if (!token) {
            return res.status(400).json({"status": "error", "message": "Missing required fields"});
        }
        const user = await dbclient.query('SELECT * FROM users WHERE email_ver_token = $1', [token]);
        if (user.rows.length > 0) {
            dbclient.query('UPDATE users SET email_ver = $1, email_ver_token = $2 WHERE email_ver_token = $3', [true, null, token]);
            sendEmail(user.rows[0].email, user.rows[0].fullname);
            res.status(200).json({"status": "success", "message": "Email verified successfully"});
        } else {
            res.status(404).json({"status": "error", "message": "Invalid token"});
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({"status": "error", "message": "Token has expired"});
        } else {
            res.status(500).json({error : error.message});
        }
    }
});

router.post('/resendemail', bodyParser.json(), async (req, res) => {
    const email = req.body.email;
    const passwd = req.body.passwd;
    console.log(email, passwd);
    try {
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length > 0) {
            const isunderverification = await dbclient.query("SELECT email_ver FROM users WHERE email = $1", [email]);
            if (isunderverification.rows.length > 0) {
                if (isunderverification.rows[0].email_ver === false) {
                    const token = generateToken(email);
                    const verificationToken = token.verificationToken;
                    await dbclient.query('UPDATE users SET email_ver_token = $1 WHERE email = $2', [verificationToken, email]);
                    
                    sendEmailLocal(email, user.rows[0].fullname, verificationToken);
                    res.status(200).json({"status": "success", "message": "Verification email has been sent"});
                } else {
                    res.status(403).json({"status": "error", "message": "Email already verified"});
                }
            }
        } else {
            res.status(404).json({"status": "error", "message": "User not found"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

//create a protected route for a single user to view their profile
router.get('/profile', bodyParser.json(), authenticateToken, async (req, res) => {
    const email = req.user.email;
    try {
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [email]);
        // if ((user.rows[0].mob_phone === null || user.rows[0].gender === null || user.rows[0].dob === null  ) && (user.rows[0].authmethod === 'google' || user.rows[0].authmethod === 'facebook')) {
        //     return res.status(403).json({"status": "error", "message": "Details must be updated"});
        // }
        if (user.rows.length > 0) {
            res.status(200).json({"status": "success", "message": "User profile retrieved successfully", "data": user.rows[0]});
        } else {
            res.status(404).json({"status": "error", "message": "User not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error : error.message});
    }
});

router.delete('/deleteprofile', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;

    try {
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const validPassword = await bcrypt.compare(password, user.rows[0].passwd);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        } else if (user.rows.length > 0) {
            await dbclient.query('DELETE FROM users WHERE email = $1', [req.user.email]);
            res.clearCookie('refreshToken');
            res.status(200).json({"status": "success", "message": "User profile deleted successfully"});
        } else {
            res.status(404).json({"status": "error", "message": "User not found"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.put('/updateprofile', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;
    if (!password) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    const fullname = req.body.fullname;
    const gender = req.body.gender;
    const dob = req.body.dob;
    const email = req.user.email;
    const queryString = `UPDATE users SET
    fullname = COALESCE(NULLIF($1, '')),
    gender = COALESCE(NULLIF($2, '')),
    dob = COALESCE(NULLIF($3, ''))
    WHERE email = $4`;
    try {
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [email]);
        const validPassword = await bcrypt.compare(password, user.rows[0].passwd);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        }
        if (user.rows.length < 1) {
            res.status(404).json({"status": "error", "message": "User not found"});
        }
        await dbclient.query(queryString, [fullname, gender, dob, email]);
        res.status(200).json({"status": "success", "message": "User profile updated successfully"});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

const emailupdatetext = (userfullname, link) => `                
<body style='background-color: #fff; font-family: 'Roboto', sans-serif; font-size: 16px; line-height: 1.4; color: #000235;'>
<div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
<h1 style='margin-top: 20px;'>Email Update Verification</h1>
</div>
<div style='padding: 20px;'>
<p>Dear ${userfullname},</p>
<p>You have requested to update your email address for your account with DoctorPhonez. Please click on the link below to confirm your new email address:</p>
<p><div style='margin-top: 20px';> Hello, please click the link below to verify your new email address. <br> <a href='${link}'>Verify email</a><div></p>
<p>If you cannot click on the link, please copy and paste the following URL into your browser:</p>
<p>${link}</p>
<p>If you did not request to update your email address for your DoctorPhonez account, please disregard this email.</p>
</div>
<div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
<p style='margin-top: 20px;'>This email confirms that your request to update your email address has been received. Thank you for choosing DoctorPhonez!</p>
</div>
</body>`

router.post('/updateprofile/contactdetails', bodyParser.json(), authenticateToken, async (req, res) => {
    
    const password = req.body.passwd;
    if (!password) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    const newEmail = req.body.email;
    const currentEmail = req.user.email;

    //all good up to here
    try {
        var userfullname = "";
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [currentEmail]);
        if (user.rows[0].authmethod === 'google' || user.rows[0].authmethod === 'facebook') {
            return res.status(403).json({"status": "error", "message": "You cannot update your email using this method"});
        }
        userfullname = user.rows[0].fullname; 
        const validPassword = await bcrypt.compare(password, user.rows[0].passwd);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        } 
   
        if (user.rows.length < 1) {
            res.status(404).json({"status": "error", "message": "User not found"});
        }
        const token = generateToken(req.body.email);
        const verificationToken = token.emailUpdateToken;
        await dbclient.query('INSERT INTO email_verification_tokens (email, token) VALUES ($1, $2)', [newEmail, verificationToken]);
        

        const establishConnection = async () => {
            const transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
              }
            });
            return transporter;
          }
          const verificationLink = `http://localhost:3000/account/settings/updatecontacts/${verificationToken}`;

          const sendEmail = async (newEmail, userfullname, verificationLink) => {
            try {
              const transporter = await establishConnection();
              const mailOptions = {
                from: process.env.SMTP_USERNAME,
                to: newEmail,
                subject: "Update email address",
                html: emailupdatetext(userfullname, verificationLink)
              };
              await transporter.sendMail(mailOptions);
              console.log("Email sent successfully");
            } catch (error) {
              console.error("Error sending email:", error);
              throw new Error("Failed to send email");
            }
          }
          sendEmail(newEmail, userfullname, verificationLink);

        res.status(200).json({"status": "success", "message": "A verification email has been sent to your new email address"});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.put('/updateprofile/verifynewemail/:token', bodyParser.json(), authenticateToken, async (req, res) => {

    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.EMAIL_UPDATE_SECRET);
    if (decoded.exp * 1000 < Date.now()        ) {
        return res.status(403).json({"status": "error", "message": "Token has expired"});
    }
    if (!token) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const result = await dbclient.query('SELECT email FROM email_verification_tokens WHERE token = $1', [token]);
        if (result.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "Token not found or has expired"});
        }
        const email = result.rows[0].email;
        await dbclient.query('UPDATE users SET email = $1 WHERE email = $2', [email, req.user.email]);
        await dbclient.query('UPDATE userorders set useremail = $1 WHERE useremail = $2', [email, req.user.email]);
        await dbclient.query('DELETE FROM email_verification_tokens WHERE token = $1', [token]);
        res.clearCookie('refreshToken');
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [email]);
        const tokens = generateToken(user.rows[0]);
        const accessToken = tokens.accessToken;
        const refreshToken = tokens.refreshToken;
        const mob_phone = user.rows[0].mob_phone;
        const serialized = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        res.setHeader('Set-Cookie', serialized);

        res.status(200).json({"status": "success", "message": "Your email address has been updated successfully", "accessToken": accessToken});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.post('/updateprofile/mobpassnumber', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;
    const newMobilePhone = req.body.mob_phone;
    //check if newMobilePhone is valid phone number
    const ukPhoneNumberRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
    const isValid = ukPhoneNumberRegex.test(newMobilePhone);
    if (!isValid) {
        return res.status(400).json({"status": "error", "message": "Invalid mobile phone number"});
    }
    try {
        const checkifexists = await dbclient.query('SELECT * FROM users WHERE mob_phone = $1', [req.body.mob_phone]);
        if (checkifexists.rows.length > 0) {
            return res.status(400).json({"status": "error", "message": "Mobile phone number already exists"});
        }
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const userid = user.rows[0].usid;
        if (user.rows[0].authmethod === 'local') {
        if (!password) {
            return res.status(400).json({"status": "error", "message": "Missing required fields"});
        }
        const passwordCheck = user.rows[0].passwd;
        const validPassword = await bcrypt.compare(password, passwordCheck);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        }}
        //check if user has already requested for a verification code
        const checkifexistscode = await dbclient.query('SELECT * FROM mobp_verification_tokens WHERE userid = $1', [userid]);
        if (checkifexistscode.rows.length > 0) {
            await dbclient.query('DELETE FROM mobp_verification_tokens WHERE userid = $1', [userid]);
        }
        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const generatenumber = Math.floor(Math.random() * 9000) + 1000;
        await dbclient.query('INSERT INTO mobp_verification_tokens (userid, mob_phone, secretcode, created_at) VALUES ($1, $2, $3, $4)', [userid, newMobilePhone, generatenumber, mysqlTimestamp]);
        try {
            await smsclient.messages.create({
                body: `Your verification code is ${generatenumber}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: newMobilePhone
            });
            res.status(200).json({"status": "success", "message": "4 digit verification code has been sent to your mobile phone number"});
        } catch (error) {
            return (
                console.log(error),
                res.status(400).json({"status": "error", "message": "Failed to send SMS"})

            )
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.put('/updateprofile/mobilephone', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;
    const newMobilePhone = req.body.mob_phone;
    const secretcode = req.body.secretcode;

    try {
        const checkifExists = await dbclient.query('SELECT * FROM users WHERE mob_phone = $1', [req.body.mob_phone]);
        if (checkifExists.rows.length > 0) {
            return res.status(400).json({"status": "error", "message": "Mobile phone number already exists"});
        }
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const userid = user.rows[0].usid;
        if (user.rows[0].authmethod === 'local') {
        if (!password) {
            return res.status(400).json({"status": "error", "message": "Missing required fields"});
        }
        const passwordCheck = user.rows[0].passwd;
        const validPassword = await bcrypt.compare(password, passwordCheck);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        }}
        const code = await dbclient.query('SELECT secretcode FROM mobp_verification_tokens WHERE userid = $1', [userid]);
        if (code.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "Secret code not found or has expired"});
        }
        if (code.rows[0].secretcode !== secretcode) {
            return res.status(400).json({"status": "error", "message": "Invalid secret code"});
        }
        await dbclient.query('UPDATE users SET mob_phone = $1 WHERE email = $2', [newMobilePhone, req.user.email]);
        await dbclient.query('DELETE FROM mobp_verification_tokens WHERE userid = $1', [userid]);
        res.status(200).json({"status": "success", "message": "Your mobile phone number has been updated successfully"});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.post('/updateprofile/changepasscode', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;
    const mobile = req.body.mob_phone;
    if (!password) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        if (user.rows[0].authmethod === 'google' || user.rows[0].authmethod === 'facebook') {
            return res.status(403).json({"status": "error", "message": "You cannot update your password using this method"});
        }
        const userid = user.rows[0].usid;
        const passwordCheck = user.rows[0].passwd;
        const validPassword = await bcrypt.compare(password, passwordCheck);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid old password"});
        }
        //check if user has already requested for a verification code
        const checkifexistscode = await dbclient.query('SELECT * FROM pass_verification_tokens WHERE userid = $1', [userid]);
        if (checkifexistscode.rows.length > 0) {
            await dbclient.query('DELETE FROM pass_verification_tokens WHERE userid = $1', [userid]);
        }
        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const generatenumber = Math.floor(Math.random() * 9000) + 1000;
        await dbclient.query('INSERT INTO pass_verification_tokens (userid, secretcode, created_at) VALUES ($1, $2, $3)', [userid, generatenumber, mysqlTimestamp]);
        try {
            await smsclient.messages.create({
                body: `Your verification code is ${generatenumber}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: mobile
            });
            res.status(200).json({"status": "success", "message": "4 digit verification code has been sent to your mobile phone number"});
        } catch (error) {
            return res.status(400).json({"status": "error", "message": "Failed to send SMS"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});
router.put('/updateprofile/changepassword', bodyParser.json(), authenticateToken, async (req, res) => {
    const password = req.body.passwd;
    const newPassword = req.body.newpassword;
    const secretcode = req.body.secretcode;

    if (!password) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const userid = user.rows[0].usid;
        const passwordCheck = user.rows[0].passwd;
        const validPassword = await bcrypt.compare(password, passwordCheck);
        if (!validPassword) {
            return res.status(400).json({"status": "error", "message": "Invalid password"});
        }
        const code = await dbclient.query('SELECT secretcode FROM pass_verification_tokens WHERE userid = $1', [userid]);
        if (code.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "Secret code not found or has expired"});
        }
        if (code.rows[0].secretcode !== secretcode) {
            return res.status(400).json({"status": "error", "message": "Invalid secret code"});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await dbclient.query('UPDATE users SET passwd = $1 WHERE email = $2', [hashedPassword, req.user.email]);
        await dbclient.query('DELETE FROM pass_verification_tokens WHERE userid = $1', [userid]);
        res.status(200).json({"status": "success", "message": "Your password has been updated successfully"});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.get('/getprimaryaddress', authenticateToken, async (req, res) => {
    try {
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const userid = user.rows[0].usid;
        const address = await dbclient.query('SELECT * FROM useraddr WHERE userid = $1', [userid]);
        if (address.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "No address found"});
        }
        res.status(200).json({"status": "success", "message": "Address found", "data": address.rows[0]});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.get('/getsecondaryadddress', authenticateToken, async (req, res) => {
    try {
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
        const userid = user.rows[0].usid;
        const address = await dbclient.query('SELECT * FROM useraddrsecondary WHERE userid = $1', [userid]);
        if (address.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "No address found"});
        }
        res.status(200).json({"status": "success", "message": "Address found", "data": address.rows[0]});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.put('/updateprimaryaddress', bodyParser.json(), authenticateToken, async (req, res) => {
    const address = req.body.firstline;
    const secondline = req.body.secondline;
    const city = req.body.city;
    const postcode = req.body.postcode;
    const country = req.body.country;
    const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
    const userid = user.rows[0].usid;
    if (!address || !secondline || !city || !postcode || !country) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const checkifexists = await dbclient.query('SELECT * FROM useraddr WHERE userid = $1', [userid]);
        if (checkifexists.rows.length > 0) {
            await dbclient.query('UPDATE useraddr SET firstline = $1, secondline = $2, city = $3, postcode = $4, country = $5 WHERE userid = $6', [address, secondline, city, postcode, country, userid]);
            res.status(200).json({"status": "success", "message": "Address updated successfully"});
        } else {
            const uuid = uuidv4();

            await dbclient.query('INSERT INTO useraddr (addrid, userid, firstline, secondline, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6, $7)', [uuid, userid, address, secondline, city, postcode, country]);
            res.status(200).json({"status": "success", "message": "Address added successfully"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.put('/updatesecondaryaddress', bodyParser.json(), authenticateToken, async (req, res) => {
    const address = req.body.firstline;
    const secondline = req.body.secondline;
    const city = req.body.city;
    const postcode = req.body.postcode;
    const country = req.body.country;
    const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
    const userid = user.rows[0].usid;
    if (!address || !secondline || !city || !postcode || !country) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const checkifexists = await dbclient.query('SELECT * FROM useraddrsecondary WHERE userid = $1', [userid]);
        if (checkifexists.rows.length > 0) {
            await dbclient.query('UPDATE useraddrsecondary SET firstline = $1, secondline = $2, city = $3, postcode = $4, country = $5 WHERE userid = $6', [address, secondline, city, postcode, country, userid]);
            res.status(200).json({"status": "success", "message": "Address updated successfully"});
        } else {
            const uuid = uuidv4();
            await dbclient.query('INSERT INTO useraddrsecondary (addrid, userid, firstline, secondline, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6, $7)', [uuid, userid, address, secondline, city, postcode, country]);
            res.status(200).json({"status": "success", "message": "Address added successfully"});
        }
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

const forgotPasswordEmailText = (userFullName, token) => `                
<body style='background-color: #fff; font-family: "Roboto", sans-serif; font-size: 16px; line-height: 1.4; color: #000235;'>
<div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
<h1 style='margin-top: 20px;'>Forgot Password</h1>
</div>
<div style='padding: 20px;'>
<p>Dear ${userFullName},</p>
<p>We received a request to reset your password for your account at DoctorPhonez. Please click on the link below to reset your password:</p>
<p><div style='margin-top: 20px';> Hello, please click the link below to reset your password. <br> <a href='${CLIENT_URL}/account/recover/${token}'>Reset password</a><div></p>
<p>If you cannot click on the link, please copy and paste the following URL into your browser:</p>
<p>${CLIENT_URL}/account/recover/${token}</p>
<p>If you did not request a password reset for your account at DoctorPhonez, please disregard this email.</p>
</div>
<div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
<p style='margin-top: 20px;'>This email confirms that we have received your request to reset your password. Thank you for choosing DoctorPhonez!</p>
</div>
</body>`;

const sendPasswordRecoveryEmail = async (userEmail, userfullname, token) => {
    try {
      const transporter = await establishConnection();
      const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: userEmail,
        subject: "Recover password",
        html: forgotPasswordEmailText(userfullname, token)
      };
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }

// create a password reset token 
router.post('/forgotpassword', bodyParser.json(), async (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const user = await dbclient.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "No user found"});
        }
        // check if the user is under verification  
        if(user.rows[0].verified === false) {
            return res.status(403).json({"status": "error", "message": "Email already exists and is under verification"});
        }
        if((user.rows[0].authmethod === 'google') || (user.rows[0].authmethod === 'facebook')) {
            return res.status(403).json({"status": "error", "message": "You cannot reset your password using this method"});
        }
        // get the user full name
        const userfullname = user.rows[0].fullname 
        const usid = user.rows[0].usid;
        const tokens = generateToken(req.body.email);
        const emailToken = tokens.passwordResetToken;
        const uuid = uuidv4();
        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        // if token exists, update it, else create a new one
        const checkifexists = await dbclient.query('SELECT * FROM passwordrecovery WHERE user_id = $1', [usid]);
        if (checkifexists.rows.length > 0) {
            await dbclient.query('UPDATE passwordrecovery SET token = $1, created_at = $2 WHERE user_id = $3', [emailToken, mysqlTimestamp, usid]);
            sendPasswordRecoveryEmail(email, userfullname, emailToken)
            res.status(200).json({"status": "success", "message": "Password reset link sent successfully"});
            return;
        } else {
            await dbclient.query('INSERT INTO passwordrecovery (id, user_id, token, created_at) VALUES ($1, $2, $3, $4)', [uuid, usid, emailToken, mysqlTimestamp]);
            sendPasswordRecoveryEmail(email, userfullname, emailToken)
            res.status(200).json({"status": "success", "message": "Password reset link sent successfully"});
            return;
        }

    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.put('/forgotpassword/:token', bodyParser.json(), async (req, res) => {
    const token = req.params.token;
    const passwd = req.body.passwd;
    if (!token) {
        return res.status(400).json({"status": "error", "message": "Missing required fields"});
    }
    try {
        const checkifexists = await dbclient.query('SELECT * FROM passwordrecovery WHERE token = $1', [token]);
        if (checkifexists.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "Invalid token"});
        }
        const userid = checkifexists.rows[0].user_id;
        const user = await dbclient.query('SELECT * FROM users WHERE usid = $1', [userid]);
        if (user.rows.length < 1) {
            return res.status(404).json({"status": "error", "message": "No user found"});
        }

        const hashedPassword = await bcrypt.hash(passwd, 10);
        await dbclient.query('UPDATE users SET passwd = $1 WHERE usid = $2', [hashedPassword, userid]);
        await dbclient.query('DELETE FROM passwordrecovery WHERE token = $1', [token]);
        res.status(200).json({"status": "success", "message": "Password updated successfully"});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});



module.exports = router;

