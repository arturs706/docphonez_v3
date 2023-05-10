const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');


router.post('/contactus', bodyParser.json(), async (req, res) => {
    const { fullname, email, message } = req.body;
    if (fullname === "" || email === "" || message === "") {
        res.status(400).json({ error: 'Please fill in all fields' });
        return;
    }

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
      const sendEmail = async (fullname) => {
        try {
          const transporter = await establishConnection();
          const mailOptions = {
            from: process.env.SMTP_USERNAME,
            to: "aradionovs@yahoo.com",
            subject: "Enquiry from " + fullname + "",
            
            text: "Enquiry from " + fullname+ " with email " + email + " and message " + message + ""
            
          };
          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully");
        } catch (error) {
          console.error("Error sending email:", error);
          throw new Error("Failed to send email");
        }
      }
        sendEmail(fullname);  
        res.status(200).json({ status: 'success', message: 'Email sent successfully' });
        return;
});


module.exports = router;