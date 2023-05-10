const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


router.post('/create-payment-intent', bodyParser.json(), async (req, res) => {
  const { amount, email, fullname, phone, addtometadata, usid, address, discountAmount } = req.body;
  const roundedAmount = Math.round(amount * 100);

  const customercreated = await stripe.customers.create({
    email: email,
    name: fullname,
    phone: phone,
    address: {
      line1: address.firstline,
      secondLine: address.secondline,
      city: address.city,
      postcode: address.postcode,
      country: address.country
    },
  });

  // const cartString = JSON.stringify(cart);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: roundedAmount,
    currency: 'GBP',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {fullname: fullname, customeremail: email , orderdet: addtometadata, userid: usid, address: address, discountAmount: discountAmount},
    customer: customercreated.id,
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});





module.exports = router;

