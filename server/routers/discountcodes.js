const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const client = require('../db/conn')
const authenticateToken = require('../middleware/authz')
const { v4: uuidv4 } = require('uuid');
var moment = require('moment');


const discountEmailText = (userFullName, discountCode, discountAmount, validUntil) => `
<body style='background-color: #fff; font-family: "Roboto", sans-serif; font-size: 16px; line-height: 1.4; color: #000235;'>
  <div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
    <h1 style='margin-top: 20px;'>Special Discount for ${userFullName}</h1>
  </div>
  <div style='padding: 20px;'>
    <p>Dear ${userFullName},</p>
    <p>We're excited to offer you a special discount on your next purchase at our store. Use the following code to get ${discountAmount}% off your order:</p>
    <h2 style='margin-top: 20px; text-align: center; font-weight: bold;'>${discountCode}</h2>
    <p>This code is valid until ${validUntil}. Don't miss out on this great opportunity to save on your favorite products!</p>
    <p>If you have any questions or concerns, please don't hesitate to contact us at info@doctorphonez.co.uk.</p>
  </div>
  <div style='background-color: #000235; padding: 20px; color: #fff; text-align: center;'>
    <p style='margin-top: 20px;'>Thank you for choosing Doctorphonez Ealing!</p>
  </div>
</body>`;



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

  const sendDiscountEmail = async (userEmail, userfullnameArg, discountCodeArg, discountAmountArg, validUntilArg) => {
    try {
      const transporter = await establishConnection();
      const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: userEmail,
        subject: "Special Discount for You",
        html: discountEmailText(userfullnameArg, discountCodeArg, discountAmountArg, validUntilArg)
      };
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }



  router.post('/add', bodyParser.json(), authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ status: "error", error: "Unauthorized" });
    }
    if (req.body.code === "" || req.body.discount === "" || req.body.expiry === "") {
        return res.status(400).json({ status: "error", error: "Please fill in all fields" });
    }
    const { code, discount, expiry } = req.body;
    const SELECT_DISCOUNTCODE = `SELECT * FROM discount_codes WHERE code = $1`;
    const { rows } = await client.query(SELECT_DISCOUNTCODE, [req.body.code]);
    if (rows.length > 0) {
        return res.status(400).json({ status: "error", error: "Discount code already exists" });
    }
    const discountid = uuidv4();
    const mysqlTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const timemoment = moment(expiry).format('dddd MMMM DD HH:mm:ss YYYY');
    const discountPercentage = discount / 100;
    const INSERT_DISCOUNTCODE = `INSERT INTO discount_codes (id, code, discount, expiration_date, created_at, updated_at) VALUES ($1, $2, $3, to_timestamp($4, 'Day Month DD HH24:MI:SS YYYY'), $5, $6)`;
    try {
        await client.query(INSERT_DISCOUNTCODE, [discountid, code, discountPercentage, timemoment, mysqlTimestamp, mysqlTimestamp]);
        res.status(200).json({ status: "success", message: 'Discount code added successfully' });
        // get all users emails, names and send them emails with discount codes and expiry dates
        const SELECT_ALL_USERS = `SELECT email, fullname, email_ver FROM users`;
        const { rows } = await client.query(SELECT_ALL_USERS);
        rows.forEach(async (user) => {
            if (user.email_ver) {
            try {
                await sendDiscountEmail(user.email, user.fullname, code, discount, timemoment);
            } catch (error) {
                console.error(error);
                res.status(500).json({ status: "error", error: error });
            }} else {
                console.log(`User ${user.fullname} has not verified their email address. No email sent.`);
            }
        }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: error });
    }
});

router.get('/all', bodyParser.json(), authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ status: "error", error: "Unauthorized" });
    }
    const SELECT_ALL_DISCOUNTCODES = `SELECT * FROM discount_codes`;
    try {
        const { rows } = await client.query(SELECT_ALL_DISCOUNTCODES);
        res.status(200).json({ status: "success", data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: error });
    }
});


router.delete('/delete', bodyParser.json(), authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ status: "error", error: "Unauthorized" });
    }
    if (req.body.id === "") {
        return res.status(400).json({ status: "error", error: "Please fill in all fields" });
    }
    const { id } = req.body;
    const DELETE_DISCOUNTCODE = `DELETE FROM discount_codes WHERE id = $1`;
    try {
        await client.query(DELETE_DISCOUNTCODE, [id]);
        res.status(200).json({ status: "success", message: 'Discount code deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: error });
    }
});

router.put('/update', bodyParser.json(), authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ status: "error", error: "Unauthorized" });
    }
    if (req.body.id === "" || req.body.code === "" || req.body.discount === "" || req.body.expiry === "") {
        return res.status(400).json({ status: "error", error: "Please fill in all fields" });
    }
    const { id, code, discount, expiry } = req.body;
    const UPDATE_DISCOUNTCODE = `UPDATE discount_codes SET code = $1, discount = $2, expiration_date = to_timestamp($3, 'Day Month DD HH24:MI:SS YYYY'), updated_at = $4 WHERE id = $5`;
    const mysqlTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const discountPercentage = discount / 100;
    try {
        await client.query(UPDATE_DISCOUNTCODE, [code, discountPercentage, expiry, mysqlTimestamp, id]);
        res.status(200).json({ status: "success", message: 'Discount code updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: error });
    }
});

// apply discount code to cart
router.post('/apply', bodyParser.json(), authenticateToken, async (req, res) => {
    if (req.body.code === "") {
        return res.status(400).json({ status: "error", error: "Please fill in all fields" });
    }
    if (req.user.email === "") {
        return res.status(400).json({ status: "error", error: "Please login" });
    }
    
    const { discountcode } = req.body;
    const SELECT_DISCOUNTCODE = `SELECT * FROM discount_codes WHERE code = $1`;
    try {
        const { rows } = await client.query(SELECT_DISCOUNTCODE, [discountcode]);
        if (rows.length === 0) {
            return res.status(400).json({ status: "error", error: "Discount code does not exist" });
        } else {
            const discount = rows[0].discount;
            res.status(200).json({ status: "success", discount: discount });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: error });
    }
});



module.exports = router;