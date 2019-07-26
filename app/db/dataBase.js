'use strict';

import { createConnection } from 'mysql';

var config = require('../../config.json');

var connection = createConnection(config.db);

connection.connect((err) => {
    if (err) throw err;
});

module.exports = connection;