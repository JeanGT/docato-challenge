const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { loginValidation } = require('../validation');
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email })
    if (!user)
        return res.status(400).send('Invalid email');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
        return res.status(400).send('Invalid password');

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.status(200).json({token, user_id: user._id});
});

router.get('/me', (req, res) => {
    const token = req.header('auth-token');
    if (!token) return res.status(403).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        User.findById(verified._id, (err, doc) => {
            if (!err)
                res.send(doc)
            else
                res.status(400).send('Error in retrieving user: ' + JSON.stringify(err, undefined, 2));
        });
    } catch (err) {
        res.status(403).send('Invalid Token')
    }
});

module.exports = router;