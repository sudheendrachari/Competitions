var express = require('express');
var todoApp = express();
var path = require('path');

todoApp.listen(8090, function(arg) {
	console.log('Mission started');
});

todoApp.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

var todoItems = {
    'hi': true,
    'hello': false
};

todoApp.get('/fetch_todo', function(req, res) {
    res.json(todoItems);
});

todoApp.get('/add_todo/:todo', function(req, res) {

    var item = req.params.todo;
    var found = todoItems.hasOwnProperty(item);
    if (!found) {
        todoItems[item] = false;
    }
    res.send('Added: '+item);
});

todoApp.get('/toggle/:todo', function(req, res) {
    var item = req.params.todo;
    var found = todoItems.hasOwnProperty(item);
    if (found) {
        todoItems[item] = !todoItems[item];
    }
    res.send(item+' toggled');
});

todoApp.get('/update/:oldtext/:newtext', function(req, res) {
    var oldtext = req.params.oldtext,
        newtext = req.params.newtext,
        found = todoItems.hasOwnProperty(oldtext);
    if (found) {
    	todoItems[newtext] = todoItems[oldtext];
    	delete todoItems[oldtext];
    }
    res.send('Modified '+oldtext+' as '+newtext);
});


