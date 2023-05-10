require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Stripe = require('stripe');
const client = require('../db/conn');
var moment = require('moment'); 


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;



let data;
let eventType;

const orderConfirmationTemplate = (customer_name, total, items, trackingnumber, deliveryDateDiffformt) => `
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>DoctorPhonez Order Confirmation</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
  </head>
  <body style="background-color: #fff; font-family: 'Roboto', sans-serif; font-size: 16px; line-height: 1.4; color: #000235;">
    <div style="background-color: #000235; padding: 20px; color: #fff; text-align: center;">
      <h1 style="margin-top: 20px;">DoctorPhonez</h1>
    </div>
    <div style="padding: 20px;">
      <p>Dear ${customer_name},</p>
      <p>Thank you for your order! We are pleased to confirm that your order has been received and is being processed. Your order details are as follows:</p>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead style="background-color: #000235; color: #fff;">
          <tr>
            <th style="padding: 10px; text-align: left;">Photo</th>
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr style="border-bottom: 1px solid #ccc;">
              <td style="padding: 10px;"><img src="${item.image_url}" alt="${item.product_name}" style="max-width: 100px;"></td>
              <td style="padding: 10px;">${item.product_name}</td>
              <td style="padding: 10px;">${item.quantity}</td>
              <td style="padding: 10px;">£${item.price}</td>
            </tr>
          `).join('')}
          <tr>
            <td style="padding: 10px;"></td>
            <td style="padding: 10px;"></td>
            <td style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 10px;"><strong>£${total}</strong></td>
          </tr>
        </tbody>
      </table>
      <p>We will send you another email once your order has been shipped. Your tracking number is ${trackingnumber}. Your estimated delivery date is ${deliveryDateDiffformt}. If you have any questions or concerns, please don't hesitate to contact us at support@doctorphonez.co.uk.</p>
    </div>
    <div style="background-color: #000235; padding: 20px; color: #fff; text-align: center;">
      <p style="margin-top: 20px;">This email confirms that your order has been received and processed. Thank you for shopping at DoctorPhonez!</p>
    </div>
  </body>
