var dataStore;

function drag(ev) {
    console.log(ev);
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("text", ev.target.id);
}

function dragEnter(ev) {
    ev.preventDefault();
    return true;
}

function dragOver(ev) {
    ev.preventDefault();
}

function dragDrop(ev) {
    var data = ev.dataTransfer.getData("Text");
    var elem = $('#rightSection .row');
    var oldColor = $('#'+data+' .dg').attr('class').split(/\s+/)[1],color;
    $('#' + data+' .dg').removeClass(oldColor);
    oldColor = oldColor.split('-').slice(0, -1);
    oldColor.push('100');
    color = oldColor.join('-');
    elem.append($('#' + data));
    $('#' + data).removeClass('col-md-6').addClass('col-md-12');
    $('#' + data+' .dg').addClass(color);
    ev.stopPropagation();
    
    n = $('#'+data+' .dg p').text();
    dataStore.setItem('he:'+data, 'done:'+data+':'+color+':'+n);
    return false;
}

function discard(id) {
    console.log(id);
    $('#'+id).remove();
    dataStore.removeItem('he:'+id);
}

function randomColor(argument) {
    var colors = ['btn-material-red-300',
        'btn-material-pink-300',
        'btn-material-purple-300',
        'btn-material-deep-purple-300',
        'btn-material-indigo-300',
        'btn-material-blue-300',
        'btn-material-light-blue-300',
        'btn-material-cyan-300',
        'btn-material-teal-300',
        'btn-material-green-300',
        'btn-material-light-green-300',
        'btn-material-lime-300',
        'btn-material-yellow-300',
        'btn-material-amber-300',
        'btn-material-orange-300',
        'btn-material-deep-orange-300',
        'btn-material-brown-300',
        'btn-material-grey-300',
        'btn-material-blue-grey-300'
    ];
    return colors[Math.round(Math.random()*colors.length)];
}

function buildDom (arg, size) {
    return '<div class="col-md-'+size+'" id="' + arg[0] + '" draggable="true" ondragstart="drag(event)">' +
        '<div class="dg '+arg[1]+'" >' +
        '<p>' + arg[2] + '</p>' +
        '<span class="close" onclick="discard('+arg[0]+')"> x </span>' +
        '</div>' +
        '</div>';
}

function add_todo() {
    var n = $('.modal-body input').val(),
    timeNow = Date.now(),
    color = randomColor();
    var domString = buildDom([timeNow, color, n], 6);
    $('#leftSection .row').append(domString);
    $('.modal-body input').val('');
    dataStore.setItem('he:'+timeNow, 'todo:'+timeNow+':'+color+':'+n);
}

function rebuildCards(todo, done) {
    todo.forEach(function(t) {
        console.log(t);
        $('#leftSection .row').append(buildDom(t, 6));
    });
    done.forEach(function(d) {
        $('#rightSection .row').append(buildDom(d, 12));
    });    
}

function fetchFromStorage () {
    var todo= [], done = [];
    for(var i=0, len=localStorage.length; i<len; i++) {
        var key = localStorage.key(i);
        var value = localStorage[key];
        if(key.indexOf('he:')>-1) {
            if (value.indexOf('todo:') > -1) {
                todo.push(value.split(':').slice(1));
            }
            if (value.indexOf('done:') > -1) {
                console.log(value);
                done.push(value.split(':').slice(1));
            }
        }
    }
    rebuildCards(todo, done);
}

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return false;
    }
}

if (storageAvailable('localStorage')) {
    console.log('localStorage available');
    dataStore = localStorage;
    fetchFromStorage();
}
else if (storageAvailable('sessionStorage')) {
    console.log('sessionStorage only available');
    dataStore = localStorage;
    fetchFromStorage();
}
$(function() {
    $('#clearall').click(function() {
        $('#rightSection .row').empty();
        for(var i=0, len=localStorage.length; i<len; i++) {
            var key = localStorage.key(i);
            var value = localStorage[key];
            if(key.indexOf('he:')>-1) {
                if (value.indexOf('done:') > -1) {
                    dataStore.removeItem(key);
                }
            }
        }
    });   
});