const router = require('express').Router();
const verify = require('./verifyToken');
const { registerValidation } = require('../validation');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs')

var User = require('../models/User');

router.get('/', verify, async (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const count = await User.estimatedDocumentCount();

    User.find((err, docs) => {
        if (!err)
            res.send({
                users: docs,
                meta: {
                    totalItems: count,
                    itemsPerPage: limit,
                }
            });
        else
            res.status(400).send('Error in retrieving users: ' + JSON.stringify(err, undefined, 2));
    }).limit(limit).skip((page - 1) * limit);
});

router.get('/:id', verify, (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);
    User.findById(req.params.id, (err, doc) => {
        if (!err)
            res.send(doc)
        else
            res.status(400).send('Error in retrieving user: ' + JSON.stringify(err, undefined, 2));
    })
});

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist)
        return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put('/:id', verify, (req, res) => {
    const { error } = registerValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);

    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };

    User.findByIdAndUpdate(req.params.id, { $set: user }, { new: true }, (err, doc) => {
        if (!err)
            res.send(doc)
        else
            res.status(400).send('Error in users update: ' + JSON.stringify(err, undefined, 2));
    });
});

router.delete('/:id', verify, (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);

    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err)
            res.send(doc)
        else
            res.status(400).send('Error in users delete: ' + JSON.stringify(err, undefined, 2));
    });
});

router.post('/filter', verify, (req, res) => {
    User.find({ "email": { $regex: '.*' + req.body.email + '.*' } },
        (err, docs) => {
            if (!err)
                res.send({
                    users: docs,
                    meta: {
                        totalItems: 0,
                        itemsPerPage: 0, //TODO filter pagination
                    }
                });
            else
                res.status(400).send('Error in retrieving users: ' + JSON.stringify(err, undefined, 2));
        });
});

module.exports = router;