</html>`




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

const sendEmail = async (customerEmail, customerName, total, items, trackingnumber, deliveryDateDiffformt) => {
  try {
    const transporter = await establishConnection();
    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: customerEmail,
      subject: "Order Confirmation",
      html: orderConfirmationTemplate(customerName, total, items, trackingnumber, deliveryDateDiffformt)
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
  

router.post('/send-email', async (req, res) => {
    try {
await sendEmail();
res.status(200).json({ message: 'Email sent successfully' });
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Failed to send email' });
}
});

router.post("/webhooks", express.raw({ type: "application/json" }), async(request, response) => {
const sig = request.headers["stripe-signature"];
// stripe
let event;
try {
  event = stripe.webhooks.constructEvent(request.body, sig, webhookSecret);
} catch (err) {
  response.status(400).send(`Webhook Error: ${err.message}`);
  return;
}
// Handle the event
switch (event.type) {
  case "charge.succeeded":
  const session = event.data.object;

  const parseAddress = JSON.parse(session.metadata.address);
  const discount = JSON.parse(session.metadata.discountAmount);
  //check the data type of session.payment_intent
    const parseJSON = JSON.parse(session.metadata.orderdet)
    //create a new array to store the product names along with the quantities
    const products = [];
    //retrieve all product names from SQL database using the modelnr, and then add it to the parseJSON array
    for (let i = 0; i < parseJSON.length; i++) {
      const item = parseJSON[i];
      //retrieve the product name and price from the database
      const product = await client.query(`SELECT 
      products.prodname, 
      products.price, 
      productimages.imageone,
      productspecs.color,
      productspecs.memory
  FROM 
      products 
      INNER JOIN productimages ON products.modelnr = productimages.productmodel 
      INNER JOIN productspecs ON products.modelnr = productspecs.productmodel
  WHERE 
      products.modelnr = '${item.modelnr}'`);
      //add the product name, price and imagetwo to the products array along with the quantity
      products.push({
        image_url: product.rows[0].imageone,
        product_name: product.rows[0].prodname,
        quantity: item.quantity,
        price: (product.rows[0].price * (1 - discount)).toFixed(2),
        color: product.rows[0].color,
        memory: product.rows[0].memory
      });
    }
    
    
    
    //insert into the the userorders table the payment id, the user id and the total amount
    if (session.payment_method_details.type === "card" && session.payment_method_details.card.wallet === null){
    //convert session.payment_method_details.card.last4 to a string to be able to insert it into the database
    const last4 = session.payment_method_details.card.last4.toString();
    client.query(`insert into userorders VALUES ('${session.payment_intent}', '${session.metadata.userid}', '${session.metadata.customeremail}', '${session.amount/100}', '${session.receipt_url}', '${session.payment_method_details.card.brand}', '${last4}')`);
    } else if (session.payment_method_details.type === "card" && session.payment_method_details.card.wallet !== null) {
      const last4 = session.payment_method_details.card.last4.toString();
      client.query(`insert into userorders VALUES ('${session.payment_intent}', '${session.metadata.userid}', '${session.metadata.customeremail}', '${session.amount/100}', '${session.receipt_url}', '${session.payment_method_details.card.wallet.type}', '${last4}')`);
    }
    else if (session.payment_method_details.type === "klarna") {
      client.query(`insert into userorders VALUES ('${session.payment_intent}', '${session.metadata.userid}', '${session.metadata.customeremail}', '${session.amount/100}', '${session.receipt_url}', '${session.payment_method_details.type}', '${session.payment_method_details.klarna.payment_method_category}')`);}
      for (let i = 0; i < products.length; i++) {
        const item = products[i];
        const itemPriceString = item.price.toString();
        const itemMemory = item.memory.toString();
        client.query(`INSERT INTO orderitems (orderid, productname, quantity, price, color, memory, imageurl) 
                      VALUES('${session.payment_intent}', '${item.product_name}', '${item.quantity}', '${itemPriceString}', '${item.color}', '${itemMemory}', '${item.image_url}')`);
      }
    const prefix = 'GBDEL';
    const randomChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let trackingNumber = prefix;
    // Generate 11 random characters
    for (let i = 0; i < 11; i++) {
      trackingNumber += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    //check if the tracking number already exists in the database
    const checkTrackingNumber = await client.query(`SELECT * FROM shippingaddress WHERE tracking_number = '${trackingNumber}'`);
    //if the tracking number already exists, generate a new one
    if (checkTrackingNumber.rows.length > 0) {
      trackingNumber = prefix;
      for (let i = 0; i < 11; i++) {
        trackingNumber += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
    }
    let deldate;
    
    // Insert moment + 5 days into the database
    const deliveryDate = moment().add(121, 'hours').format('YYYY-MM-DD HH:mm:ss');
    //check the time of the delivery date
    const deliveryTime = moment().add(121, 'hours').format('HH:mm:ss');
    console.log(deliveryTime);
    // check if deliveryTime is after 6PM
    
    const deliveryMoment = moment(deliveryTime, 'HH:mm:ss');
    const sixPM = moment().set('hour', 18).set('minute', 0).set('second', 0);
    if (deliveryMoment.isAfter(sixPM)) {
    console.log(deliveryMoment);
    console.log(sixPM);
    const diffinSeconds = deliveryMoment.diff(sixPM, 'seconds');
    console.log(diffinSeconds);

    const nextDate = deliveryMoment.startOf('day').add(1, 'day').set('hour', 9).set('minute', 0).set('second', 0);
    const deliveryDate = nextDate.add(5, 'days');
    deldate = deliveryDate.add(diffinSeconds, 'seconds');

    } else {
    const deliveryDate = moment().add(121, 'hours').format('YYYY-MM-DD HH:mm:ss');
    deldate = deliveryDate;
    }
    
    // if the delivery time is after 6PM, subtract hour difference from 6PM
    // extract the date of the delivery date variable deldate in format DD-MM-YYYY
    const deliveryDateDiffformt = moment(deldate).format('DD-MM-YYYY');

    client.query(`insert into shippingaddress(orderid, firstline, secondline, city, postcode, tracking_number, planned_delivery_time, status) VALUES ('${session.payment_intent}', '${parseAddress.firstline}', '${parseAddress.secondline}', '${parseAddress.city}', '${parseAddress.postcode}', '${trackingNumber}', '${deldate}', 'Pending')`);
    sendEmail(session.metadata.customeremail, session.metadata.fullname, session.amount/100, products, trackingNumber, deliveryDateDiffformt);
    break;
  default:
    console.log(`Unhandled event type ${event.type}`);
}
// Return a 200 response to acknowledge receipt of the event
response.send();
});

module.exports = router;





