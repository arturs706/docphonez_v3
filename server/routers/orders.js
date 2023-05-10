const client = require('../db/conn')
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const authenticateToken = require('../middleware/authz')



const RETRIEVE_ORDERS = 
`SELECT userorders.orderid, userorders.userid, userorders.useremail, userorders.totalcost, userorders.receiptlink, userorders.paymentmeth, userorders.cardendnr,userorders.delivered, shippingaddress.tracking_number, shippingaddress.postage_time, shippingaddress.planned_delivery_time  
FROM userorders
INNER JOIN shippingaddress 
ON userorders.orderid  = shippingaddress.orderid WHERE userorders.userid  = $1;`

const RETRIEVE_ORDER_ITEMS = `SELECT productname, quantity, price, color, memory, imageurl FROM orderitems WHERE orderid = $1;`

router.get('/orders',bodyParser.json(), authenticateToken, async (req, res) => {
    //get a user from the header
    // console.log(req.rawHeaders);
    const index = req.rawHeaders.indexOf('usid');
    // get the value of index + 1
    const usid = req.rawHeaders[index + 1];
    try {
        const userorders = await client.query(RETRIEVE_ORDERS, [usid]);
        const orders = userorders.rows.map(async (order) => {
            const orderitems = await client.query(RETRIEVE_ORDER_ITEMS, [order.orderid]);
            return {
                ...order,
                items: orderitems.rows
            };
        });
        const ordersWithItems = await Promise.all(orders);
        res.status(200).json({ orders: ordersWithItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
const RETRIEVE_ALLUSER_ORDERS = `SELECT * from userorders;`

router.get('/allorders', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const userorders = await client.query(RETRIEVE_ALLUSER_ORDERS);
        const orders = userorders.rows.map(async (order) => {
            const orderitems = await client.query(RETRIEVE_ORDER_ITEMS, [order.orderid]);
            return {
                ...order,
                items: orderitems.rows
            };
        });
        const ordersWithItems = await Promise.all(orders);
        res.status(200).json({ orders: ordersWithItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.get('/allsales', bodyParser.json(), authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const allsales = await client.query('SELECT sales_report.productid, products.prodname,productspecs.color, productspecs.memory, products.price, sales_report.sales_count, products.availableqty, (sales_report.sales_count * CAST(products.price AS NUMERIC)) AS total_income, productimages.imageone FROM sales_report INNER JOIN products ON sales_report.productid = products.productid INNER JOIN productspecs ON productspecs.productmodel = products.modelnr INNER JOIN productimages ON productimages.productmodel = products.modelnr');
        res.status(200).json({ allsales: allsales.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.get('/allsalessum', bodyParser.json(), authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const allsales = await client.query('SELECT SUM(sales_report.sales_count * CAST(products.price AS NUMERIC)) as total_sales_income FROM sales_report INNER JOIN products ON sales_report.productid = products.productid;');
        res.status(200).json({ allsales: allsales.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});




module.exports = router;