var express = require('express'); 
var app = express(); 
var server = require('http').createServer(app); 
var path = require('path');

var raspi = require('raspi-io');
var five = require('johnny-five');

var board = new five.Board({
	io: new raspi()
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/node_modules', express.static('node_modules'));
app.use('/app', express.static('app'));

var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Nodebot - Test Harness listening at http://%s:%s', host, port);
});

var led = undefined;
var ledState = false;
board.on("ready", function() {
	led = new five.Led('P1-8');
	led.off();
	
	var proximity = new five.Proximity({
    	controller: 'HCSR04',
    	pin: 'P1-10'
  	});
	  
	proximity.on('data', function() {
		console.log(this);
	});
});

var io = require('socket.io')(server);
io.on('connection', function(socket) { 
	console.log('user connected');
  
	socket.on('toggle', function() {
		console.log('toggle called');
		
		if (led !== undefined) {
			console.log('ledState: ' + ledState);
			ledState === true ? led.off() : led.on();
			ledState = !ledState;      
		}
	});
});
