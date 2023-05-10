const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const client = require('../db/conn')
const router = express.Router();
const authenticateToken = require('../middleware/authz')

router.post('/status', bodyParser.json(), authenticateToken, async (req, res) => {
    const { orderid } = req.body;
    const checkUserForOrder = await client.query('SELECT useremail FROM userorders WHERE orderid = $1', [orderid]);
    const userEmail = req.user.email;
    // check if the user is the owner of the order
    const isUser = checkUserForOrder.rows[0].useremail === userEmail;
    // check if the user is an admin
    const isAdmin = req.user.role === 'admin';
    // if the user is not the owner of the order and not an admin, return unauthorized
    if (!isUser && !isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const result = await client.query('SELECT orderid, status, firstline, secondline, city, postcode, tracking_number, postage_time, planned_delivery_time, last_update FROM shippingaddress WHERE orderid = $1', [orderid]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;