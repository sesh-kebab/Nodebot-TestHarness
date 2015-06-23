var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/node_modules', express.static('node_modules'));
app.use('/app', express.static('app'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

var io = require('socket.io')(server);
io.on('connection', function(socket) { 
  console.log('user connected');
  
  socket.on('toggle', function() {
    console.log('toggle called');
  })
});