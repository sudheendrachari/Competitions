'use strict';
const express = require('express');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const request = require('request-promise');
const createPdf = require('./pdf');

var app = express();
var bookmarks = {};
var API_ENDPOINT = 'https://letsventure.0x10.info/api/dictionary.php?type=json&query=';
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res) {
    var temp = 'Favourites :', f=[];
    for (var i in bookmarks) {
        if (bookmarks.hasOwnProperty(i)) {
            f.push(i);
        }
    }
    res.send(temp+f.join(', '));
});

app.get('/fetchData/:alphabet', function(req, res) {
    let alphabet = req.params.alphabet;
    let uri = API_ENDPOINT + alphabet;
    console.log(uri);
    request(uri).then(function(response) {
        res.send(response);
    }, function(error) {
        console.error(error);
        res.send(error);
    });
});


app.get('/fetchBookmarks', function(req, res) {
    res.send(bookmarks);
});

app.get('/saveBookmark', function(req, res) {
    let word = req.query.word;
    let desc = req.query.desc;
    if (bookmarks[word]) {
    	delete bookmarks[word];
    	console.log('deleting');
        res.send('Deleted Entry: ' + word);
    } else {
        bookmarks[word] = desc;
        console.log('Bookmarks size:', Object.keys(bookmarks).length);
        res.send('Bookmark saved: ' + word);
    }

});

app.get('/clearBookmarks', function(req, res) {
    bookmarks = {};
    console.log('Bookmarks cleared');
    res.send('Bookmarks cleared');
});

app.get('/downloadBookmarks', function(req, res) {
    let filePath = createPdf(bookmarks),
        filename = path.basename(filePath),
        mimetype = mime.lookup(filePath);
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
    let filestream = fs.createReadStream(filePath);
    filestream.pipe(res);
});




app.listen(8080);
