var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');

//var GPIO = require('onoff').Gpio,
//  green = new GPIO(14, 'out');

var gpio = require('pi-gpio');

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
    
//    var state = green.readSync();
//    green.writeSync(Number(!state));
    gpio.open(14, 'output', function (params) {
      gpio.read(14, function(err, value){
        console.log('pin value:' + value);
        gpio.write(14, 1);
      });
    });
    
    
  });
});