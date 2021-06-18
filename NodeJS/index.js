const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const orderRoute = require('./routes/orders');

const app = express();

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('Connected to db!')
);

//Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

//Route Middlewares
app.use('/', authRoute);
app.use('/user', userRoute);
app.use('/order', orderRoute);

app.listen(3000, () => console.log("Server up and running"));