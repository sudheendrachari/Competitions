'use strict';
const express = require('express');
const path = require('path');
var app = express();
app.use(express.static(__dirname));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});



app.listen(80);
