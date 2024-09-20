const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Product = require('../models/Product');

// @route    POST api/products
// @desc     Create a product
// @access   Private
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('price', 'Price is required').isNumeric(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, price, imageUrl } = req.body;

        try {
            const newProduct = new Product({
                name,
                description,
                price,
                imageUrl,
            });

            const product = await newProduct.save();
            res.json(product);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route    GET api/products
// @desc     Get all products
// @access   Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    GET api/products/:id
// @desc     Get product by ID
// @access   Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/products/:id
// @desc     Update a product
// @access   Private
router.put('/:id', async (req, res) => {
    const { name, description, price, imageUrl } = req.body;

    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (price) productFields.price = price;
    if (imageUrl) productFields.imageUrl = imageUrl;

    try {
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Product not found' });

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    DELETE api/products/:id
// @desc     Delete a product
// @access   Private
router.delete('/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        await Product.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
