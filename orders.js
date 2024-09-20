const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route    POST api/orders
// @desc     Create an order
// @access   Private
router.post(
    '/',
    [auth, [check('products', 'Products are required').isArray()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { products } = req.body;

        try {
            let totalPrice = 0;

            for (let item of products) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json({ msg: `Product ${item.product} not found` });
                }
                totalPrice += product.price * item.quantity;
            }

            const newOrder = new Order({
                user: req.user.id,
                products,
                totalPrice,
            });

            const order = await newOrder.save();
            res.json(order);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route    GET api/orders
// @desc     Get all orders
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('products.product', ['name', 'price']);
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/orders/:id
// @desc     Update order status
// @access   Private (Admin)
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;

    try {
        let order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ msg: 'Order not found' });

        order.status = status;

        await order.save();

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
