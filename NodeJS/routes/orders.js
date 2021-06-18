const router = require('express').Router();
const verify = require('./verifyToken');
const { orderValidation } = require('../validation')
const ObjectId = require('mongoose').Types.ObjectId;

var User = require('../models/User');

router.get('/', verify, (req, res) => {
    User.findById(req.query.user_id, (err, docs) => {
        if (!err)
            res.send(docs.orders);
        else
            res.status(400).send('Error in retrieving orders: ' + JSON.stringify(err, undefined, 2));
    });
});

router.post('/', verify, async (req, res) => {
    const { error } = orderValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const order = {
        content: req.body.content,
        amount: req.body.amount,
    };

    const user = await User.findById(req.query.user_id);

    user.orders.push(order);
    await user.save();

    res.status(201).json(order);
});

router.put('/:id', verify, async (req, res) => {
    const { error } = orderValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);

    const user = await User.findById(req.query.user_id);

    const orderIndex = user.orders.findIndex((order => order._id == req.params.id));

    user.orders[orderIndex].content = req.body.content;
    user.orders[orderIndex].amount = req.body.amount;

    await user.save();

    res.status(201).json(user.orders[orderIndex]);
});

router.delete('/:id', verify, async (req, res) => {
    const user = await User.findById(req.query.user_id);

    user.orders = user.orders.filter(order => {
        return order._id != req.params.id;
    });

    await user.save();

    res.status(200).json({});
});

module.exports = router;