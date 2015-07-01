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

	initalisePins();
});


function initalisePins() {
	var pin10 = new five.Pin(10);
	pin10.query(function(state) {
	  console.log(state);
	});
	
	var ignoreState = false;
	pin10.read(function(error, value) {
		if (ignoreState === true)
			return;
		
		if (error !== undefined)
			console.log(error);
		else
			console.log(value);
	});
	
	setInterval(function() {
		ignoreState = true;
		pin10.high();
		setTimeout(function() {
			pin10.low();
			ignoreState = false;
		}, 10);
		
	}, 100);
}

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
