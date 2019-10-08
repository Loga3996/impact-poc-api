"use strict";

import express from 'express';
import { createConnection } from 'mysql';

var config = require('./config.json');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

var myConnection = createConnection(config.db);

myConnection.connect((err) => {
    if (err) throw err;
});

app.listen(config.port);

app.use(cors({
    origin: ['http://localhost:4200','http://localhost:4100'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(`/cart-orders`, require('./app/apis/impact-api'));
