const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const client = require('../db/conn');
const authenticateToken = require('../middleware/authz');
const { v4: uuidv4 } = require('uuid');

const FETCH_FAVOURITE_ITEMS =     
`SELECT products.productid, products.prodname, products.price, productimages.imagetwo, favourites.userid, productspecs.memory, productspecs.color, products.brand, products.category
FROM products
INNER JOIN productimages 
ON products.modelnr  = productimages.productmodel
INNER JOIN productspecs
ON products.modelnr = productspecs.productmodel
INNER JOIN favourites
ON favourites.productid = products.productid
where favourites.userid = $1`

router.get('/:userid', bodyParser.json(), authenticateToken, async (req, res) => {
    const userid = req.params.userid;
    try {
        const favouriteitems = await client.query(FETCH_FAVOURITE_ITEMS, [userid]);
        if (favouriteitems.rows.length === 0) {
            res.status(200).json({ message: 'No favourite items found', "status": "success" });
            return;
        }
        res.status(200).json({ favouriteitems: favouriteitems.rows, "status": "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

const FETCH_ALL_FAVOURITE_ITEMS =     
`SELECT products.productid, products.prodname, products.price, productimages.imagetwo
FROM products
INNER JOIN productimages 
ON products.modelnr  = productimages.productmodel
INNER JOIN productspecs
ON products.modelnr = productspecs.productmodel
INNER JOIN favourites
ON favourites.productid = products.productid
`

router.post('/', bodyParser.json(), authenticateToken, async (req, res) => {
    try {
        const favouriteitems = await client.query(FETCH_ALL_FAVOURITE_ITEMS);
        if (favouriteitems.rows.length === 0) {
            res.status(200).json({ message: 'No favourite items found', "status": "success" });
            return;
        }
        res.status(200).json({ favouriteitems: favouriteitems.rows, "status": "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});



const ADD_TO_FAVOURITES = `INSERT INTO favourites (favid, userid, productid) VALUES ($1, $2, $3)`;

router.post('/addtofavourites', authenticateToken, bodyParser.json(), async (req, res) => {
    const uuid = uuidv4();
    const userid = req.body.userid;
    const productid = req.body.productid;
    try {
        await client.query(ADD_TO_FAVOURITES, [uuid, userid, productid]);
        res.status(200).json({ message: 'Product added to favourites', "status": "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

const REMOVE_FROM_FAVOURITES = `DELETE FROM favourites WHERE userid = $1 AND productid = $2`;

router.delete('/removefromfavourites', bodyParser.json(), async (req, res) => {
    const userid = req.body.userid;
    const productid = req.body.productid;
    try {
        
        await client.query(REMOVE_FROM_FAVOURITES, [userid, productid]);
        res.status(200).json({ message: 'Product removed from favourites', "status": "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


module.exports = router;